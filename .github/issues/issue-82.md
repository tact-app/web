---
id: 82
database_id: 1449186751
node_id: I_kwDOHuFp685WYNW_
status: closed
title: "dev: vercel: append token everytime"
labels: ["type: improvement","scope: inventory","impact: medium","effort: easy"]
url: https://github.com/tact-app/web/issues/82
created_at: 2022-11-15T05:22:34Z
updated_at: 2022-11-16T09:57:29Z
---

# dev: vercel: append token everytime

**Motivation:** improve developer experience

```bash
# instead
$ run vercel deploy --token=$(git config vercel.token)
# do
$ run vercel deploy
```
