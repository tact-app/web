---
code: null
id: I_kwDOHuFp685caAb-
databaseId: 1550321406
number: 300
url: https://github.com/tact-app/web/issues/300
title: "[TACT-180] Moving tasks when focusing on the task creation window"
issueType: null
labels: []
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2023-01-20T05:21:55Z
updatedAt: 2026-11-08T14:30:25Z
lastEditedAt: 2023-01-31T15:42:26Z
closedAt: 2023-01-20T13:31:43Z
---

# [TACT-180] Moving tasks when focusing on the task creation window

**Steps to reproduce:**

* Follow the link [https://app.tact.run/today](https://app.tact.run/today)
* Click on the window +Add task
* Enter anything
* Click on the Enter
* Remove focus from a window +Add task
* Put the focus on a window +Add task

**Actual result:**

When the focus is placed on the task creation input, the list of tasks is shifted (since an additional element with a list of hints is drawn)

*\[This appears in all places where the context menu component of the taskbar is used\]*

[9f7d5ad9-12c8-4a45-a6f9-8ca54c79e014](https://uploads.linear.app/b7b17864-2f7e-4734-9916-943c4cbf61af/c9137c08-3a53-48cf-81c3-b76d3d9fa2d9/9f7d5ad9-12c8-4a45-a6f9-8ca54c79e014)

**Expected result:**

The task list doesn't move when window +Add task is focused and when defocusing

[fd8d2c56-8b63-4ebe-b050-99a1f954205d](https://uploads.linear.app/b7b17864-2f7e-4734-9916-943c4cbf61af/00d136f8-797a-4e1d-b945-d9b0df84c913/fd8d2c56-8b63-4ebe-b050-99a1f954205d)

<sub>From [SyncLinear.com](https://synclinear.com) | [TACT-180](https://linear.app/octolab/issue/TACT-180/moving-tasks-when-focusing-on-the-task-creation-window)</sub>
