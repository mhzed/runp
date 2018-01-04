"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const assign = require("lodash.assign");
require("colors");
/**
 * label:  label any console output with this
 * command: single string (option.shell is true) or command tokens (option.shell is false)
 */
function runp(label, command, option) {
    option = assign({
        stdio: 'pipe',
        shell: true,
        verbose: true,
        showstderr: false // do not show stderr
    }, option);
    let process = null;
    if (option.shell) {
        if (option.verbose)
            console.log(`[${label} => ${command}]`.grey);
        process = child_process_1.spawn(command, [], option);
    }
    else {
        if (option.verbose)
            console.log(`[${label} => ${command.join(' ')}]`.grey);
        process = child_process_1.spawn(command[0], command.slice(1), option);
    }
    let promise = new Promise((resolve, reject) => {
        process.on('error', (err) => reject(err));
        if (option.stdio === 'pipe') {
            let stdlabel = label ? `[${label}] `.grey : '';
            let stderrlabel = label ? `[${(label + '.stderr')}] `.red : '';
            process.stderr.on('data', (data) => {
                if (option.showstderr)
                    console.error(`${stderrlabel}${data.toString().trim()}`);
            });
            process.stdout.on('data', (data) => {
                if (option.verbose)
                    console.log(`${stdlabel}${data.toString().trim()}`);
            });
        }
        process.on('close', (code) => code ? reject(new Error(`${label} process exit error code ${code}`)) : resolve());
    });
    return { process, promise };
}
exports.runp = runp;
//# sourceMappingURL=runp.js.map