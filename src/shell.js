const child_process = require("child_process");

function execSyncInDir(dir, command) {
    return execSync(`cd ${dir} && ${command}`);
}

function execSync(command) {
    console.log(`execSync: ${command}`);
    return child_process.execSync(command).toString().trim();
}

async function execInDir(dir, command) {
    return exec(`cd ${dir} && ${command}`);
}

async function exec(command) {
    console.log(`exec: ${command}`);
    return new Promise((resolve, reject) => {
        const cmd = child_process.exec(`${command}`, (err, stdout, stderr) => {
            if (err) {
                reject({ err, stderr });
            } else {
                resolve(stdout);
            }
        });
        cmd.stderr.on("data", data => {
            process.stdout.write(`${data}`);
        });
        cmd.stdout.on("data", data => {
            process.stdout.write(`${data}`);
        });
    });
}

async function execRemote(address, commands) {
    commands = convertArray(commands);
    await exec(`ssh ${address} -tt ${JSON.stringify(commands.join(" && "))}`);
}

function convertArray(commands) {
    if (!(commands instanceof Array)) {
        commands = [commands];
    }
    return commands;
}

process.on("uncaughtException", error => {
    console.error("uncaughtException: ", error);
    process.exit(3);
});
process.on("unhandledRejection", error => {
    console.error("unhandledRejection: ", error);
    process.exit(4);
});

module.exports = {
    execSyncInDir, execSync, execInDir, exec, execRemote
};