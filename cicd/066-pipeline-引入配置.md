# pipeline-引入配置

> 来源: CI/CD
> 创建时间: 2024-05-23T22:41:07+08:00
> 更新时间: 2026-01-17T19:21:03.645527+08:00
> 阅读量: 503 | 点赞: 0

---

# include引入
可以允许引入外部YAML文件，文件具有扩展名.yml或.yaml 。使用合并功能可以自定义和覆盖包含本地定义的CI / CD配置。相同的job会合并，参数值以源文件为准。

## local
引入同一存储库中的文件，使用相对于根目录的完整路径进行引用，与配置文件在同一分支上使用。

在仓库新增一个ci/localci.yml: 定义一个作业用于发布。

![](images/1768648863671_1716604249133-44b57664-c9d6-4a1f-b356-dcdf1804ff8c.png)

yml文件内容如下：

```yaml
stages:
  - deploy
  
deployjob:
  stage: deploy
  script:
    - echo 'deploy'
```

.gitlab-ci.yml 引入本地的CI文件’ci/localci.yml’。

```yaml
include: # 引入仓库ci目录下的localci文件
  local: 'ci/localci.yml' 
  
stages:
  - build
  - deploy
  
buildjob:
  stage: build
  script: 
    - echo 'deploy'
```

流水线执行效果如下：

![](images/1768648863732_1716604446108-3bc35471-9ba4-4c34-b39c-bd7dbf747caa.png)

## file
另一个项目创建.gitlab-ci.yml文件。

![](images/1768648863790_1716604655931-682db3cf-ae84-40e3-ae63-50dd95bfb84f.png)

文件内容如下：

```yaml
stages:
  - deploy

deployjob:
  stage: deploy
  script:
    - echo "deploy"
```

引入另一个项目的流水线

```yaml
include: # 引入另一个项目master分支下的流水线文件
  - project: develop/vue3_vite_element-plus
    ref: master
    file: '.gitlab-ci.yml' 
  
stages:
  - build
  - deploy
  
buildjob:
  stage: build
  script: 
    - echo 'deploy'
```

流水线执行效果如下：

![](images/1768648863850_1716604816458-5520ab02-1ceb-4e6e-9ae1-64474139d938.png)

## template
只能使用官方提供的模板 [https://gitlab.com/gitlab-org/gitlab/tree/master/lib/gitlab/ci/templates](https://gitlab.com/gitlab-org/gitlab/tree/master/lib/gitlab/ci/templates)

```plain
include:
  - template: Auto-DevOps.gitlab-ci.yml
```

## remote
用于通过HTTP / HTTPS包含来自其他位置的文件，并使用完整URL进行引用. 远程文件必须可以通过简单的GET请求公开访问，因为不支持远程URL中的身份验证架构。

```plain
include:
  - remote: 'https://gitlab.com/awesome-project/raw/master/.gitlab-ci-template.yml'
```

# extends继承作业
继承模板作业，相同的配置将会覆盖，不同的配置将会继承。

```yaml
stages:
  - test

template-test: # 定义test模板
  stage: test
  script: 
  - echo "mvn test"

testjob:
  extends: template-test # 继承test模板
  script: # 覆盖script
  - echo "mvn clean test"
```

执行效果

![](images/1768648863907_1716606152175-7bbf36fa-8ebc-49f3-9e69-c71b9fd31cb5.png)

继承后的流水线内容如下：

```yaml
stages:
  - test

testjob:
  stage: test
  script:
  - echo "mvn clean test"
```

# include与extends组合使用
引入其他文件并覆盖相关值。

新建localci.yml文件，内容如下

```yaml
deployjob:
  stage: deploy
  script:
    - echo 'deploy'

template-build:
  stage: build
  script: 
    - echo "build"
```

```yaml
include: # 引入localci.yml文件
  local: 'ci/localci.yml'

stages: # 定义步骤
  - build 
  - deploy

testjob:
  extends: template-build # 继承template-build并覆盖值
  script: echo "mvn clean test"
```


