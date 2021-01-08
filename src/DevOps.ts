import * as k8sCmd from "./k8sCmd";
import { Docker } from "./Docker";
import * as shell from "./shell";

/**
 * 
 * @param docker 构建出来带 registry，namespace 的镜像地址
 * @param dockerfile dockerfile 路径，如果是相对路径，应该以 node 执行位置为准
 * @param imageName 镜像名
 * @param tags 镜像 tag，可以为 string，单个 tag，或者多个 tag 名称
 * @param deleteAfter push 完后，是否删除本地镜像
 */
export async function buildAndPush(docker: Docker, dockerfile: string, imageName: string, tags: string | string[], deleteAfter: boolean): Promise<void> {
    if (typeof tags === "string") {
        tags = [tags];
    }

    await docker.build(dockerfile, imageName, tags[0]);
    tags.filter(t => t !== tags[0]).map(t => {
        docker.tag(imageName, tags[0], t);
    });
    await docker.push(imageName, tags);
    if (deleteAfter) {
        await docker.rmi(imageName, tags);
    }
}

/**
 * 
 * 更新特定集群中，对应 deployment 的 pod，如果没有变化，也会通过打 patch 的方式，触发强制更新
 * 
 * @param cluster ssh 时，target host 名，可以为 ip，也可以为 ssh config 中已配置的 host
 * @param dir 对应 host 中，k8s 文件目录
 * @param yml 想要更新 yaml 相对 k8s 文件目录的路径
 * @param deployment yaml 中 deployment 的名称
 * @param namespace yaml 中的 namespace
 */
export async function deployK8s(cluster: string, dir: string, yml: string, deployment: string, namespace?: string): Promise<void> {
    // TODO: 根据 dir 与 yml，读取 deployment，namespace 等信息
    await shell.execRemote(cluster, [
        `cd ${dir}`,
        k8sCmd.apply(yml),
        k8sCmd.patch(namespace, deployment, k8sCmd.patchInfo()),
    ]);
}

/**
 * 
 * 更新特定集群中，特定 namespace 的 deployment，通过 patch 方式，触发 deployment 更新
 * 
 * @param cluster ssh 时，target host 名，可以为 ip，也可以为 ssh config 中已配置的 host
 * @param deployment deployment 的名称
 * @param namespace deployment 对应的 namespace
 */
export async function patchDeployment(cluster: string, deployment: string, namespace?: string) {
    await shell.execRemote(cluster, [
        k8sCmd.patch(namespace, deployment, k8sCmd.patchInfo()),
    ]);
}