## docker-scripts

构建私有仓库的 docker image 以及 k8s 部署的命令。

涉及 docker 时，需要传入 docker Registry 信息：

```ts
docker tag IMAGE[:TAG] [REGISTRY_HOST[:REGISTRY_PORT]/]REPOSITORY[:TAG]
```

## How to use

```js
import {Docker, buildAndPush, deployK8s, patchDeployment} from "@netless/docker-script";

const docker = new Docker({registry: "registry", namespace: "命名空间"});
buildAndPush(docker, dockerfilePath, imageName, tag | tags, deleteAfter);

deployK8s(cluster, dirInCluster, ymlPath, deployment, namespace);
// or
patchDeployment(cluster, deployment, namespace);
```