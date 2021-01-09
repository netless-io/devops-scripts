import * as shell from "./shell";
import * as path from "path";

export function gitHash() {
    return shell.execSync("git rev-parse --short HEAD");
}

export function version(jsonPath: string) {
    if (!path.isAbsolute(jsonPath)) {
        jsonPath = path.resolve(process.cwd(), jsonPath);
    }
    const json = require(jsonPath);
    return json.version;
}