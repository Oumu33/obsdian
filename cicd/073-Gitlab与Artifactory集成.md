# Gitlab与Artifactory集成

> 来源: CI/CD
> 创建时间: 2024-05-31T11:21:40+08:00
> 更新时间: 2026-01-17T19:21:07.895940+08:00
> 阅读量: 406 | 点赞: 0

---

# Artifactory配置
## 创建仓库
![](images/1768648867920_1717339450640-86fe43e6-3f9e-4408-b0e0-07144711524f.png)

## 获取命令
获取上传命令

![](images/1768648868001_1717339489803-3c84e302-6f4c-4823-aa42-b6eb52253502.png)

获取下载命令

![](images/1768648868100_1717376448633-cacb0930-243a-437c-8d13-cb56b5dbc462.png)

# gitlab配置
## 创建Artifactory密钥变量
![](images/1768648868279_1717339585450-24a89174-d93e-4c5e-98dc-3120cd4a315b.png)

## 编辑流水线
```yaml
default:
  cache: 
    paths: # 定义全局缓存路径
     - target/

variables: # 定义制品存储路径
  ARTIFACT_NAME: $CI_PROJECT_NAME/$CI_COMMIT_BRANCH/$CI_COMMIT_SHORT_SHA-$CI_PIPELINE_ID.jar

stages:
  - build
  - product
  - deploy

build:
  stage: build
  tags:
    - java
  script:
    - mvn clean package # 编译打包
    - ls target

product: 
  stage: product
  tags: # 在java机器上传制品
    - java
  script:
    - curl -uadmin:$ARTIFACTORY_KEY -T target/*.jar "http://192.168.10.76:8081/artifactory/devops/$ARTIFACT_NAME"

deploy:
  stage: deploy
  tags: # 在docker机器下载制品
    - docker
  script:
    - apk add --update curl
    - curl -uadmin:$ARTIFACTORY_KEY -L -O "http://192.168.10.76:8081/artifactory/devops/$ARTIFACT_NAME"
    - ls
  cache:
    policy: push  #不上传缓存
```

## 查看上传信息
![](images/1768648868391_1717378738148-47c626ff-90f3-4e2f-a456-c6e4928b8ed2.png)

## 查看下载信息
![](images/1768648868564_1717378762076-678d8f15-fa65-4b54-a1ba-fe5a741da4f5.png)


