runp
--------

wrapper around node's child_process spawn, example:

    async() => {
      let task = run("list file", "ls -al")
      task.process.kill();
      await task.promise;
    }
