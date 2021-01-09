import { execSSH, execSync } from "../utils/shell";
import { findFirstKind, findFirstDeployName, findFirstNamespace } from "./yml";
import { SSHConfig } from "../config";
import { patchInfo } from "../deploy/k8sCmd";

export type DiffInfo = {
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

    // Ubuntu/Linux need run eval $(ssh-agent)
    execSync(`eval $(ssh-agent) && ssh-add`);
    for await (const d of diffs) {
        await apply(d.change, d.file);
    }

    async function apply(change: string, yml: string) {

        if (!yml.endsWith(".yaml") && !yml.endsWith(".yml")) {
            return;
        }

        console.log(`change: ${change} yaml:${yml}`);
        let namespace = findFirstNamespace(yml);
    
        change = change.toUpperCase();
        const kind = findFirstKind(yml);
    
        if (change === "A") {
            await execSSH(config.host, [`cd ${config.dir}`, `kubectl apply -f ${yml}`]);
        } if (change === "D") {
            // TODO: use git show to delete delete file content yml
        } if (change === "M" && kind === "job") {
            // job is complete, need delete before apply
            const command = `cd ${config.dir} && kubectl delete -f ${yml} && kubectl apply -f ${yml}`;
            await execSSH(config.host, command);
        } else if (change === "M") {
            const deployName = findFirstDeployName(yml);
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