# runner执行器

> 来源: CI/CD
> 创建时间: 2023-05-05T20:34:59+08:00
> 更新时间: 2026-01-17T19:20:57.886943+08:00
> 阅读量: 1423 | 点赞: 0

---

# 执行器介绍
CI/CD的流水线真正的执行环境是GitLab Runner提供的执行器，为了满足各种各样的需求，GitLab CI/CD支持的执行器有很多种，最常用的是Docker， shell，Kubernets三种。每一种执行器都与自己的特性，了解各个执行器的特性，并选择合适的执行器才能让我们流水线更加可靠，稳健。

# <font style="color:rgb(79, 79, 79);">执行器类型</font>
GitLab Runner支持的执行器有以下几种：

+ SSH
+ Shell
+ Parallels
+ VirtualBox
+ Docker
+ Docker Machine (auto-scaling)
+ Kubernetes
+ Custom

GitLab Runner 支持的执行器有GitLab Runner的安装方式有关也和宿主机环境有关。

# 执行器功能对比
具体可参考文档：[https://docs.gitlab.com/runner/executors/#selecting-the-executor](https://docs.gitlab.com/runner/executors/#selecting-the-executor)

![](images/1768648857912_1716176477176-700046fd-0bcf-4505-986f-01e4657cd930.png)


