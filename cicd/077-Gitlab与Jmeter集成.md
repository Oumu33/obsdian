# Gitlab与Jmeter集成

> 来源: CI/CD
> 创建时间: 2024-06-13T21:10:15+08:00
> 更新时间: 2026-01-17T19:21:10.268002+08:00
> 阅读量: 370 | 点赞: 0

---

# 开启Gitlab pages
修改Gitlab配置文件

```bash
[root@gitlab ~]# vim /etc/gitlab/gitlab.rb
pages_external_url "http://pages.local.com/"
gitlab_pages['enable'] = true
gitlab_pages['insecure_ciphers'] = true
```

重启Gitlab

```bash
[root@gitlab ~]# gitlab-ctl reconfigure
[root@gitlab ~]# gitlab-ctl restart
```

菜单出现pages页面则说明成功开启。

![](images/1768648870293_1718285775371-4a85ff2f-5414-43cd-ad58-ae331cb1bb43.png)

# 配置流水线
```bash
stages:
  - test
pages: # job 的名称必须要是 pages
  stage: test
  image: harbor.local.com/cicd/jmeter:5.6.3
  tags:
    - docker
  script: # 生成站点
    - ls "$PWD/jmeter/"
    - "jmeter -n -t $PWD/jmeter/demo.jmx -l report.jt1 -e -o $PWD/public -Jjemter.save.saveservice.output_format=csv -Dserver.rmi.ssl.disable=true"
    - ls $PWD/public/
  artifacts: # 制品
    paths:
      - public
```

# 查看验证
![](images/1768648870385_1718419681711-1c7ee127-9d7c-4615-bad9-644257e34e91.png)

添加hosts文件后访问测试

![](images/1768648870459_1718419698975-e57ab7fa-bf01-4239-99e3-fbed1dbec8b2.png)


