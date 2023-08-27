---
code: null
id: I_kwDOHuFp685ku0Me
databaseId: 1689994014
number: 763
url: https://github.com/tact-app/web/issues/763
title: "ci/cd: clean up vercel environments on a regular basis"
issueType: null
labels:
  - "type: feature"
  - "scope: inventory"
  - "impact: low"
  - "effort: medium"
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2023-04-30T16:55:05Z
updatedAt: 2023-07-14T19:23:04Z
lastEditedAt: null
closedAt: 2023-07-14T19:23:04Z
---

# ci/cd: clean up vercel environments on a regular basis

**Motivation:** reduce mess.

**Details**

https://github.com/tact-app/web/blob/9450728996294b6293eba1b8939372fdf6b08077/Taskfile#L268-L283

**Steps**

1. run save deletion `rm --yes`
2. run old envs (> 2 months)
3. run a complex deletion process (based on custom filters)
