# mac-memory
node.js utils for getting system memory usage stats on MacOS

Equivalent to what you'll see in the Acivity Monitor app.

```ts
import macMemory from 'mac-memory-ts'

(async () => {
    console.info(await macMemory())
    // {
    //    usedPercent: 83.75, -> percent
    //    used: 28778336256,  -> bytes
    //    total: 34359738368  -> bytes
    // }
})()
```