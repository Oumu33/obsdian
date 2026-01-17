# jenkins基本设置

> 来源: CI/CD
> 创建时间: 2023-06-26T16:56:35+08:00
> 更新时间: 2026-01-17T19:20:32.511828+08:00
> 阅读量: 2880 | 点赞: 2

---

#  初始化设置
## 获取管理员密码
```bash
[root@tiaoban cicd]# cat /var/jenkins_home/secrets/initialAdminPassword
0ce189b4fad94ad487ec3263a061a3be
```

## 安装推荐的插件
![](images/1768648832536_1686366251538-e24dba80-62cb-49de-ad76-f3c11acc0df4.png)

## 创建管理员用户
也可以继续使用admin账号，在系统页面修改密码。

![](images/1768648832597_1687683415947-db0fa0cf-cef7-4bc8-b338-21ec2bbe7d4f.png)

## 配置jenkins地址
如果是docker或者rpm包方式部署，填写jenkins域名即可，如果是k8s部署，可以填写svc形式。即http://jenkins.cicd.svc:8080/

![](images/1768648832654_1687683549538-92b5822d-1a3a-448f-a6ef-c8caae8587c7.png)

# 使用配置
## 修改admin用户密码和时区
依次点击用户名——>Configure找到密码和时区设置

![](images/1768648832712_1687683707573-8cb66e18-40c5-4227-911c-c530b568314f.png)

## 修改插件安装源
修改为国内插件源地址，提高插件下载速度

[https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json](https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json)

![](images/1768648832770_1687782978593-d83bde59-e675-42c4-962c-87e354d623b8.png)

## 插件卸载
如果遇到插件异常导致jenkins系统无法使用，可以尝试卸载异常插件

```bash
# 停止jenkins服务
systemctl stop jenkins
# 删除插件目录下异常插件.jpi文件
rm -rf /var/jenkins_home/plugins/role-strategy.jpi
# 重启jenkins
systemctl start jenkins
```


