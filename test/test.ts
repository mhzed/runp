import { runp } from "../runp";


(async()=>{
  await runp('list files', 'ls -ahl', {
    verbose: true
  }).promise
  await runp('showerr', '>&2 echo some err', {
    verbose: true,
    showstderr: true
  }).promise

})();