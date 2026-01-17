# gitlab设置

> 来源: CI/CD
> 创建时间: 2023-06-09T13:11:23+08:00
> 更新时间: 2026-01-17T19:20:52.519522+08:00
> 阅读量: 1960 | 点赞: 0

---

# 常用设置
## 获取root用户密码
```bash
[root@tiaoban gitlab]# kubectl exec -it -n gitlab gitlab-645b7cccf-xwg7s -- bash
root@gitlab-645b7cccf-xwg7s:/# cat /etc/gitlab/initial_root_password | grep Password
Password: BwoXKC3qGABwhtLOFERuMzA4ZK+baSr9NRKhDIwI3Xo=
```

## 修改root密码
使用临时密码登录后依次点击Admin Area——>Overview——>Users——>Edit，然后修改密码即可。

![](images/1768648852544_1714356938189-b8824f0d-ba37-4b8f-9fa2-d22eb8013972.png)

![](images/1768648852730_1714356987721-ff3a03a6-2eb3-4009-86e5-8c4abb1c08d2.png)

## 更换为中文
点击左上角头像——>Perferences——>Localization——>将language改为中文，然后刷新页面即可。

![](images/1768648852827_1714357083420-b9fde447-3615-4942-988f-c6c484fb9c83.png)

## 头像不显示问题
<font style="color:rgb(77, 77, 77);">本地安装完GitLab服务后，会发现用户的头像部分显示不了。原因是因为GitLab默认使用了Gravatar的头像，而Gravatar目前是被墙的。所以访问不了，解决问题的办法就是更换其URL为国内的某个镜像URL。</font>

```bash
[root@tiaoban gitlab]# kubectl exec -it -n gitlab gitlab-645b7cccf-xwg7s -- bash
root@gitlab-645b7cccf-xwg7s:/# vi /etc/gitlab/gitlab.rb
# 注释原本的plain_url和ssl_url改为国内地址
gitlab_rails['gravatar_plain_url'] = 'http://gravatar.loli.net/avatar/%{hash}?s=%{size}&d=identicon'
gitlab_rails['gravatar_ssl_url'] = 'https://gravatar.loli.net/avatar/%{hash}?s=%{size}&d=identicon'
# 重载配置
root@gitlab-645b7cccf-xwg7s:/# gitlab-ctl reconfigure
# 重启gitlab
root@gitlab-645b7cccf-xwg7s:/# gitlab-ctl restart
```

## git地址不正确问题
如果 git clone 仓库时，复制的命令不是 gitlab 仓库地址，可修改配置文件：

```bash
[root@tiaoban gitlab]# kubectl exec -it -n gitlab gitlab-645b7cccf-xwg7s -- bash
root@gitlab-645b7cccf-xwg7s:#  vi /etc/gitlab/gitlab.rb
external_url 'http://gitlab.cuiliangblog.cn'
# 重载配置
root@gitlab-645b7cccf-xwg7s:/# gitlab-ctl reconfigure
# 重启gitlab
root@gitlab-645b7cccf-xwg7s:/# gitlab-ctl restart
```

## 配置项文档
gitlab配置参考文档：[https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/files/gitlab-config-template/gitlab.rb.template?_gl=1%2attjwk6%2a_ga%2aMjExNTA5MzkyNS4xNjgyMDg0ODYx%2a_ga_ENFH3X7M5Y%2aMTY4NTc3ODQ1My4xOC4xLjE2ODU3NzkxNDMuMC4wLjA.](https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/files/gitlab-config-template/gitlab.rb.template?_gl=1%2attjwk6%2a_ga%2aMjExNTA5MzkyNS4xNjgyMDg0ODYx%2a_ga_ENFH3X7M5Y%2aMTY4NTc3ODQ1My4xOC4xLjE2ODU3NzkxNDMuMC4wLjA.)

# gitlab常用命令
```bash
# 获取详细日志信息
gitlab-ctl tail 
# 检查组件状态
gitlab-ctl status
# 修改默认的配置文件；
vim /etc/gitlab/gitlab.rb  
# 重载配置
gitlab-ctl reconfigure
# 启动所有 gitlab 组件；
gitlab-ctl start    
# 停止所有 gitlab 组件；
gitlab-ctl stop      
# 重启所有 gitlab 组件；
gitlab-ctl restart        
# 检查gitlab；
gitlab-rake gitlab:check SANITIZE=true --trace   
```


