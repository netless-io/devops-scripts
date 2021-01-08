import { execSSH, execSync } from "./shell";
import { findKind, getDeployName, getNamespace } from "./yml";
import { SSHConfig } from "./Config";
import { patchInfo } from "./k8sCmd";

type DiffInfo = {
    change: string;
    file: string;
}

export function gitDiff(): DiffInfo[] {
    const stauts = execSync("git diff-tree --no-commit-id -m --no-renames --name-status -r $(git rev-parse --short HEAD)");
    const diff = stauts.split(/\n/);
    const diffMap = diff.map(v => {
        const message = v.split("\t");
        const change = message[0];
        const file = message.pop()!;
        return {change, file};
    });
    return diffMap;
}

export async function applyDiff(config: SSHConfig, diffs: DiffInfo[]) {

    // Ubuntu/Linux need it
    execSync(`eval $(ssh-agent) && ssh-add`);
    for await (const d of diffs) {
        await apply(d.change, d.file);
    }

    async function apply(change: string, yml: string) {

        if (!yml.endsWith(".yaml") && !yml.endsWith(".yml")) {
            return;
        }

        console.log(`change: ${change} yaml:${yml}`);
        let namespace = getNamespace(yml);
    
        change = change.toUpperCase();
        const kind = findKind(yml);
    
        if (change === "A") {
            await execSSH(config.host, [`cd ${config.dir}`, `kubectl apply -f ${yml}`]);
        } if (change === "D") {
            // TODO: 通过 git show 读取内容，进行 delete（要支持多个内容的 delete）
        } if (change === "M" && kind === "job") {
            // job 要先删除，然后再 apply
            const command = `cd ${config.dir} && kubectl delete -f ${yml} && kubectl apply -f ${yml}`;
            await execSSH(config.host, command);
        } else if (change === "M") {
            const deployName = getDeployName(yml);
            await execSSH(config.host, `cd ${config.dir} && kubectl apply -f ${yml}`);
            if (kind === "deployment" || kind === "statefulset") {
                const command = `cd ${config.dir} && kubectl patch ${kind}/${deployName} -n ${namespace} --patch ${patchInfo()}`.replace(/\"/g, "\\\"");
                await execSSH(config.host, command);
            }
        } else {
            console.error(`can't kubectl apply type: ${change} file:${yml}`);
        }
    }
}