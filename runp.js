"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const assign = require("lodash.assign");
exports.runp = (label, command, option) => {
    option = assign({
        stdio: 'pipe',
        shell: true,
        verbose: true,
        showstderr: false // do not show stderr
    }, option);
    if (option.verbose)
        console.log(`[${label} => ${command}]`);
    let process = null;
    if (option.shell) {
        process = child_process_1.spawn(command, [], option);
    }
    else {
        process = child_process_1.spawn(command[0], command.slice(1), option);
    }
    let promise = new Promise((resolve, reject) => {
        process.on('error', (err) => reject(err));
        process.stderr.on('data', (data) => {
            if (option.showstderr)
                console.error(`[${label}.stderr]: ${data.toString().trim()}`);
        });
        process.stdout.on('data', (data) => { if (option.verbose)
            console.log(`[${label}]: ${data.toString().trim()}`); });
        process.on('close', (code) => code ? reject(new Error(`${label} process exit error code ${code}`)) : resolve());
    });
    return { process, promise };
};
//# sourceMappingURL=runp.js.map