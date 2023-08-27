---
code: null
id: I_kwDOHuFp685tdGIk
databaseId: 1836343844
number: 1024
url: https://github.com/tact-app/web/issues/1024
title: "ci/cd: find a way to optimize fontawesome usage"
issueType: null
labels:
  - "type: improvement"
  - "severity: critical"
  - "scope: deps"
  - "impact: high"
  - "effort: hard"
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2023-08-04T08:52:29Z
updatedAt: 2023-08-22T16:56:44Z
lastEditedAt: null
closedAt: 2023-08-22T16:56:44Z
---

# ci/cd: find a way to optimize fontawesome usage

**Motivation:** current setup used 1.74 GB for the first three days: Aug 1 - Aug 3 🤯

![image](https://github.com/tact-app/web/assets/1165416/3abbb1e9-54d3-41b9-ab94-de48c9f1bed7)

<img width="533" alt="image" src="https://github.com/tact-app/web/assets/1165416/71bcea2c-824b-4d5f-ad89-4ab6cf22ef87">

<!-- 2023-08-04T08:53Z https://github.com/tact-app/web/issues/1024#issuecomment-1665268106
I have to tune usage https://fontawesome.com/docs/web/dig-deeper/continuous-integration.
-->

<!-- 2023-08-21T06:45Z https://github.com/tact-app/web/issues/1024#issuecomment-1685744707
![image](https://github.com/tact-app/web/assets/1165416/79648268-3164-47f1-b32d-1534076b9178)
-->

<!-- 2023-08-21T06:46Z https://github.com/tact-app/web/issues/1024#issuecomment-1685745946
the plan:
- switch to monthly dependabot update
- find a way to cache only fontawesome
-->

<!-- 2023-08-22T16:56Z https://github.com/tact-app/web/issues/1024#issuecomment-1688583826
I just reduce dependabot calls. Don't want to find a workaround on how to cache only fontawesome
-->
