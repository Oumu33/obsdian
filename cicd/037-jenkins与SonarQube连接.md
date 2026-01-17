# jenkins与SonarQube连接

> 来源: CI/CD
> 创建时间: 2024-04-14T14:54:10+08:00
> 更新时间: 2026-01-17T19:20:43.150893+08:00
> 阅读量: 1509 | 点赞: 0

---

# <font style="color:rgb(77, 77, 77);">jenkins安装插件</font>
## **<font style="color:rgb(77, 77, 77);">下载SonarQube插件</font>**
<font style="color:rgb(77, 77, 77);">进入Jenkins的系统管理->插件管理->可选插件，搜索框输入sonarqube，安装重启。</font>

![](images/1768648843175_1713078944076-c0996a86-6361-4ac5-b635-9cd1fccd6e9d.png)

## 启用SonarQube
<font style="color:rgb(77, 77, 77);">Jenkins的系统管理->系统配置，添加SonarQube服务。</font>

![](images/1768648843233_1713080669789-d2417378-80f4-47b5-b0ca-1a897cb70366.png)

# SonarQube配置
## 禁用审查结果上传到SCM功能
![](images/1768648843293_1713080829581-37462cf8-6044-4311-9c66-80fea2b93d4d.png)

## 生成token
![](images/1768648843349_1713081058590-e8e1b496-c860-4154-8c1b-b56ae4c89a46.png)

# jenkins配置
## 添加令牌
<font style="color:rgb(77, 77, 77);">Jenkins的系统管理->系统配置->添加token</font>

![](images/1768648843406_1713081132550-520e7f14-f228-48d4-be05-a14450b136a8.png)

<font style="color:rgb(77, 77, 77);">类型切换成Secret text，粘贴token，点击添加。</font>

![](images/1768648843464_1713081211280-0b7bf893-2226-4901-bb13-8057271d2d6b.png)

<font style="color:rgb(77, 77, 77);">选上刚刚添加的令牌凭证，点击应用保存。</font>

![](images/1768648843523_1713081243983-2158946e-a617-4ada-b05b-597599661efd.png)

<font style="color:rgb(77, 77, 77);"></font>

## <font style="color:rgb(77, 77, 77);">SonarQube Scanner 安装</font>
<font style="color:rgb(77, 77, 77);">进入Jenkins的系统管理->全局工具配置，下滑找到图片里的地方，点击新增SonarQube Scanner，我们选择自动安装并选择最新的版本。</font>

![](images/1768648843605_1713081803012-ec1e5ff3-513b-46b0-b346-9e224e4313ee.png)

# <font style="color:rgb(77, 77, 77);">非流水线项目添加代码审查</font>
## 添加构建步骤
编辑之前的自由风格构建的demo项目，在构建阶段新增步骤。

![](images/1768648843668_1713084045492-6970752b-d813-4686-b8ac-2a42a651e7fd.png)

analysis properties参数如下

```bash
# 项目名称id，全局唯一
sonar.projectKey=sprint_boot_demo
# 项目名称
sonar.projectName=sprint_boot_demo
sonar.projectVersion=1.0
# 扫描路径，当前项目根目录
sonar.sources=./src
# 排除目录
sonar.exclusions=**/test/**,**/target/**
# jdk版本
sonar.java.source=1.17
sonar.java.target=1.17
# 字符编码
sonar.sourceEncoding=UTF-8
# binaries路径
sonar.java.binaries=target/classes
```

## 构建并查看结果
jenkins点击立即构建，查看构建结果

![](images/1768648843730_1713084154535-9d3b1946-44a5-4f42-b9db-cc1f5c4c593b.png)

查看SonarQube扫描结果

![](images/1768648843787_1713084213005-b33d31ae-2973-4be7-bb0b-fd84cb01b7a5.png)

# 流水线项目添加代码审查
## 创建sonar-project.properties文件
项目根目录下，创建sonar-project.properties文件，内容如下

```bash
# 项目名称id，全局唯一
sonar.projectKey=sprint_boot_demo
# 项目名称
sonar.projectName=sprint_boot_demo
sonar.projectVersion=1.0
# 扫描路径，当前项目根目录
sonar.sources=./src
# 排除目录
sonar.exclusions=**/test/**,**/target/**
# jdk版本
sonar.java.source=1.17
sonar.java.target=1.17
# 字符编码
sonar.sourceEncoding=UTF-8
# binaries路径
sonar.java.binaries=target/classes
```

## 修改Jenkinsfile
加入SonarQube代码审查阶段 

```bash
pipeline {
    agent any

    stages {
        stage('拉取代码') {
            steps {
                echo '开始拉取代码'
                checkout([$class: 'GitSCM', 
                          branches: [[name: '*/main']], 
                          userRemoteConfigs: [[url: 'https://gitee.com/cuiliang0302/sprint_boot_demo.git']]])
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
            steps {
                echo '开始代码审查'
                script {
                    // 引入SonarQube scanner，名称与jenkins 全局工具SonarQube Scanner的name保持一致
                    def scannerHome = tool 'SonarQube'
                    // 引入SonarQube Server，名称与jenkins 系统配置SonarQube servers的name保持一致
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
                echo '代码审查完成'
            }
        }
        
        stage('部署项目') {
            steps {
                echo '开始部署项目'
                echo '部署项目完成'
            }
        }
    }
}

```

## 构建测试
![](images/1768648843845_1713107847121-e9fd3c28-3631-4713-9ee4-dec0042f831c.png)

 		

 	 


