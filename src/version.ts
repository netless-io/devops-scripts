import * as shell from "./shell";
import * as path from "path";

export function gitHash(): string {
    return shell.execSync("git rev-parse --short HEAD");
}

export function packageVersion(jsonPath: string): any {
    if (!path.isAbsolute(jsonPath)) {
        jsonPath = path.resolve(process.cwd(), jsonPath);
    }
    const json = require(jsonPath);
    return json.version;
}