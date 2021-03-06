import { SpawnOptions, ChildProcess, spawn } from "child_process";
import assign = require("lodash.assign");
import 'colors'

export type Task = {
  promise: Promise<void>,
  process: ChildProcess
}
export interface RunOption extends SpawnOptions {
  verbose?: boolean,      // print to console even when in stdio 'pipe' mode
  showstderr?: boolean,
}
/**
 * label:  label any console output with this
 * command: single string (option.shell is true) or command tokens (option.shell is false)
 */
export function runp (label: string, command: string | string[], option?: RunOption): Task {
  option = assign({ // the default options
    stdio: 'pipe', 
    shell: true,
    verbose: true,    // show cmd and stdout
    showstderr: false // do not show stderr
  }, option);
  
  let process: ChildProcess = null;
  if (option.shell) {
    if (option.verbose) console.log(`[${label} => ${command}]`.grey)
    process = spawn(command as string, [], option)
  } else {
    if (option.verbose) console.log(`[${label} => ${(command as string[]).join(' ')}]`.grey)
    process = spawn((command as string[])[0], (command as string[]).slice(1), option);
  }
  let promise = new Promise<void>((resolve, reject)=>{
    process.on('error', (err)=>reject(err));
    if (option.stdio === 'pipe') {
      let stdlabel = label ? `[${label}] `.grey : '';
      let stderrlabel = label ? `[${(label+'.stderr')}] `.red : '';    
      process.stderr.on('data', (data)=>{
        if (option.showstderr) console.error(`${stderrlabel}${data.toString().trim()}`)
      });
      process.stdout.on('data', (data)=>{
        if (option.verbose) console.log(`${stdlabel}${data.toString().trim()}`)
      });
    }
    process.on('close', (code)=>
      code ? reject(new Error(`${label} process exit error code ${code}`)) : resolve()
    )
  });
  return {process, promise};
}
