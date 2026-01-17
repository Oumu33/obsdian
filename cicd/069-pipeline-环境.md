# pipeline-环境

> 来源: CI/CD
> 创建时间: 2024-05-31T10:05:03+08:00
> 更新时间: 2026-01-17T19:21:05.777551+08:00
> 阅读量: 500 | 点赞: 0

---

# environment
用于定义和管理你的应用程序部署的目标环境。通过指定 environment，你可以处理不同的部署阶段（如开发、测试、生产等）并管理这些环境中的应用状态。environment 的主要用途包括：

+ **环境名称**：指定应用程序部署的环境名称，比如 development、staging 或 production。
+ **部署路径**：定义应用程序在目标环境中的部署路径，可以通过 URL 访问。
+ **环境保护**：设置受保护的环境，只有特定用户或角色才能部署到这些环境中，增加了部署的安全性。
+ **环境变量**：管理和使用特定环境的变量，在不同环境中可以设置不同的变量值。
+ **审计和跟踪**：通过 GitLab 界面可以查看每个环境的部署历史、当前状态和变更记录，便于审计和跟踪部署情况。
+ **动态环境**：支持动态生成环境，例如为每个合并请求创建一个临时的预览环境。

## 查看环境信息
![](images/1768648865800_1717043978438-f8a37f3e-c433-4440-b1b4-d3b6c19fc82b.png)

## pipeline定义环境
```yaml
stages:
  - build
  - deploy

build:
  stage: build
  tags:
    - docker
  script:
    - echo "build success"

deploy to production:
  stage: deploy
  script: git push production HEAD:master
  environment:
    name: production
    url: https://www.baidu.com
```

## 访问验证
![](images/1768648865923_1717044106168-d921415a-01e1-4d23-9564-5c5b59a12552.png)


