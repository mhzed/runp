import { SpawnOptions, ChildProcess, spawn } from "child_process";
import assign = require("lodash.assign");

export type Task = {
  promise: Promise<void>,
  process: ChildProcess
}
export interface RunOption extends SpawnOptions {
  verbose?: boolean,
  showstderr?: boolean,
}
export const runp = (label: string, command: string | string[], option?: RunOption): Task => {
  option = assign({ // the default options
    stdio: 'pipe', 
    shell: true,
    verbose: true,    // show cmd and stdout
    showstderr: false // do not show stderr
  }, option);

  if (option.verbose) console.log(`[${label} => ${command}]`)
  let process: ChildProcess = null;
  if (option.shell) {
    process = spawn(command as string, [], option)
  } else {
    process = spawn((command as string[])[0], (command as string[]).slice(1), option);
  }
  let promise = new Promise<void>((resolve, reject)=>{
    process.on('error', (err)=>reject(err));
    process.stderr.on('data', (data)=>{
      if (option.showstderr) console.error(`[${label}.stderr]: ${data.toString().trim()}`)
    });
    process.stdout.on('data', (data)=>{if (option.verbose) console.log(`[${label}]: ${data.toString().trim()}`)});
    process.on('close', (code)=>code ? reject(new Error(`${label} process exit error code ${code}`)): resolve())
  });
  return {process, promise};
}
