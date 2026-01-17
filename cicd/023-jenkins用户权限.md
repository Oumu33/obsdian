# jenkins用户权限

> 来源: CI/CD
> 创建时间: 2023-06-27T20:52:58+08:00
> 更新时间: 2026-01-17T19:20:32.965221+08:00
> 阅读量: 2330 | 点赞: 1

---

# 安装启用
## 安装插件
我们可以利用Role-based Authorization Strategy插件来管理Jenkins用户权限

![](images/1768648832990_1687872331539-e877da3e-464a-4ebe-9d21-d2c4ac735c1d.png)

## 开启权限全局安全配置
依次点击jenkins——>系统管理——>全局安全配置，将授权策略改为Role-Based Strategy，也就是基于角色的权限。

![](images/1768648833048_1687873039607-9fd7ffae-bbd9-4025-8c84-823870d05056.png)

# 创建测试任务
分别创建vue_prod、Vue_test、java-test三个项目用于后续测试。

![](images/1768648833106_1688134990140-f44dc969-c209-4354-8407-295331d0a062.png)

# 权限配置
## 创建角色
依次点击jenkins——>系统管理——>Manage and Assign Roles

![](images/1768648833170_1687873455980-48ea6d9f-05a8-4100-9925-772b605b7da1.png)

## 配置角色权限
**Global roles**

创建全局角色，例如管理员，作业创建者，匿名角色等，从而可以在全局基础上设置总体，代理，作业，运行，查看和SCM权限。

我们这里添加一个只读权限角色名为guest。

![](images/1768648833229_1687879401364-5bdb7bad-5b7b-4e50-a31e-4fa2d90dcb87.png)

**Item roles**

创建项目角色，仅允许基于项目设置Job和Run权限。

<font style="color:rgb(0, 0, 0);background-color:rgb(243, 244, 245);">在这里我们有两个项目vue_develop与java_develop，我们分别用不同的项目权限对项目进行管理。</font>

在添加Item roles的时候有如下规则：

+ 如果将字段设置为java-.*，则该角色将匹配名称以开头的所有作业java-.
+ 模式区分大小写。要执行不区分大小写的匹配，请使用(?i)表示法： (?i)vue_.*这样不区分大小写的。
+ 可以使用以下表达式匹配文件夹 ^foo/bar.*

在这里我们分别创建java_develop和vue_develop角色，并授予不同的权限。

![](images/1768648833287_1687939899825-bf71a246-9b85-47dc-81d3-40856016b10c.png)

创建完item roles后，我们可以点击蓝色pattern表达式查看是否匹配到任务。

![](images/1768648833345_1688135093405-3b133a7a-f9ae-475e-8061-e660fab17297.png)

![](images/1768648833404_1688135125946-20de57d3-6557-4826-a248-82e482dc8b13.png)

# 用户配置
## 创建用户
<font style="color:rgb(77, 77, 77);">创建完角色后，接下来创建三个用户分别是zhangsan、lisi、wangwu，分别对应上面添加的三个角色。</font>

<font style="color:rgb(77, 77, 77);">依次点击jenkins——>系统管理——>管理用户——>Create User</font>

![](images/1768648833463_1688135265216-579bf064-d0a3-4033-92a7-5dd9502d9fbe.png)

创建完的用户列表如下图所示

![](images/1768648833521_1688135405173-cd5438a4-e98b-4a26-a87e-301ed11382e7.png)

## 用户授权
有了用户和角色后，接下来的操作就是将用户与角色进行绑定。

依次点击jekins——>系统管理——>Manage and Assign Roles——>Assign Roles，

首先需要将所有用户授予guest权限，否则看不到不具备读权限，无法显示。然后将李四与java_develop角色绑定，王五与vue_develop角色绑定，张三不绑定item权限。

![](images/1768648833580_1688135823271-4635ee6d-4426-454d-8928-d8049653afbf.png)

# 登录验证
## 张三
因为张三只具备guest角色权限，因此虽然可以登录jenkins，但是看不到任何任务信息。

![](images/1768648833641_1688135762597-490150d3-3d0d-4d7b-bc65-74450ec548f7.png)

## 李四
李四绑定了java_develop角色，因此只能看到java相关的任务信息。

![](images/1768648833708_1688135852383-6bf0dbb9-4cce-469e-844b-ff3721608151.png)

## 王五
王五绑定了vue_develop角色，因此只能看到vue相关的任务信息。

![](images/1768648833768_1688135871466-f087209e-e83f-496b-80bf-a4fd5acb6f67.png)






