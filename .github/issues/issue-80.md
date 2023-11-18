---
id: 80
database_id: 1448725158
node_id: I_kwDOHuFp685WWcqm
status: closed
title: "ci/cd: vercel: workflow doesn't respect prod branch"
labels: ["type: bug","severity: major","scope: inventory","impact: high","effort: easy"]
url: https://github.com/tact-app/web/issues/80
created_at: 2022-11-14T20:46:02Z
updated_at: 2022-11-24T13:51:43Z
---

# ci/cd: vercel: workflow doesn't respect prod branch

**Reason:** I configured production on the prod branch and preview on the main branch, but the workflow doesn't respect this internal knowledge.

Split the `deploy` step for prod and preview.
