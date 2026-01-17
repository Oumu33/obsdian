# Gitlab与SonarQube集成

> 来源: CI/CD
> 创建时间: 2024-05-31T11:19:10+08:00
> 更新时间: 2026-01-17T19:21:07.336295+08:00
> 阅读量: 537 | 点赞: 0

---

# SonarQube相关配置
## 禁用审查结果上传到SCM功能
![](images/1768648867359_1713080829581-37462cf8-6044-4311-9c66-80fea2b93d4d.png)

## SonarQube生成token
![](images/1768648867437_1717247682150-d6415cc6-0b4b-459f-a609-c6de4aaf956a.png)

# runner配置
## 安装sonar-scanner
参考文档；[https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/scanners/sonarscanner/)

```bash
[root@client1 ~]# wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
[root@client1 ~]# unzip mkdir /usr/local/sonar-scanner
[root@client1 ~]# mv sonar-scanner-5.0.1.3006-linux /usr/local/sonar-scanner
[root@client1 ~]# vim /etc/profile
# 文件末尾添加如下内容
export PATH=$PATH:/usr/local/sonar-scanner/bin
[root@client1 ~]# source /etc/profile
[root@client1 ~]# sonar-scanner -v
INFO: Scanner configuration file: /usr/local/sonar-scanner/conf/sonar-scanner.properties
INFO: Project root configuration file: NONE
INFO: SonarScanner 5.0.1.3006
INFO: Java 17.0.7 Eclipse Adoptium (64-bit)
INFO: Linux 4.18.0-513.24.1.el8_9.x86_64 amd64
```

# gitlab配置
## 新增SonarQube扫描配置文件
在项目根目录下新建sonar-project.properties文件，内容如下：

```yaml
# 项目名称id，全局唯一
sonar.projectKey=sprint_boot_demo
# 项目名称
sonar.projectName=sprint_boot_demo
sonar.projectVersion=1.0
# 扫描路径
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

## 新增token变量
![](images/1768648867502_1718461926292-71216658-d8b6-4944-9b26-217f057461b3.png)

## 创建流水线文件
```bash
default:
  cache: 
    paths: # 定义全局缓存路径
     - target/

stages:
  - build
  - test
  - code_scan

build:
  stage: build
  tags:
    - java
  script:
    - mvn clean package # 编译打包
    - ls target

code_scan: 
  stage: code_scan
  tags:
    - java
  script:
  - echo "CI_PROJECT_NAME:$CI_PROJECT_NAME SonarQubeToekn:$SonarQubeToekn CI_PROJECT_DIR:$CI_PROJECT_DIR CI_COMMIT_REF_NAME:$CI_COMMIT_REF_NAME"
  - "sonar-scanner -Dsonar.projectKey=$CI_PROJECT_NAME -Dproject.settings=$CI_PROJECT_DIR/sonar-project.properties \
    -Dsonar.branch.name=$CI_COMMIT_REF_NAME -Dsonar.host.url=http://192.168.10.71:9000 -Dsonar.login=$SonarQubeToekn"
  artifacts:
    paths:
      - "target/*.jar" # 制品目录
```

## 查看SonarQube扫描结果
![](images/1768648867645_1717251311475-3a1e875d-80bc-429a-aa99-7e5039f53cbf.png)


