---
id: 226
database_id: 1511569125
node_id: I_kwDOHuFp685aGLbl
status: closed
title: "core: broken build by chakra-ui"
labels: ["type: bug","severity: critical","scope: deps","impact: high"]
url: https://github.com/tact-app/web/issues/226
created_at: 2022-12-27T08:36:05Z
updated_at: 2022-12-30T07:32:11Z
---

# core: broken build by chakra-ui

```
info  - Collecting page data ...file:///app/node_modules/@chakra-ui/utils/dist/chunk-SV3JYFGC.mjs:20
import sync, { cancelSync, getFrameData } from "framesync";
               ^^^^^^^^^^
SyntaxError: Named export 'cancelSync' not found. The requested module 'framesync' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from 'framesync';
const { cancelSync, getFrameData } = pkg;

    at ModuleJob._instantiate (node:internal/modules/esm/module_job:123:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:189:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:530:24)
    at async importModuleDynamicallyWrapper (node:internal/vm/module:438:15)

> Build error occurred
Error: Failed to collect page data for /goals
    at /app/node_modules/next/dist/build/utils.js:960:15
    at processTicksAndRejections (node:internal/process/task_queues:96:5) {
  type: 'Error'
}
```

Related to
- chakra-ui/chakra-ui/issues/7166
- chakra-ui/chakra-ui/issues/7167
