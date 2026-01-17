# jenkins与Maven集成

> 来源: CI/CD
> 创建时间: 2023-07-01T08:53:24+08:00
> 更新时间: 2026-01-17T19:20:41.211180+08:00
> 阅读量: 2119 | 点赞: 0

---

# 安装配置Maven
此处以rpm包部署jenkins为例，以下操作在jenkins所在服务器执行。

maven下载地址：[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

## 安装Maven
```bash
[root@jenkins ~]# wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
[root@jenkins ~]# mkdir /usr/local/maven
[root@jenkins ~]# tar -zxf apache-maven-3.9.6-bin.tar.gz -C /usr/local/maven/
[root@jenkins ~]# cd /usr/local/maven/apache-maven-3.9.6/
[root@jenkins apache-maven-3.9.3]# ls
bin  boot  conf  lib  LICENSE  NOTICE  README.txt
```

## 设置maven的阿里云镜像
```bash
[root@jenkins apache-maven-3.9.6]# vim conf/settings.xml
# 在159行的标签为</mirrors>前添加如下阿里云镜像
<mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
</mirror>
```

## 配置环境变量
```bash
[root@jenkins apache-maven-3.9.6]# vim /etc/profile
# 文件末尾添加如下内容
export MAVEN_HOME=/usr/local/maven/apache-maven-3.9.6
export PATH=${MAVEN_HOME}/bin:${PATH}
[root@jenkins apache-maven-3.9.6]# source /etc/profile
[root@jenkins apache-maven-3.9.6]# mvn -v
Apache Maven 3.9.6 (21122926829f1ead511c958d89bd2f672198ae9f)
Maven home: /usr/local/maven/apache-maven-3.9.3
Java version: 11.0.19, vendor: Red Hat, Inc., runtime: /usr/lib/jvm/java-11-openjdk-11.0.19.0.7-4.el8.x86_64
Default locale: zh_CN, platform encoding: UTF-8
OS name: "linux", version: "4.18.0-477.13.1.el8_8.x86_64", arch: "amd64", family: "unix"
```

# jenkins配置Maven
## 全局工具配置关联jdk和maven
jenkis——>manage jenkins——>tools

如遇yum安装jdk无法识别，可尝试下载二进制openjdk安装

![](images/1768648841236_1688220070305-050403f6-74db-429a-b4aa-d98b5da8d56f.png)

![](images/1768648841342_1688220247831-f73cdbbc-3316-4a54-b89d-a3e6aca566f8.png)

## 添加jenkins全局变量
jenkis——>manage jenkins——>System

新增JAVA_HOME、M2_HOME、PATH+EXTRA

![](images/1768648841403_1688268812785-a8ce5cf7-7ad2-4eb3-9e5d-373649e3930d.png)

# 拉取java项目
## 创建项目
此处以springboot项目为例，项目地址[https://gitee.com/cuiliang0302/sprint_boot_demo](https://gitee.com/cuiliang0302/sprint_boot_demo)

![](images/1768648841461_1688266653384-e4453fbd-b2cc-49a3-9ab7-3b69cc930bd0.png)

## 创建凭据
1. 依次点击jenkins——>系统管理——>Credentials——> Add Credentials，类型选择username with password

![](images/1768648841523_1688267590780-01063871-5c50-402e-8d21-10d99086f10a.png)

# 创建任务
## 创建流水线任务
新建一个类型为自由风格的任务

![](images/1768648841581_1688267700177-59839503-1987-4a91-9286-2d48379931cf.png)

## 配置git仓库信息
gitee的主分支名称为main，记得更改。

![](images/1768648841642_1688267958468-a0a0bdc7-0010-4f38-b5a6-fc22e7d1c7fe.png)

## 构建测试
点击立即构建，查看构建信息

![](images/1768648841700_1688268027337-0f31b7e0-7e17-4f5f-8e24-569527fc386f.png)

# 打包测试
## 修改任务
修改gitlab与gitee连接中配置的任务，新增构建步骤。配置如下

![](images/1768648841764_1688268153586-86732e91-d33e-49ef-9369-d28107ed0f1c.png)

## 构建测试
可以看到控制台成功打印了打包信息

![](images/1768648841824_1688484040759-703c26e7-6880-47c2-b08d-7bdec2722d4a.png)

# 读取pom.xml参数
<font style="color:rgb(37, 53, 53);">在执行 Java 项目的流水线时，我们经常要动态获取项目中的属性，很多属性都配置在项目的 pom.xml 中，使用Pipeline Utility Steps 插件提供能够读取 pom.xml 的方法，pipeline如下</font>

```groovy
stage('读取pom.xml参数阶段'){
    // 读取 Pom.xml 参数
    pom = readMavenPom file: './pom.xml'
    // 输出读取的参数
    print "${pom.artifactId}"
    print = "${pom.version}"
}
```


