const shell = require("./shell");
const path = require("path");

const registry = "netless-dev-registry.ap-southeast-1.cr.aliyuncs.com";
const namespace = "dev";

function imageName(name, tag) {
    return `${registry}/${namespace}/${name}:${tag}`;
}

async function build(dockerfile, name, tagName) {
    await shell.execInDir(path.dirname(dockerfile), `docker build --rm -f Dockerfile -t ${imageName(name, tagName)} .`);
}

function tag(name, originalTag, newTag) {
    shell.execSync(`docker tag ${imageName(name, originalTag)} ${imageName(name, newTag)}`);
}

async function push(name, tags) {
    if (typeof tags === "string") {
        tags = [tags];
    }
    for (const tag of tags) {
        await shell.exec(`docker push ${imageName(name, tag)}`);
    }
}

async function rmi(name, tags) {
    if (typeof tags === "string") {
        tags = [tags];
    }
    for (const tag of tags) {
        await shell.exec(`docker rmi ${imageName(name, tag)}`);
    }
}

module.exports = {build, tag, push, rmi};