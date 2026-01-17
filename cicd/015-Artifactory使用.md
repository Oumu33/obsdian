# Artifactory使用

> 来源: CI/CD
> 创建时间: 2024-06-02T09:55:41+08:00
> 更新时间: 2026-01-17T19:20:29.957455+08:00
> 阅读量: 885 | 点赞: 0

---

# 新建仓库
## 新建本地仓库
![](images/1768648829982_1717293453455-274f75ca-25c6-4578-826f-88531cfcbb5e.png)

## 选择仓库类型
![](images/1768648830041_1717293522709-8f6ebc53-1a62-4cab-a1b5-36241e1d2ebb.png)

## 填写仓库信息
![](images/1768648830108_1717293623977-0ce0de64-3454-416f-a78a-9f9723c05808.png)

## 查看仓库信息
![](images/1768648830168_1717293654634-68843917-82f8-4ebc-9b2a-a1e57846fa8c.png)

## 修改文件大小限制
<font style="color:rgb(77, 77, 77);">认是限制上传文件大小为100MB，我们把它改成0，即不限制大小</font>

![](images/1768648830477_1717293828241-6aa0b553-9748-4c61-9245-c99ef5929da9.png)

# 上传制品到Artifactory
## 通过web页面上传
选择上传的仓库

![](images/1768648830791_1717294082067-a23e0ca3-5280-4996-b934-cea9f641b209.png)

选择文件

![](images/1768648830852_1717294253589-abdc1979-5b0a-4eef-92cc-aaa51ccf8a4d.png)

查看文件信息

![](images/1768648830914_1717294268044-0bc77229-7e53-41f3-9f52-1d315c29d5c0.png)

## 通过API上传
获取api上传命令

![](images/1768648830977_1717339311015-6c650e71-d918-4598-8fb4-acf4cfb6292c.png)

上传文件测试

```bash
[root@client2 ~]# ls
anaconda-ks.cfg
[root@client2 ~]# curl -X PUT -u admin:YOUR_ACCESS_TOKEN  -T  anaconda-ks.cfg  "http://192.168.10.76:8082/artifactory/demo/anaconda-ks.cfg"
{
  "repo" : "demo",
  "path" : "/anaconda-ks.cfg",
  "created" : "2024-06-02T10:25:46.892+08:00",
  "createdBy" : "admin",
  "downloadUri" : "http://192.168.10.76:8082/artifactory/demo/anaconda-ks.cfg",
  "mimeType" : "application/octet-stream",
  "size" : "1174",
  "checksums" : {
    "sha1" : "15bce48ca41a1e4841e5a1c76761a61970658627",
    "md5" : "f86bac0477b416f1cc582562c3495ede",
    "sha256" : "34819659c8e124ed029db6a40c80e9b864465f25cc77807de459907cbecec756"
  },
  "originalChecksums" : {
    "sha256" : "34819659c8e124ed029db6a40c80e9b864465f25cc77807de459907cbecec756"
  },
  "uri" : "http://192.168.10.76:8082/artifactory/demo/anaconda-ks.cfg"
  }
```

查看仓库文件信息

![](images/1768648831037_1717295212174-9ced1100-990c-42e0-9235-4c4d2afda1f8.png)


