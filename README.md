# docker-scripts

## How to use

* develop

```typescript
import {Docker, deployK8s, patchDeployment} from "@netless/devops-scripts";
const docker = new Docker({auth: 'https://registry.domain.com', namespace: "mynamespace"});
docker.buildAndPush("dockerfilePath", "imageName", "latest" || ["latest", "1.0.0-commit"], true);

// if you image not change, you need patch, deployK8s do patch for you
deployK8s("k8s-dev", "repo", "/app.yaml", "deployment-name","namespace");
// or just patch, because image not change
patchDeployment("k8s-cluster", "demo", "default");
```

* yaml repo

```typescript
import {gitDiff, applyDiff, SSHConfig} from "@netless/devops-scripts";

const config: SSHConfig = {host: "k8s-cluster"};
(async () => {
    await applyDiff(config, gitDiff());
})();
```

more example see `./exmaple.ts`

## TODO:

- [ ] delete `D` yaml's deployment statefulset ingress service
- [ ] support handle all yaml kind, not just first
- [ ] check kind support operation
- [ ] deployK8s not need deployment and name, just need yaml.