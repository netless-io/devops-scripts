const k8sCmd = require("./k8sCmd");
const docker = require("./docker");
const shell = require("./shell");

async function buildAndPush(dockerfile, name, tags, deleteAfter) {
    if (typeof tags === "string") {
        tags = [tags];
    }

    await docker.build(dockerfile, name, tags[0]);
    tags.filter(t => t !== tags[0]).map(t => {
        docker.tag(name, tags[0], t);
    });
    await docker.push(name, tags);
    if (deleteAfter) {
        await docker.rmi(name, tags);
    }
}

async function deployK8s(dir, yml, deployment, namespace) {
    shell.execRemote("k8s-dev", [
        `cd ${dir}`,
        k8sCmd.apply(yml),
        k8sCmd.patch(namespace, deployment, k8sCmd.patchInfo()),
    ]);
}

module.exports = {buildAndPush, deployK8s};