# jenkins部署(docker)

> 来源: CI/CD
> 创建时间: 2023-06-26T15:34:01+08:00
> 更新时间: 2026-01-17T19:20:32.128039+08:00
> 阅读量: 2228 | 点赞: 0

---

# 拉取Jenkins镜像
```bash
docker pull jenkins/jenkins:2.401.2-lts
```

# 运行容器
```bash
docker run --name jenkins -p 8080:8080 -d --restart=always -v $PWD/data:/var/jenkins_home jenkins/jenkins:2.401.2-lts
```

 

# 访问jenkins 
+ 在浏览器中访问 http://主机ip:8080/


