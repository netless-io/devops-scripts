// import {} from "@netless/devops-scripts";

/**
 * just apply one image and deploy it from its source repo
 */

import {deployK8s, Docker, gitHash, version, patchDeployment} from "./src";

const docker = new Docker({auth: 'https://registry.domain.com', namespace: "mynamespace"});

const hash = gitHash();
const packageVersion = version("./package.json");

// tags also can be string
const tags = ["latest", `${hash}-${packageVersion}`];

docker.build("docerfilePath", "imageName", tags);
docker.buildAndPush("dockerfilePath", "imageName", tags, true);

// if you image not change, you need patch, deployK8s do patch for you
deployK8s("k8s-dev", "repo", "/app.yaml", "deployment-name","namespace");
// or just patch, because image not change
patchDeployment("k8s-cluster", "demo", "default");

/*
 * git for yaml repo
 */

import {gitDiff, applyDiff, SSHConfig} from "./src";

const config: SSHConfig = {host: "k8s-cluster"};
(async () => {
    await applyDiff(config, gitDiff());
})();