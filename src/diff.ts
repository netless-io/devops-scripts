import {execSync} from "./shell";

export function diff() {
    const stauts = execSync("git diff-tree --no-commit-id -m --name-status -r $(git rev-parse --short HEAD)");
    const diff = stauts.split(/\n/);
    return diff;
}
