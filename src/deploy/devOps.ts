import * as k8sCmd from "./k8sCmd";
import * as shell from "../utils/shell";

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
    await shell.execSSH(cluster, [
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
    await shell.execSSH(cluster, [
        k8sCmd.patch(namespace, deployment, k8sCmd.patchInfo()),
    ]);
}