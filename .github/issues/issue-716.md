---
id: 716
database_id: 1670900891
node_id: I_kwDOHuFp685jl-yb
status: closed
title: "ci/cd: notify action has a problem"
labels: ["type: bug","severity: minor","scope: inventory","impact: medium","effort: easy"]
url: https://github.com/tact-app/web/issues/716
created_at: 2023-04-17T10:47:48Z
updated_at: 2023-04-18T07:44:03Z
---

# ci/cd: notify action has a problem

**Details**

https://github.com/tact-app/web/actions/runs/4719810324/jobs/8371132735#step:4:20

```
if [ "true" == 'true' ]
  then
    echo txt="Revert "feat(deps): bump react-datepicker from 4.10.0 to 4.10.1 (#715)"
  
  This reverts commit 50b56fa0a3a9274d5de3f1b4d2ddefa8a5d45d77." | head -1 >> $GITHUB_OUTPUT
  elif [ "false" == 'true' ]
  then
    echo txt="regular healthcheck" >> $GITHUB_OUTPUT
  elif [ "false" == 'true' ]
  then
    echo txt="" >> $GITHUB_OUTPUT
  fi
  shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
/home/runner/work/_temp/ad41c761-f483-46eb-b22d-b36703bb890e.sh: line 3: syntax error near unexpected token `('
```

It should unescape quotes.
