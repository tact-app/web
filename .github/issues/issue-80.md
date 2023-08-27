---
code: null
id: I_kwDOHuFp685WWcqm
databaseId: 1448725158
number: 80
url: https://github.com/tact-app/web/issues/80
title: "ci/cd: vercel: workflow doesn't respect prod branch"
issueType: null
labels:
  - "type: bug"
  - "severity: major"
  - "scope: inventory"
  - "impact: high"
  - "effort: easy"
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2022-11-14T20:46:02Z
updatedAt: 2022-11-24T13:51:43Z
lastEditedAt: null
closedAt: 2022-11-24T13:51:43Z
---

# ci/cd: vercel: workflow doesn't respect prod branch

**Reason:** I configured production on the prod branch and preview on the main branch, but the workflow doesn't respect this internal knowledge.

Split the `deploy` step for prod and preview.

<!-- 2022-11-24T13:51Z https://github.com/tact-app/web/issues/80#issuecomment-1326482114
fixed, see https://github.com/tact-app/internals.js/blob/4121b34276316781d15fc4ebee4c1b190f798cad/.github/workflows/cd.vercel.yml#L5
-->
