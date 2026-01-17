# Artifactory部署(docker)

> 来源: CI/CD
> 创建时间: 2024-06-01T22:40:33+08:00
> 更新时间: 2026-01-17T19:20:29.630026+08:00
> 阅读量: 843 | 点赞: 0

---

# 拉取镜像
```bash
[root@artifactory ~]# docker pull releases-docker.jfrog.io/jfrog/artifactory-oss:latest
```

# 运行容器
```bash
docker run --name artifactory -v $JFROG_HOME/artifactory/var/:/var/opt/jfrog/artifactory -d -p 8081:8081 -p 8082:8082 releases-docker.jfrog.io/jfrog/artifactory-oss:latest
```

# 配置PostgreSQL15数据库
pgsql 数据库安装与创建账号授权参考上一章配置

```bash
[root@artifactory ~]# vim /opt/docker/artifactory/etc/system.yaml
  database:
    type: postgresql
    driver: org.postgresql.Driver
    url: "jdbc:postgresql://192.168.10.73:5432/artifactory"
    username: artifactory
    password: artifactory
```

配置完成后重启容器即可。


