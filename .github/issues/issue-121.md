---
code: null
id: I_kwDOHuFp685Xa3HJ
databaseId: 1466659273
number: 121
url: https://github.com/tact-app/web/issues/121
title: "ci/cd: registry: support docker hub and quay"
issueType: null
labels:
  - "type: feature"
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
createdAt: 2022-11-28T15:51:23Z
updatedAt: 2022-11-28T18:44:18Z
lastEditedAt: 2022-11-28T15:52:10Z
closedAt: 2022-11-28T18:44:18Z
---

# ci/cd: registry: support docker hub and quay

**Motivation:** provide access to external developers.

**Result**

- `docker pull octopot/tact-app-frontend:latest`
- `docker pull quay.io/octopot/tact-app-frontend:latest`
