import * as shell from "./shell";

export function gitHash(): string {
    return shell.execSync("git rev-parse --short HEAD");
}

export function packageContent(path: string): any {
    const json = require(path);
    return json.version;
}