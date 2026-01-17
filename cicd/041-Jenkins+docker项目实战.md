# Jenkins+docker项目实战

> 来源: CI/CD
> 创建时间: 2024-05-14T16:55:38+08:00
> 更新时间: 2026-01-17T19:20:47.552666+08:00
> 阅读量: 2439 | 点赞: 0

---

# 准备工作
## 服务器列表
| 服务器名称 | 主机名 | IP | 部署服务 |
| --- | --- | --- | --- |
| 代码托管服务器 | gitlab | 192.168.10.72 | Gitlab |
| 持续集成服务器 | jenkins | 192.168.10.73 | Jenkins、Maven、Docker |
| 代码审查服务器 | sonarqube | 192.168.10.71 | SonarQube |
| 镜像仓库服务器 | harbor | 192.168.10.100 | Docker、harbor |
| 服务部署服务器 | springboot | 192.168.10.74 | Docker |


## 服务部署(rpm方式)
gitlab部署

参考文档：[https://www.cuiliangblog.cn/detail/section/92727905](https://www.cuiliangblog.cn/detail/section/92727905)

jenkins部署

参考文档：[https://www.cuiliangblog.cn/detail/section/15130009](https://www.cuiliangblog.cn/detail/section/15130009)

docker部署

参考文档：[https://www.cuiliangblog.cn/detail/section/26447182](https://www.cuiliangblog.cn/detail/section/26447182)

harbor部署

参考文档：[https://www.cuiliangblog.cn/detail/section/15189547](https://www.cuiliangblog.cn/detail/section/15189547)

SonarQube部署

参考文档：[https://www.cuiliangblog.cn/detail/section/131467837](https://www.cuiliangblog.cn/detail/section/131467837)

# harbor项目权限配置
## 创建项目
Harbor的项目分为公开和私有的:  
公开项目:所有用户都可以访问，通常存放公共的镜像，默认有一个library公开项目。  
私有项目:只有授权用户才可以访问，通常存放项目本身的镜像。 我们可以为微服务项目创建一个新的项目  
![](images/1768648847578_1713450576001-00d81474-d0d3-45c5-bb5a-36e6b3abd867.png)

## 创建用户
创建一个普通用户cuiliang。  
![](images/1768648847703_1713450639192-d53761e4-9551-4760-8ac0-32563e7a0d98.png)

## 配置项目用户权限
在spring_boot_demo项目中添加普通用户cuiliang，并设置角色为开发者。  
![](images/1768648847846_1713450700161-72988a92-4760-460c-8bc4-2c94a54c9eb8.png)  
权限说明

| 角色 | 权限 |
| --- | --- |
| 访客 | 对项目有只读权限 |
| 开发人员 | 对项目有读写权限 |
| 维护人员 | 对项目有读写权限、创建webhook权限 |
| 项目管理员 | 出上述外，还有用户管理等权限 |


## 上传下载镜像测试
可参考文章[https://www.cuiliangblog.cn/detail/section/15189547](https://www.cuiliangblog.cn/detail/section/15189547)，此处不再赘述。

# gitlab项目权限配置
具体gitlab权限配置参考文档：[https://www.cuiliangblog.cn/detail/section/131513569](https://www.cuiliangblog.cn/detail/section/131513569)  
创建开发组develop，用户cuiliang，项目spring boot demo

## 创建组
管理员用户登录，创建群组，组名称为devops，组权限为私有

![](images/1768648847969_1718764833183-249ea21e-45ad-412a-9d70-66ee5b47b1ad.png)

## 创建项目
导入外部项目，地址为[https://gitee.com/cuiliang0302/spring_boot_demo.git](https://gitee.com/cuiliang0302/spring_boot_demo.git)，并指定devops，项目类型为私有。

![](images/1768648848084_1718764935565-6fff7323-b236-4857-95e1-056b532f63a9.png)

## 创建用户
创建一个普通用户cuiliang  
![](images/1768648848285_1713491244121-535b56ef-f11d-4231-a9c7-b3acf1ee8980.png)

## 用户添加到组中
将cuiliang添加到群组devops中，cuiliang角色为Developer

![](images/1768648848411_1718765097936-cc845d32-e417-407a-aed6-2ac562dfb12c.png)

## 开启分支推送权限
![](images/1768648848581_1713492747131-f9c230c1-8512-4ee2-a2e8-8101cc0092e5.png)

# jenkins流水线配置
## 拉取gitlab仓库代码
具体步骤可参考文档：[https://www.cuiliangblog.cn/detail/section/127410630](https://www.cuiliangblog.cn/detail/section/127410630)，此处以账号密码验证为例，并启用webhook配置。  
jenkins流水线配置如下  
![](images/1768648848752_1713879716636-73836bff-15b5-4b9e-8964-80458011b919.png)  
拉取代码部分的jenkinsfile如下

```groovy
pipeline {
    agent any
    stages {
        stage('拉取代码') {
            environment {
                // gitlab仓库信息
                GITLAB_CRED = "gitlab-cuiliang-password"
                GITLAB_URL = "http://192.168.10.72/devops/spring_boot_demo.git"
            }
            steps {
                echo '开始拉取代码'
                checkout scmGit(branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[credentialsId: "${GITLAB_CRED}", url: "${GITLAB_URL}"]])
                echo '拉取代码完成'
            }
        }
    }
}
```

当git仓库提交代码后，Gitlab会自动请求Jenkins的webhook地址，自动触发流水线，执行结果如下：  
![](images/1768648848855_1713879758227-09dcf91f-2f79-4e2a-8ac2-2d3e79dba579.png)

## Maven打包编译
具体步骤可参考文档：[https://www.cuiliangblog.cn/detail/section/131898197](https://www.cuiliangblog.cn/detail/section/131898197)  
打包编译部分的jenkinsfile如下

```groovy
pipeline {
    agent any
    stages {
        stage('拉取代码') {
            ……
        }

        stage('打包编译') {
            steps {
                echo '开始打包编译'
                sh 'mvn clean package'
                echo '打包编译完成'
            }
        }
    }
}
```

触发流水线结果如下  
![](images/1768648848951_1713881693245-522ce4e2-e5f4-4232-9e2b-1a57aeb949cb.png)

## SonarQube代码审查
具体步骤可参考文档：[https://www.cuiliangblog.cn/detail/section/165534414](https://www.cuiliangblog.cn/detail/section/165534414)  
代码审查阶段的jenkinsfile如下

```groovy
pipeline {
    agent any
    stages {
        stage('拉取代码') {
            ……
        }

        stage('打包编译') {
            ……
        }

        stage('代码审查') {
            environment {
                // SonarQube信息
                SONARQUBE_SCANNER = "SonarQubeScanner"
                SONARQUBE_SERVER = "SonarQubeServer"
            }
            steps{
                echo '开始代码审查'
                script {
                    def scannerHome = tool "${SONARQUBE_SCANNER}"
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh "${scannerHome}/bin/sonar-scanner -Dproject.settings=cicd/sonar-project.properties"
                    }
                }
                echo '代码审查完成'
            }
        }
    }
}
```

触发流水线结果如下  
![](images/1768648849042_1713881925428-34c182e6-c7be-43e7-ad1c-a2675f3f6c48.png)  
代码审查结果如下  
![](images/1768648849141_1713881899977-4937a6d8-d856-4094-867b-2ba1984db80b.png)

## 构建并推送镜像至仓库
具体步骤可参考文档：[https://www.cuiliangblog.cn/detail/section/166573065](https://www.cuiliangblog.cn/detail/section/166573065)  
构建并推送镜像的jenkinsfile如下

```groovy
pipeline {
    agent any
    stages {
        stage('拉取代码') {
            ……
        }

        stage('打包编译') {
            ……
        }

        stage('代码审查') {
            ……
        }

        stage('构建镜像') {
            environment {
                // harbor仓库信息
                HARBOR_URL = "harbor.local.com"
                HARBOR_PROJECT = "devops"
                // 镜像名称
                IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
            }
            steps {
                echo '开始构建镜像'
                script {
                    IMAGE_NAME = "${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_APP}:${IMAGE_TAG}"
                    docker.build "${IMAGE_NAME}", "-f cicd/Dockerfile ."
                }
                echo '构建镜像完成'
                echo '开始推送镜像'
                script {
                    docker.withRegistry("https://${HARBOR_URL}", "${HARBOR_CRED}") {
                        docker.image("${IMAGE_NAME}").push()
                    }
                }
                echo '推送镜像完成'
                echo '开始删除镜像'
                script {
                    sh "docker rmi -f ${IMAGE_NAME}"
                }
                echo '删除镜像完成'
            }
        }
    }
}
```

触发流水线结果如下  
![](images/1768648849219_1713882812879-77746b75-282e-42e7-8fcf-440f7c2f574e.png)  
查看harbor镜像仓库，已上传镜像  
![](images/1768648849318_1713882852925-5dd1c00b-7553-448c-82b7-d5a479b7507e.png)

## docker运行服务
远程执行命令具体内容可参考文档：[https://www.cuiliangblog.cn/detail/section/166296541](https://www.cuiliangblog.cn/detail/section/166296541)  
部署运行阶段的jenkinsfile如下

```groovy
pipeline {
    agent any
    environment {
        // 全局变量
        HARBOR_CRED = "harbor-cuiliang-password"
        IMAGE_NAME = ""
        IMAGE_APP = "demo"
    } 
    stages {
        stage('拉取代码') {
            ……
        }

        stage('打包编译') {
            ……
        }

        stage('代码审查') {
            ……
        }

        stage('构建镜像') {
            ……
        }
        stage('项目部署') {
            environment {
                // 目标主机信息
                HOST_NAME = "springboot1"
            }
            steps {
                echo '开始部署项目'
                // 获取harbor账号密码
                withCredentials([usernamePassword(credentialsId: "${HARBOR_CRED}", passwordVariable: 'HARBOR_PASSWORD', usernameVariable: 'HARBOR_USERNAME')]) {
                    // 执行远程命令
                    sshPublisher(publishers: [sshPublisherDesc(configName: "${HOST_NAME}", transfers: [sshTransfer(
                        cleanRemote: false, excludes: '', execCommand: "sh -x /opt/jenkins/springboot/deployment-docker.sh ${HARBOR_USERNAME} ${HARBOR_PASSWORD} ${IMAGE_NAME} ${IMAGE_APP}",
                        execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/opt/jenkins/springboot',
                        remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'cicd/deployment-docker.sh')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false
                    )])
                }
                echo '部署项目完成'
            }
        }
    }
}
```

触发流水线后运行结果如下  
![](images/1768648849413_1713927156770-48181359-1411-4ed0-b8e8-529c78a1e8ba.png)  
登录springboot服务器验证

```groovy
[root@springboot ~]# docker ps
CONTAINER ID   IMAGE                                            COMMAND                CREATED              STATUS                          PORTS                                       NAMES
e80896487125   harbor.local.com/spring_boot_demo/demo:8880a30   "java -jar /app.jar"   About a minute ago   Up About a minute (unhealthy)   0.0.0.0:8888->8888/tcp, :::8888->8888/tcp   demo
[root@springboot ~]# curl 127.0.0.1:8888/
<h1>Hello SpringBoot</h1><p>Version:v2 Env:test</p>[root@springboot1 ~]# 
[root@springboot ~]# ls /opt/jenkins/springboot/
deployment.sh  Dockerfile  email.html  Jenkinsfile  LICENSE  mvnw  mvnw.cmd  pom.xml  readme.md  sonar-project.properties  src  target  test
```

## 添加邮件通知推送
发送邮件配置具体内容可参考文档：[https://www.cuiliangblog.cn/detail/section/133029974](https://www.cuiliangblog.cn/detail/section/133029974)  
在项目根路径下新增email.html文件，内容如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${ENV, var="JOB_NAME"}-第${BUILD_NUMBER}次构建日志</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 1000px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
      }
      .container h2 {
        text-align: center;
      }
      .logo img {
        max-width: 150px;
        height: auto;
      }
      .content {
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 5px;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <h2>Jenkins ${PROJECT_NAME}项目构建结果</h2>
        <p>尊敬的用户：</p>
        <p>${PROJECT_NAME}项目构建结果为<span style="color:red;font-weight: bold;">${BUILD_STATUS}</span>，以下是详细信息：</p>
        <h4>构建信息</h4>
        <hr/>
        <ul>
          <li>项目名称：${PROJECT_NAME}</li>
          <li>构建编号：第${BUILD_NUMBER}次构建</li>
          <li>触发原因：${CAUSE}</li>
          <li>构建状态：${BUILD_STATUS}</li>
          <li>构建日志：<a href="${BUILD_URL}console">${BUILD_URL}console</a></li>
          <li>构建Url：<a href="${BUILD_URL}">${BUILD_URL}</a></li>
          <li>工作目录：<a href="${PROJECT_URL}ws">${PROJECT_URL}ws</a></li>
          <li>项目Url：<a href="${PROJECT_URL}">${PROJECT_URL}</a></li>
        </ul>
        <h4>失败用例</h4>
        <hr/>
        <p>$FAILED_TESTS</p>
        <h4>最近提交</h4>
        <hr/>
        <ul>
          ${CHANGES_SINCE_LAST_SUCCESS, reverse=true, format="%c", changesFormat="<li>%d [%a] %m</li>"}
        </ul>
        <h4>提交详情</h4>
        <hr/>
        <p><a href="${PROJECT_URL}changes">${PROJECT_URL}changes</a></p>
        <p style="margin-top:50px">如有任何疑问或需要帮助，请随时联系我们。</p>
      </div>
      <div class="footer">
        <p>此为系统自动发送邮件，请勿回复。</p>
      </div>
    </div>
  </body>
</html>
```

完整的jenkinsfile如下

```groovy
pipeline {
    agent any
    environment {
        // 全局变量
        HARBOR_CRED = "harbor-cuiliang-password"
        IMAGE_NAME = ""
        IMAGE_APP = "demo"
    } 
    stages {
        stage('拉取代码') {
            environment {
                // gitlab仓库信息
                GITLAB_CRED = "gitlab-cuiliang-password"
                GITLAB_URL = "http://192.168.10.72/devops/spring_boot_demo.git"
            }
            steps {
                echo '开始拉取代码'
                checkout scmGit(branches: [[name: '*/master']], extensions: [], userRemoteConfigs: [[credentialsId: "${GITLAB_CRED}", url: "${GITLAB_URL}"]])
                echo '拉取代码完成'
            }
        }
        stage('打包编译') {
            steps {
                echo '开始打包编译'
                sh 'mvn clean package'
                echo '打包编译完成'
            }
        }
        stage('代码审查') {
            environment {
                // SonarQube信息
                SONARQUBE_SCANNER = "SonarQubeScanner"
                SONARQUBE_SERVER = "SonarQubeServer"
            }
            steps{
                echo '开始代码审查'
                script {
                    def scannerHome = tool "${SONARQUBE_SCANNER}"
                    withSonarQubeEnv("${SONARQUBE_SERVER}") {
                        sh "${scannerHome}/bin/sonar-scanner -Dproject.settings=cicd/sonar-project.properties"
                    }
                }
                echo '代码审查完成'
            }
        }
        stage('构建镜像') {
            environment {
                // harbor仓库信息
                HARBOR_URL = "harbor.local.com"
                HARBOR_PROJECT = "devops"
                // 镜像名称
                IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
            }
            steps {
                echo '开始构建镜像'
                script {
                    IMAGE_NAME = "${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_APP}:${IMAGE_TAG}"
                    docker.build "${IMAGE_NAME}", "-f cicd/Dockerfile ."
                }
                echo '构建镜像完成'
                echo '开始推送镜像'
                script {
                    docker.withRegistry("https://${HARBOR_URL}", "${HARBOR_CRED}") {
                        docker.image("${IMAGE_NAME}").push()
                    }
                }
                echo '推送镜像完成'
                echo '开始删除镜像'
                script {
                    sh "docker rmi -f ${IMAGE_NAME}"
                }
                echo '删除镜像完成'
            }
        }
        stage('项目部署') {
            environment {
                // 目标主机信息
                HOST_NAME = "springboot1"
            }
            steps {
                echo '开始部署项目'
                // 获取harbor账号密码
                withCredentials([usernamePassword(credentialsId: "${HARBOR_CRED}", passwordVariable: 'HARBOR_PASSWORD', usernameVariable: 'HARBOR_USERNAME')]) {
                    // 执行远程命令
                    sshPublisher(publishers: [sshPublisherDesc(configName: "${HOST_NAME}", transfers: [sshTransfer(
                        cleanRemote: false, excludes: '', execCommand: "sh -x /opt/jenkins/springboot/deployment-docker.sh ${HARBOR_USERNAME} ${HARBOR_PASSWORD} ${IMAGE_NAME} ${IMAGE_APP}",
                        execTimeout: 120000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '/opt/jenkins/springboot',
                        remoteDirectorySDF: false, removePrefix: '', sourceFiles: 'cicd/deployment-docker.sh')], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: false
                    )])
                }
                echo '部署项目完成'
            }
        }
    }
    post {
        always {
            echo '开始发送邮件通知'
            // 构建后发送邮件
            emailext(
                subject: '构建通知：${PROJECT_NAME} - Build # ${BUILD_NUMBER} - ${BUILD_STATUS}!',
                body: '${FILE,path="email.html"}',
                to: 'cuiliang0302@qq.com'
            )
            echo '邮件通知发送完成'
        }
    }
}
```

触发流水线后运行结果如下  
![](images/1768648849524_1713927297169-7efcdff6-3bb6-4d69-815e-853290dd86db.png)  
邮件通知内容如下  
![](images/1768648849628_1713925186157-66a1610a-ccd0-493a-883e-e70ed1d15d48.png)  
至此，整个CICD流程完成。


