# SonarQube使用

> 来源: CI/CD
> 创建时间: 2024-04-13T23:32:10+08:00
> 更新时间: 2026-01-17T19:20:28.732694+08:00
> 阅读量: 1618 | 点赞: 0

---

# 安装中文插件
在插件管理中搜索并安装Chinese插件

![](images/1768648828757_1713025451246-9facd332-50fe-4543-871b-446f2259f06b.png)

# <font style="color:rgb(77, 77, 77);">安装切换分支插件</font>
<font style="color:rgb(77, 77, 77);">因社区版是免费开源的，所以不提供扫描项目切换分支的功能，但适合真正生产环境的项目会具有多个分支，只能扫描主分支的SonarQube社区版显然很不满足你的需求，插件市场提供了一款可以切换分支的插件。</font>

<font style="color:rgb(77, 77, 77);">插件地址：https://github.com/mc1arke/sonarqube-community-branch-plugin</font>

## <font style="color:rgb(77, 77, 77);">下载插件</font>
<font style="color:rgb(77, 77, 77);">查看插件和SonarQube对应的版本：</font>

| SonarQube Version | Plugin Version |
| --- | --- |
| 10.3 | 1.18.0 |
| 10.2 | 1.17.1 |
| 10.1 | 1.16.0 |
| 10.0 | 1.15.0 |
| 9.9 (LTS) | 1.14.0 |


<font style="color:rgb(77, 77, 77);">下载指定版本的插件至插件目录。</font>

```bash
[root@sonarqube plugins]# pwd
/opt/sonarqube-9.9.4.87374/extensions/plugins
[root@sonarqube plugins]# wget https://github.com/mc1arke/sonarqube-community-branch-plugin/releases/download/1.14.0/sonarqube-community-branch-plugin-1.14.0.jar
[root@sonarqube plugins]# chown sonarqube:sonarqube sonarqube-community-branch-plugin-1.14.0.jar
```

## <font style="color:rgb(77, 77, 77);">修改SonarQube的配置</font>
新增插件地址。

```bash
[root@sonarqube conf]# pwd
/opt/sonarqube-9.9.4.87374/conf
[root@sonarqube conf]# vim sonar.properties
sonar.web.javaAdditionalOpts=-javaagent:./extensions/plugins/sonarqube-community-branch-plugin-1.14.0.jar=web
sonar.ce.javaAdditionalOpts=-javaagent:./extensions/plugins/sonarqube-community-branch-plugin-1.14.0.jar=ce
```

## <font style="color:rgb(77, 77, 77);">重启SonarQube</font>
```bash
[sonarqube@sonarqube ~]$ cd /opt/sonarqube-9.9.4.87374/bin/linux-x86-64/
[sonarqube@sonarqube linux-x86-64]$ ls
SonarQube.pid  sonar.sh
[sonarqube@sonarqube linux-x86-64]$ ./sonar.sh restart
/usr/bin/java
Gracefully stopping SonarQube...
Stopped SonarQube.
Starting SonarQube...
Started SonarQube.
```

# 分析项目
## 创建项目
单击创建新项目按钮。

![](images/1768648828819_1713027256179-23950591-001f-4191-a9d8-bf762fb3c327.png)创建项目名称。

![](images/1768648828877_1713027285920-7ef64f34-65e9-4c77-9165-5a6fe81ce5a4.png)

## 生成扫描命令
创建令牌。

![](images/1768648828935_1713027426183-765ee6be-2b98-42aa-9a9a-bac2b15011d8.png)

生成扫描命令

![](images/1768648828992_1713027832620-a0efdf55-6beb-4c02-901b-3bad3e204488.png)

## 扫描java项目
下载测试项目

```bash
[root@sonarqube opt]# git clone https://gitee.com/cuiliang0302/sprint_boot_demo.git
[root@sonarqube opt]# cd sprint_boot_demo/
[root@sonarqube sprint_boot_demo]# ls
email.html  Jenkinsfile  LICENSE  mvnw  mvnw.cmd  pom.xml  readme.md  src  test
```

在项目目录下执行如下命令。

```bash
[root@sonarqube sprint_boot_demo]# mvn clean verify sonar:sonar \
  -Dsonar.projectKey=demo \
  -Dsonar.host.url=http://192.168.10.71:9000 \
  -Dsonar.login=sqp_e9767cdfd04344119199edf53375e0e953dfd8d5
```

## 查看扫描结果
分析完成后，页面会自动刷新，将在SonarQube上看到第一个分析：

![](images/1768648829054_1713028742914-6f9c7f7c-76c1-443a-8720-002792a744e2.png)


