#!/usr/bin/env node
/**
 * 崔亮博客 CICD 目录爬虫
 * 通过 Django REST Framework API 抓取 CICD 目录内容
 */

const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const { URL } = require('url');

const CATALOG_ID = '1';
const API_BASE = 'https://api.cuiliangblog.cn/v1/blog';
const OUTPUT_DIR = '/opt/obsdian/cicd';
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');

// 统计数据
const stats = {
  sections: 0,
  images: 0,
  errors: []
};

// HTTP请求封装
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const opts = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.cuiliangblog.cn/',
        ...options.headers
      }
    };

    const req = protocol.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve({ data: JSON.parse(data), statusCode: res.statusCode, headers: res.headers });
          } catch (e) {
            resolve({ data, statusCode: res.statusCode, headers: res.headers });
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// 下载图片
async function downloadImage(imageUrl, localPath, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(imageUrl);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    // 根据域名设置不同的 Referer
    let referer = 'https://www.cuiliangblog.cn/';
    if (imageUrl.includes('cdn.nlark.com')) {
      referer = 'https://www.yuque.com/';
    } else if (imageUrl.includes('oss.cuiliangblog.cn')) {
      referer = 'https://www.cuiliangblog.cn/';
    }

    const opts = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': referer,
        'Accept': 'image/*,*/*'
      }
    };

    const req = protocol.request(opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadImage(res.headers.location, localPath).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', async () => {
        try {
          await fs.mkdir(path.dirname(localPath), { recursive: true });
          await fs.writeFile(localPath, Buffer.concat(chunks));
          resolve(localPath);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      if (retryCount < 3) {
        console.log(`  重试下载图片 (${retryCount + 1}/3): ${imageUrl.substring(0, 50)}...`);
        setTimeout(() => {
          downloadImage(imageUrl, localPath, retryCount + 1).then(resolve).catch(reject);
        }, 1000 * (retryCount + 1));
      } else {
        reject(err);
      }
    });

    req.setTimeout(60000, () => {
      req.destroy();
      if (retryCount < 3) {
        console.log(`  超时重试下载图片 (${retryCount + 1}/3): ${imageUrl.substring(0, 50)}...`);
        setTimeout(() => {
          downloadImage(imageUrl, localPath, retryCount + 1).then(resolve).catch(reject);
        }, 1000 * (retryCount + 1));
      } else {
        reject(new Error('Image download timeout'));
      }
    });
    req.end();
  });
}

// 处理Markdown中的图片
async function processImages(content) {
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let newContent = content;
  const matches = [...content.matchAll(imageRegex)];

  for (const match of matches) {
    const [fullMatch, altText, imageUrl] = match;

    if (!imageUrl.startsWith('http')) continue;

    try {
      const urlObj = new URL(imageUrl);
      const ext = path.extname(urlObj.pathname) || '.png';
      // 使用 URL 路径的最后部分作为文件名
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      const originalName = pathParts[pathParts.length - 1] || 'image';
      // 清理文件名，移除特殊字符
      const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 50);
      // 添加时间戳避免冲突
      const timestamp = Date.now();
      const safeName = `${timestamp}_${cleanName}${ext}`;
      const localImagePath = path.join(IMAGES_DIR, safeName);
      const relativeImagePath = `images/${safeName}`;

      await downloadImage(imageUrl, localImagePath);
      newContent = newContent.replace(fullMatch, `![${altText}](${relativeImagePath})`);
      stats.images++;
      process.stdout.write(`📷`);
    } catch (e) {
      stats.errors.push(`图片下载失败: ${imageUrl.substring(0, 50)}... - ${e.message}`);
    }
  }

  return newContent;
}

// 清理文件名
function sanitizeFileName(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s+/g, '-')
    .substring(0, 200);
}

// 获取单个目录
async function getCatalogue(catalogueId) {
  const result = await fetch(`${API_BASE}/catalogue/${catalogueId}/`);
  return result.data;
}

// 获取章节内容
async function getSection(sectionId) {
  const result = await fetch(`${API_BASE}/section/${sectionId}/`);
  return result.data;
}

