---
id: 763
database_id: 1689994014
node_id: I_kwDOHuFp685ku0Me
status: closed
title: "ci/cd: clean up vercel environments on a regular basis"
labels: ["type: feature","scope: inventory","impact: low","effort: medium"]
url: https://github.com/tact-app/web/issues/763
created_at: 2023-04-30T16:55:05Z
updated_at: 2023-07-14T19:23:04Z
---

# ci/cd: clean up vercel environments on a regular basis

**Motivation:** reduce mess.

**Details**

https://github.com/tact-app/web/blob/9450728996294b6293eba1b8939372fdf6b08077/Taskfile#L268-L283

**Steps**

1. run save deletion `rm --yes`
2. run old envs (> 2 months)
3. run a complex deletion process (based on custom filters)
