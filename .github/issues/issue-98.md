---
id: 98
database_id: 1456883225
node_id: I_kwDOHuFp685W1kYZ
status: closed
title: "ci/cd: workflow: improve notification process and add cd part"
labels: ["type: improvement","scope: inventory","impact: high","effort: medium"]
url: https://github.com/tact-app/web/issues/98
created_at: 2022-11-20T12:21:38Z
updated_at: 2022-11-24T13:49:49Z
---

# ci/cd: workflow: improve notification process and add cd part

**Motivation:** `deploy` and `notify` steps run in parallel and make the final result unclear. Find a way to call them sequentially.

See https://github.com/tact-app/internals.js/actions/runs/3507928819 as example.
