---
code: null
id: I_kwDOHuFp685nLlqm
databaseId: 1731091110
number: 849
url: https://github.com/tact-app/web/issues/849
title: "dev: Sentry CLI binary not found"
issueType: null
labels:
  - "type: improvement"
  - "scope: deps"
  - "scope: inventory"
  - "impact: low"
  - "effort: easy"
assignees:
  - kamilsk
milestone: null
parent: null
issueFields: {}
state: CLOSED
stateReason: COMPLETED
duplicateOf: null
createdAt: 2023-05-29T18:01:50Z
updatedAt: 2023-05-31T19:48:40Z
lastEditedAt: null
closedAt: 2023-05-31T19:48:40Z
---

# dev: Sentry CLI binary not found

**Details**

```bash
run build

> build
> next build

- info Loaded env from /app/.env
- info Linting and checking validity of types
- info Disabled SWC as replacement for Babel because of custom Babel configuration ".babelrc" https://nextjs.org/docs/messages/swc-disabled
error - Sentry CLI binary not found. Source maps will not be uploaded.

error - Sentry CLI binary not found. Source maps will not be uploaded.

[@sentry/nextjs] You are using Next.js features that run on the Edge Runtime. Please add a "sentry.edge.config.js" or a "sentry.edge.config.ts" file to your project root in which you initialize the Sentry SDK with "Sentry.init()".
error - Sentry CLI binary not found. Source maps will not be uploaded.
```
