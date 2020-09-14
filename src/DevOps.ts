import * as k8sCmd from "./k8sCmd";
import { Docker } from "./Docker";
import * as shell from "./shell";

export async function buildAndPush(docker: Docker, dockerfile: string, name: string, tags: string | string[], deleteAfter: boolean): Promise<void> {
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

export async function deployK8s(dir: string, yml: string, deployment: string, namespace: string): Promise<void> {
    await shell.execRemote("k8s-dev", [
        `cd ${dir}`,
        k8sCmd.apply(yml),
        k8sCmd.patch(namespace, deployment, k8sCmd.patchInfo()),
    ]);
} 