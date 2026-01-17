# ArgoCD集群管理

> 来源: CI/CD
> 创建时间: 2025-10-22T23:37:43+08:00
> 更新时间: 2026-01-17T19:21:13.885128+08:00
> 阅读量: 124 | 点赞: 0

---

# 功能介绍
ArgoCD 不仅能管理所在的 k8s 集群，还可以通过添加远程集群Kubeconfig/Token的方式实现管理多个集群，从而实现跨集群的应用部署和 GitOps 自动化。

# 添加集群
假设现在有两套集群，已经在k8s集群部署了gitlab和Argocd，现在需要添加k8s-test集群。

## 获取目标集群 kubeconfig
```bash
[root@k8s-test ~]# kubectl config view --minify --flatten > test.conf
```

## 使用 ArgoCD CLI 添加集群  
查看 context 信息，更多 context 操作可参考文档：[https://www.cuiliangblog.cn/detail/section/175557663](https://www.cuiliangblog.cn/detail/section/175557663)

```bash
# kubectl config get-contexts --kubeconfig /etc/kubernetes/test.conf
CURRENT   NAME                          CLUSTER      AUTHINFO           NAMESPACE
*         kubernetes-admin@kubernetes   kubernetes   kubernetes-admin
```

ArgoCD添加集群

```bash
# argocd cluster add kubernetes-admin@kubernetes \
  --kubeconfig /etc/kubernetes/test.conf \
  --name k8s-test
WARNING: This will create a service account `argocd-manager` on the cluster referenced by context `kubernetes-admin@kubernetes` with full cluster level privileges. Do you want to continue [y/N]? y
{"level":"info","msg":"ServiceAccount \"argocd-manager\" created in namespace \"kube-system\"","time":"2025-10-23T00:20:21+08:00"}
{"level":"info","msg":"ClusterRole \"argocd-manager-role\" created","time":"2025-10-23T00:20:21+08:00"}
{"level":"info","msg":"ClusterRoleBinding \"argocd-manager-role-binding\" created","time":"2025-10-23T00:20:21+08:00"}
{"level":"info","msg":"Created bearer token secret \"argocd-manager-long-lived-token\" for ServiceAccount \"argocd-manager\"","time":"2025-10-23T00:20:21+08:00"}
{"level":"warning","msg":"Failed to invoke grpc call. Use flag --grpc-web in grpc calls. To avoid this warning message, use flag --grpc-web.","time":"2025-10-23T00:20:22+08:00"}
Cluster 'https://192.168.10.15:6443' added
```

## 查看集群状态信息
![](images/1768648873909_1761150165648-27da2bd2-b9f0-4594-998d-eb49e187df6c.png)

# CLI 管理集群
## 列出集群
```bash
# 列出所有集群
argocd cluster list

# 使用 grpc-web（如果有连接问题）
argocd cluster list --grpc-web

# 输出格式化
argocd cluster list -o json
argocd cluster list -o yaml
argocd cluster list -o wide
```

## 查看集群详情
```bash
# 查看特定集群信息
argocd cluster get <CLUSTER_URL>

# 例如
argocd cluster get https://192.168.10.15:6443
argocd cluster get https://kubernetes.default.svc  # 本地集群
```

## 更新集群配置
```bash
# 更新集群名称
argocd cluster set <CLUSTER_URL> --name new-name

# 更新集群的 namespaces
argocd cluster set <CLUSTER_URL> --namespace ns1,ns2,ns3

# 设置集群为默认集群
argocd cluster set <CLUSTER_URL> --name in-cluster

# 更新 shard（用于集群分片）
argocd cluster set <CLUSTER_URL> --shard 1
```

## 删除集群
```bash
# 删除集群
argocd cluster rm <CLUSTER_URL>

# 例如
argocd cluster rm https://192.168.10.15:6443

# 强制删除（即使有应用在使用）
argocd cluster rm <CLUSTER_URL> --cascade
```


