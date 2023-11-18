---
id: 363
database_id: 1568006362
node_id: I_kwDOHuFp685ddeDa
status: closed
title: "dev: allow to skip token setup"
labels: ["type: improvement","scope: inventory","impact: medium","effort: easy"]
url: https://github.com/tact-app/web/issues/363
created_at: 2023-02-02T12:53:07Z
updated_at: 2023-02-03T10:31:53Z
---

# dev: allow to skip token setup

**Motivation:** Vercel and Sentry tokens are optional for most of devs.

**Algorithm**

- check token availability
- suggest replacement
- allow skipping, if it isn't required
