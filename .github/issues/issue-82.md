---
code: null
id: I_kwDOHuFp685WYNW_
databaseId: 1449186751
number: 82
url: https://github.com/tact-app/web/issues/82
title: "dev: vercel: append token everytime"
issueType: null
labels:
  - "type: improvement"
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
createdAt: 2022-11-15T05:22:34Z
updatedAt: 2022-11-16T09:57:29Z
lastEditedAt: null
closedAt: 2022-11-16T09:57:29Z
---

# dev: vercel: append token everytime

**Motivation:** improve developer experience

```bash
# instead
$ run vercel deploy --token=$(git config vercel.token)
# do
$ run vercel deploy
```
