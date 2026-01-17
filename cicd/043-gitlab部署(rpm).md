# gitlab部署(rpm)

> 来源: CI/CD
> 创建时间: 2022-09-11T20:31:56+08:00
> 更新时间: 2026-01-17T19:20:51.903901+08:00
> 阅读量: 2739 | 点赞: 0

---

# 参考文档
安装文档：[https://docs.gitlab.com/omnibus/installation/](https://docs.gitlab.com/omnibus/installation/)

rpm软件包地址：[https://packages.gitlab.com/gitlab/gitlab-ce](https://packages.gitlab.com/gitlab/gitlab-ce)

国内下载地址：[https://mirror.tuna.tsinghua.edu.cn/help/gitlab-ce/](https://mirror.tuna.tsinghua.edu.cn/help/gitlab-ce/)

# rpm包安装
## 一键在线安装
参考文档：[https://packages.gitlab.com/gitlab/gitlab-ce/install#bash-rpm](https://packages.gitlab.com/gitlab/gitlab-ce/install#bash-rpm)

## 离线安装
```bash
[root@tiaoban ~]# wget --content-disposition https://packages.gitlab.com/gitlab/gitlab-ce/packages/el/8/gitlab-ce-16.10.2-ce.0.el8.x86_64.rpm/download.rpm
[root@tiaoban ~]# ls
gitlab-ce-16.10.2-ce.0.el8.x86_64.rpm
[root@gitlab ~]# dnf -y install gitlab-ce-16.10.2-ce.0.el8.x86_64.rpm
[root@tiaoban ~]# vim /etc/gitlab/gitlab.rb # 编辑站点地址
32 external_url 'http://192.168.10.100'
[root@tiaoban ~]# gitlab-ctl reconfigure # 初始化配置
```

服务管理命令

```bash
[root@tiaoban gitlab]# gitlab-ctl start
[root@tiaoban gitlab]# gitlab-ctl status
[root@tiaoban gitlab]# gitlab-ctl stop
```

登录web页面

![](images/1768648851928_1682086490997-b1feff85-5fac-465e-b6ef-caccdd1c1f2d.png)

获取默认密码

```bash
[root@tiaoban gitlab]# cat /etc/gitlab/initial_root_password
# WARNING: This value is valid only in the following conditions
#          1. If provided manually (either via `GITLAB_ROOT_PASSWORD` environment variable or via `gitlab_rails['initial_root_password']` setting in `gitlab.rb`, it was provided before database was seeded for the first time (usually, the first reconfigure run).
#          2. Password hasn't been changed manually, either via UI or via command line.
#
#          If the password shown here doesn't work, you must reset the admin password following https://docs.gitlab.com/ee/security/reset_user_password.html#reset-your-root-password.

Password: XsxXm07NOya6YBDnUHAFszBTKRvcF77buwIOegX5T+I=

# NOTE: This file will be automatically deleted in the first reconfigure run after 24 hours.
```

# 

