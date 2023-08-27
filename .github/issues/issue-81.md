---
code: null
id: I_kwDOHuFp685WWdQP
databaseId: 1448727567
number: 81
url: https://github.com/tact-app/web/issues/81
title: "dev: vercel: clean with empty deployments shows error"
issueType: null
labels:
  - "type: bug"
  - "severity: minor"
  - "scope: inventory"
  - "impact: medium"
  - "effort: easy"
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2022-11-14T20:47:59Z
updatedAt: 2022-11-16T12:31:59Z
lastEditedAt: 2022-11-14T20:48:14Z
closedAt: 2022-11-16T12:31:59Z
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
