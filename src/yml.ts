import { execSync } from "./shell";

export function findFirstValue(file: string, key: string) {
    // 忽视空格缩进，选择第一个出现的作为值
    let value = execSync(`grep '[^\S]*${key}:' ${file} | head -n 1`);
    console.log(`path:${file} key:${key} value:${value}`);
    value = value.replace(" ", "");
    return value.split(":")[1];
}

export function getNamespace(yml: string) {
    return findFirstValue(yml, "namespace");
}

export function getDeployName(yml: string) {
    findKind(yml);
    return findFirstValue(yml, "name");
}

// 目前支持的 kind，不支持 ingress 和 service
export type Kind = "deployment" | "statefulset"

export function findKind(yml: string) {
    const kind = findFirstValue(yml, "kind").toLowerCase();
    if (kind !== "deployment" || "statefulset") {
        console.error(`${kind} is not support`);
        process.exit(111);
    }
}