---
code: null
id: I_kwDOHuFp685ddeDa
databaseId: 1568006362
number: 363
url: https://github.com/tact-app/web/issues/363
title: "dev: allow to skip token setup"
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
createdAt: 2023-02-02T12:53:07Z
updatedAt: 2023-02-03T10:31:53Z
lastEditedAt: null
closedAt: 2023-02-03T10:31:53Z
---

# dev: allow to skip token setup

**Motivation:** Vercel and Sentry tokens are optional for most of devs.

**Algorithm**

- check token availability
- suggest replacement
- allow skipping, if it isn't required
