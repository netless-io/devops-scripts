import child_process from "child_process";

export function execSyncInDir(dir: string, command: string): string {
    return execSync(`cd ${dir} && ${command}`);
}

export function execSync(command: string): string {
    console.log(`execSync: ${command}`);
    return child_process.execSync(command).toString().trim();
}

export async function execInDir(dir: string, command: string) {
    return exec(`cd ${dir} && ${command}`);
}

export async function exec(command: string): Promise<string> {
    console.log(`exec: ${command}`);
    return new Promise((resolve, reject) => {
        const cmd = child_process.exec(`${command}`, (err, stdout, stderr) => {
            if (err) {
                reject({ err, stderr });
            } else {
                resolve(stdout);
            }
        });
        cmd.stderr?.on("data", data => {
            process.stdout.write(`${data}`);
        });
        cmd.stdout?.on("data", data => {
            process.stdout.write(`${data}`);
        });
    });
}

export async function execSSH(address: string, commands: string[] | any): Promise<string> {
    commands = convertArray(commands);
    return await exec(`ssh ${address} -tt ${JSON.stringify(commands.join(" && "))}`);
}

function convertArray<T extends string>(commands: T[] | T): T[] {
    if (!(commands instanceof Array)) {
        commands = [commands];
    }
    return commands;
}