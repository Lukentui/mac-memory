# mac-memory
node.js utils for getting system memory usage stats on MacOS

Equivalent to what you'll see in the Acivity Monitor app.

```ts
import macMemory from 'mac-memory-ts'

(async () => {
    console.info(await macMemory())
})()
```