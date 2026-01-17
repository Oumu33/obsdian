# ArgoCD仓库管理

> 来源: CI/CD
> 创建时间: 2025-10-22T21:43:33+08:00
> 更新时间: 2026-01-17T19:21:13.307443+08:00
> 阅读量: 148 | 点赞: 0

---

# 仓库管理介绍
Argo CD 的 “Repo 仓库管理（Repository Management）” 是 GitOps 工作流的核心之一 —— 它决定了 Argo CD 从哪里拉取应用配置（YAML/Helm/Kustomize 等），以及如何认证访问这些仓库。  

## 仓库类型
| 类型 | 示例 | 用途 |
| --- | --- | --- |
| **Git** | `https://github.com/org/repo.git` | 最常见，存放 K8s YAML、Kustomize、Helm Chart |
| **Helm 仓库** | `https://charts.bitnami.com/bitnami` | 直接拉取 Helm Chart 部署 |
| **OCI 仓库** | `oci://ghcr.io/org/chart` | Helm v3 支持的 OCI chart 仓库 |
| **HTTP 仓库** | `https://example.com/charts/` | Helm 兼容但非标准仓库 |
| **GPG 签名仓库** | 支持 GPG 校验 commit | 用于增强安全性 |


# 仓库配置
## git仓库配置（最常用）
三种认证方式适用场景与区别配置可参考文档：[https://www.cuiliangblog.cn/detail/section/127410630](https://www.cuiliangblog.cn/detail/section/127410630)，此处不再赘述。

## OCI仓库配置
上传 chart 到 harbor 仓库可参考文档：[https://www.cuiliangblog.cn/detail/section/241615859](https://www.cuiliangblog.cn/detail/section/241615859)，此处不再赘述。

查看 helm 仓库地址

![](images/1768648873330_1761146511426-6b695f18-6180-4e5d-b495-a2304c5732a2.png)

创建机器人账户

![](images/1768648873397_1761146875481-5dee863e-bc43-41f9-adca-47d81deae2f3.png)

创建 repo

![](images/1768648873487_1761146975886-c0cce5aa-0a11-4c3d-b1da-075ea5dc3a63.png)

查看仓库状态

![](images/1768648873550_1761146994344-d603b8b5-81bd-455c-a8a2-8559b80b5adf.png)

## helm仓库配置
创建 helm 仓库

![](images/1768648873612_1761206056844-2481b3bd-9ac5-4633-b45a-01d621f22d9e.png)

查看仓库状态

![](images/1768648873679_1761206064866-ff9e4a2a-b0b5-4840-9507-1e38ec3f150a.png)

# Yaml 管理仓库
 ArgoCD 的 **GitOps 思路**就是通过 YAML 文件（Kubernetes CRD）来管理所有配置，包括仓库的创建。

## 查看已有仓库信息
```bash
# kubectl get secrets -n argocd | grep repo
repo-2111645630                    Opaque              4      13h
repo-3457470677                    Opaque              6      13h
repo-3513749900                    Opaque              6      118m
# kubectl get secrets -n argocd repo-3513749900 -o yaml
apiVersion: v1
data:
  name: ZGVtbw==
  password: IVFBWjJ3c3g=
  project: ZGV2b3Bz
  type: Z2l0
  url: aHR0cDovL2dpdGxhYi5jdWlsaWFuZ2Jsb2cuY24vZGV2b3BzL2FyZ28tZGVtby5naXQ=
  username: cm9vdA==
kind: Secret
metadata:
  annotations:
    managed-by: argocd.argoproj.io
  creationTimestamp: "2025-10-23T02:47:04Z"
  labels:
    argocd.argoproj.io/secret-type: repository
  name: repo-3513749900
  namespace: argocd
  resourceVersion: "1905558"
  uid: fe2a00d2-395d-4ce3-9e41-dff844606ab8
type: Opaque
```

## 创建仓库
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: repo-demo  # 资源名称
  namespace: argocd
  labels:
    argocd.argoproj.io/secret-type: repository
  annotations:
    managed-by: argocd.argoproj.io
stringData:
  name: repo-demo
  password: "!QAZ2wsx"
  project: devops
  type: git
  url: http://gitlab.cuilianglblog.cn/devops/argo-demo.git
  username: root
type: Opaque
```

# CLI 管理仓库
## 添加 Git 仓库
```bash
# 添加公共 Git 仓库（HTTPS）
argocd repo add https://github.com/username/repo.git

# 添加私有仓库 - 使用用户名/密码
argocd repo add https://github.com/username/repo.git \
  --username <username> \
  --password <password>

# 添加私有仓库 - 使用 SSH
argocd repo add git@github.com:username/repo.git \
  --ssh-private-key-path ~/.ssh/id_rsa

# 添加仓库并指定名称
argocd repo add https://github.com/username/repo.git \
  --name my-repo

# 添加 Git 仓库 - 使用 Personal Access Token (推荐)
argocd repo add https://github.com/username/repo.git \
  --username git \
  --password <github-token>

# GitLab 私有仓库
argocd repo add https://gitlab.com/username/repo.git \
  --username <username> \
  --password <gitlab-token>

# Gitee 仓库
argocd repo add https://gitee.com/username/repo.git \
  --username <username> \
  --password <token>

# 跳过 TLS 验证（自签名证书）
argocd repo add https://git.example.com/repo.git \
  --insecure-skip-server-verification \
  --username <username> \
  --password <password>
```

## 列出所有仓库
```bash
# 列出所有仓库
argocd repo list

# 使用 grpc-web
argocd repo list --grpc-web

# 输出为 JSON 格式
argocd repo list -o json

# 输出为 YAML 格式
argocd repo list -o yaml

# 显示更多信息
argocd repo list -o wide
```

## 查看仓库详情
```bash
# 查看特定仓库信息
argocd repo get <REPO_URL>

# 输出为 YAML
argocd repo get https://github.com/username/repo.git -o yaml
```

## 删除仓库
```bash
# 删除仓库
argocd repo rm <REPO_URL>
```




