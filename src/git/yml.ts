import { execSync } from "../utils/shell";

export function findFirstValue(file: string, key: string) {
    // ignore space
    let value = execSync(`grep '[^\S]*${key}:' ${file} | head -n 1`);
    console.log(`path:${file} key:${key} value:${value}`);
    value = value.replace(" ", "");
    return value.split(":")[1];
}

export function findFirstNamespace(yml: string) {
    return findFirstValue(yml, "namespace");
}

export function findFirstDeployName(yml: string) {
    // warning
    findFirstKind(yml);
    return findFirstValue(yml, "name");
}

// current support kind，not support ingress and service
export type Kind = "deployment" | "statefulset" | "job";

export function findFirstKind(yml: string): Kind {
    const kind = findFirstValue(yml, "kind").toLowerCase();
    if (!["deployment", "statefulset", "job"].includes(kind)) {
        console.error(`${kind} is not support`);
        process.exit(111);
    }
    return kind as Kind;
}