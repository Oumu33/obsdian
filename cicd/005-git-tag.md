# git tag

> 来源: CI/CD
> 创建时间: 2022-06-14T10:19:44+08:00
> 更新时间: 2026-01-17T19:20:27.350366+08:00
> 阅读量: 1203 | 点赞: 0

---

## 版本格式
主版本号.次版本号.修订号，版本号递增规则如下：

1. 主版本号：当你做了不兼容的 API 修改，
2. 次版本号：当你做了向下兼容的功能性新增，
3. 修订号：当你做了向下兼容的问题修正。

## git tag命令
```json
/// 查看标签
// 打印所有标签
git tag
// 打印符合检索条件的标签
git tag -l 1.*.*
// 查看对应标签状态
git checkout 1.0.0

/// 创建标签(本地)
// 创建轻量标签
git tag 1.0.0-light
// 创建带备注标签(推荐)
git tag -a 1.0.0 -m "这是备注信息"
// 针对特定commit版本SHA创建标签
git tag -a 1.0.0 0c3b62d -m "这是备注信息"

/// 删除标签(本地)
git tag -d 1.0.0

/// 将本地标签发布到远程仓库
// 发送所有
git push origin --tags
// 指定版本发送
git push origin 1.0.0

/// 删除远程仓库对应标签
// Git版本 > V1.7.0
git push origin --delete 1.0.0
// 旧版本Git
git push origin :refs/tags/1.0.0
```

## git release
进入到项目仓库，选择release选项卡，可以点击create a new release/Draft a new release创建一个新的release


