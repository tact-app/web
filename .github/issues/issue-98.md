---
code: null
id: I_kwDOHuFp685W1kYZ
databaseId: 1456883225
number: 98
url: https://github.com/tact-app/web/issues/98
title: "ci/cd: workflow: improve notification process and add cd part"
issueType: null
labels:
  - "type: improvement"
  - "scope: inventory"
  - "impact: high"
  - "effort: medium"
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2022-11-20T12:21:38Z
updatedAt: 2022-11-24T13:49:49Z
lastEditedAt: null
closedAt: 2022-11-24T13:49:49Z
---

# ci/cd: workflow: improve notification process and add cd part

**Motivation:** `deploy` and `notify` steps run in parallel and make the final result unclear. Find a way to call them sequentially.

See https://github.com/tact-app/internals.js/actions/runs/3507928819 as example.

<!-- 2022-11-24T13:49Z https://github.com/tact-app/web/issues/98#issuecomment-1326480130
fixed, see
- f37c7d99b5b08df09618d93f6c4dc62e96f85a54
- 4121b34276316781d15fc4ebee4c1b190f798cad
-->