// 主函数
async function main() {
  console.log('🚀 CICD 目录爬虫启动');
  console.log(`📋 目录ID: ${CATALOG_ID}`);
  console.log('=' .repeat(50));

  const startTime = Date.now();

  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(IMAGES_DIR, { recursive: true });

    // 获取目录详情
    console.log('📖 获取目录信息...');
    const catalogue = await getCatalogue(CATALOG_ID);
    console.log(`   目录名称: ${catalogue.name || 'CICD'}`);
    console.log(`   描述: ${catalogue.description || ''}`);

    const items = catalogue.catalogue || [];
    const docs = items.filter(i => i.type === 'DOC' && i.doc_id);
    const titles = items.filter(i => i.type === 'TITLE');

    console.log(`   共 ${docs.length} 篇文章, ${titles.length} 个分类`);

    // 处理每个条目
    let sectionIndex = 0;
    let currentTitle = null;

    for (const item of items) {
      if (item.type === 'TITLE') {
        currentTitle = item.title;
        console.log(`\n📂 ${item.title}`);
      } else if (item.type === 'DOC' && item.doc_id) {
        sectionIndex++;
        const paddedIndex = String(sectionIndex).padStart(3, '0');

        try {
          console.log(`  📄 [${sectionIndex}/${docs.length}] ${item.title}`);

          const section = await getSection(item.doc_id);

          // 处理图片
          let processedBody = await processImages(section.body || '');

          // 生成Markdown文件
          const fileName = `${paddedIndex}-${sanitizeFileName(section.title)}.md`;
          const filePath = path.join(OUTPUT_DIR, fileName);

          const fileContent = `# ${section.title}

> 来源: ${section.note || 'CICD教程'}
> 创建时间: ${section.created_time || ''}
> 更新时间: ${section.modified_time || ''}
> 阅读量: ${section.view || 0} | 点赞: ${section.like || 0}

---

${processedBody}
`;

          await fs.writeFile(filePath, fileContent, 'utf8');
          stats.sections++;
          process.stdout.write('✓');

          // 避免请求过快
          await new Promise(r => setTimeout(r, 100));

        } catch (e) {
          stats.errors.push(`章节获取失败: ${item.title} (${item.doc_id}) - ${e.message}`);
          console.log(`  ❌ 失败: ${e.message}`);
        }
      }
    }

    // 生成目录索引
    let tocContent = `# CICD 教程目录

> 来源: https://m.cuiliangblog.cn/catalog/${CATALOG_ID}
> 抓取时间: ${new Date().toISOString()}

---

## 目录

`;

    let lastCategory = null;
    for (const item of items) {
      if (item.type === 'TITLE') {
        tocContent += `\n### ${item.title}\n\n`;
        lastCategory = item.title;
      } else if (item.type === 'DOC' && item.doc_id) {
        const fileName = sanitizeFileName(item.title);
        tocContent += `- [${item.title}](./${fileName}.md)\n`;
      }
    }

    await fs.writeFile(path.join(OUTPUT_DIR, 'index.md'), tocContent, 'utf8');

    // 打印统计
    console.log('\n\n' + '='.repeat(50));
    console.log('✅ 爬取完成!');
    console.log(`📄 章节: ${stats.sections}`);
    console.log(`🖼️  图片: ${stats.images}`);
    console.log(`⏱️  耗时: ${((Date.now() - startTime) / 1000).toFixed(2)} 秒`);

    if (stats.errors.length > 0) {
      console.log(`\n⚠️  错误 (${stats.errors.length}):`);
      stats.errors.slice(0, 10).forEach(e => console.log(`  - ${e}`));
      if (stats.errors.length > 10) {
        console.log(`  ... 还有 ${stats.errors.length - 10} 个错误`);
      }

      await fs.writeFile(
        path.join(OUTPUT_DIR, 'errors.log'),
        stats.errors.join('\n'),
        'utf8'
      );
    }

    console.log(`\n📁 输出目录: ${OUTPUT_DIR}`);

  } catch (e) {
    console.error('❌ 致命错误:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
}

main();
