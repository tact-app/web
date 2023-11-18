---
id: 81
database_id: 1448727567
node_id: I_kwDOHuFp685WWdQP
status: closed
title: "dev: vercel: clean with empty deployments shows error"
labels: ["type: bug","severity: minor","scope: inventory","impact: medium","effort: easy"]
url: https://github.com/tact-app/web/issues/81
created_at: 2022-11-14T20:47:59Z
updated_at: 2022-11-16T12:31:59Z
---

# dev: vercel: clean with empty deployments shows error

**Reason**

```bash
$ run vercel clean all
Vercel CLI 28.4.14
Error: `vercel rm` expects at least one argument

  ▲ vercel remove [...deploymentId|deploymentName]
```

I deleted all deployments on the previous step and repeated the command. As a result, I see the error message instead of the successful run.
