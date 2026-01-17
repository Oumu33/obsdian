# jenkins参数化构建

> 来源: CI/CD
> 创建时间: 2023-07-12T20:49:32+08:00
> 更新时间: 2026-01-17T19:20:37.190540+08:00
> 阅读量: 1557 | 点赞: 0

---

项目构建的过程中，我们通常需要根据用户的输入的不同参数，触发不同的构建步骤，从而影响整个构建结果。这时我们可以使用参数化构建。

接下来以gitee项目不同的分支来部署不同的项目为例演示。

# 项目创建测试分支并推送至仓库
## main生产分支内容
## ![](images/1768648837215_1689169724210-0f20c382-4dd1-4c7c-8c1a-eecf748ae2cb.png)
## test测试分支内容
![](images/1768648837275_1689169776385-d8acc92c-e938-45aa-b169-bbff1d9b143c.png)

# 修改jenkins配置
## 添加字符串类型参数
![](images/1768648837335_1689169999622-83837081-2185-4882-8022-7bead3df5630.png)

## 修改pipeline
在拉取代码环节，使用${branch}引用变量

```bash
pipeline {
    agent any

    stages {
        stage('拉取代码') {
            steps {
                checkout scmGit(branches: [[name: '*/${branch}']], extensions: [], userRemoteConfigs: [[credentialsId: 'gitee-cuiliang0302', url: 'https://gitee.com/cuiliang0302/sprint_boot_demo.git']])
            }
        }
        stage('编译构建') {
            steps {
                sh 'mvn clean package'
            }
        }
        stage('部署运行') {
            steps {
                sh 'nohup java -jar target/SpringBootDemo-0.0.1-SNAPSHOT.jar &'
                sh 'sleep 60'
            }
        }
    }
}
```

# 构建测试
## 设定参数
点击立即构建，输入变量参数test。

![](images/1768648837392_1689170247074-5c88e6b9-c1bc-4231-a126-07ed8318dbec.png)

## 结果验证
访问springboot页面如下所示

![](images/1768648837449_1689171112221-a42a33e6-2fbb-455c-b74a-241b7ea8129f.png)


