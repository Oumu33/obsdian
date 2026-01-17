# jenkins邮件通知配置

> 来源: CI/CD
> 创建时间: 2023-07-12T22:12:37+08:00
> 更新时间: 2026-01-17T19:20:37.637547+08:00
> 阅读量: 1564 | 点赞: 1

---

# 安装与配置插件
## 安装插件
在jenkins的插件管理中安装Email Extension插件

![](images/1768648837661_1689171311747-8c6eeec9-6069-4215-9da9-c9971b4d4259.png)

## 配置邮件相关参数
依次点击manage jenkins——>system，找到jenkins Location项，填写系统管理员邮件地址。

![](images/1768648837720_1689171955445-e8ea22df-8b46-45b3-91cf-251b10bed410.png)

配置邮件服务器相关参数，然后点击通过发送测试邮件测试配置，填写收件人邮箱号。

![](images/1768648837777_1689171923417-61c4c544-1330-488d-9297-5b1a904be338.png)

配置Extended E-mail Notification配置，内容如下

![](images/1768648837835_1689174052463-b9c19823-c216-478e-af07-c46e5c79bcbc.png)

登录收件人邮件，看到有测试邮件。

![](images/1768648837891_1689172040723-5580f14d-3c1e-4182-beb9-af1aa9cd3fb0.png)

# 自由风格任务配置
## 修改任务配置构建后操作内容
![](images/1768648837949_1689174179779-d620be20-9b6b-4ef6-80c2-e22e0bf8c437.png)

![](images/1768648838009_1689174241377-af0dd363-2b5d-4471-a9fe-e9f19c593ce0.png)

## 构建测试
点击立即构建，查看收件人邮箱

![](images/1768648838082_1689174279624-99a6ed75-e757-4b50-b4d8-448a2dcee871.png)

# 流水线任务配置
## 配置邮件内容
在项目根目录编写email.html，并推送至项目仓库。邮件模板如下所示：

```html
<!DOCTYPE html>    
<html>    
<head>    
<meta charset="UTF-8">    
<title>${ENV, var="JOB_NAME"}-第${BUILD_NUMBER}次构建日志</title>    
</head>    
    
<body leftmargin="8" marginwidth="0" topmargin="8" marginheight="4"    
    offset="0">    
    <table width="95%" cellpadding="0" cellspacing="0"  style="font-size: 11pt; font-family: Tahoma, Arial, Helvetica, sans-serif">    
        <tr>    
            本邮件由系统自动发出，无需回复！<br/>            
            各位同事，大家好，以下为${PROJECT_NAME }项目构建信息</br>
            <td><font color="#CC0000">构建结果 - ${BUILD_STATUS}</font></td>   
        </tr>    
        <tr>    
            <td><br />    
            <b><font color="#0B610B">构建信息</font></b>    
            <hr size="2" width="100%" align="center" /></td>    
        </tr>    
        <tr>    
            <td>    
                <ul>    
                    <li>项目名称 ： ${PROJECT_NAME}</li>    
                    <li>构建编号 ： 第${BUILD_NUMBER}次构建</li>    
                    <li>触发原因： ${CAUSE}</li>    
                    <li>构建状态： ${BUILD_STATUS}</li>    
                    <li>构建日志： <a href="${BUILD_URL}console">${BUILD_URL}console</a></li>    
                    <li>构建Url ： <a href="${BUILD_URL}">${BUILD_URL}</a></li>    
                    <li>工作目录 ： <a href="${PROJECT_URL}ws">${PROJECT_URL}ws</a></li>    
                    <li>项目Url ： <a href="${PROJECT_URL}">${PROJECT_URL}</a></li>    
                </ul>    


<h4><font color="#0B610B">失败用例</font></h4>
<hr size="2" width="100%" />
$FAILED_TESTS<br/>


<h4><font color="#0B610B">最近提交(#$SVN_REVISION)</font></h4>
<hr size="2" width="100%" />
<ul>
${CHANGES_SINCE_LAST_SUCCESS, reverse=true, format="%c", changesFormat="<li>%d [%a] %m</li>"}
</ul>
详细提交: <a href="${PROJECT_URL}changes">${PROJECT_URL}changes</a><br/>


            </td>    
        </tr>    
    </table>    
</body>    
</html>  
```

## 修改pipeline添加邮件发送
修改流水线内容，新增邮件发送

![](images/1768648838145_1689174430479-295ccf44-0cee-44e6-bc79-c6c5143a037a.png)

```html
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
                sh 'sleep 10'
            }
        }
    }
    post {
        always {
            emailext(
                subject: '构建通知：${PROJECT_NAME} - Build # ${BUILD_NUMBER} - ${BUILD_STATUS}!',
                body: '${FILE,path="email.html"}',
                to: 'cuiliang0302@qq.com'
            )
        }
    }
}
```

## 构建测试
点击立即构建，查看收件人邮箱

![](images/1768648838207_1689174486387-18822110-d37f-48f2-ae45-84a3073d4d72.png)


