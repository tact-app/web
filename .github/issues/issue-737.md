---
id: 737
database_id: 1679865111
node_id: I_kwDOHuFp685kILUX
status: closed
title: "ci/cd: dependabot: cannot update tools"
labels: ["type: bug","severity: minor","scope: deps","scope: inventory","impact: low","effort: easy","status: pending"]
url: https://github.com/tact-app/web/issues/737
created_at: 2023-04-23T05:28:16Z
updated_at: 2023-04-25T06:39:43Z
---

# ci/cd: dependabot: cannot update tools

**Details**

https://github.com/tact-app/web/network/updates/650149457

```
updater | Dependabot encountered '1' error(s) during execution, please check the logs for more details.
updater | +--------------------------------------------+
updater | |       Dependencies failed to update        |
updater | +----------------------------+---------------+
updater | | @withgraphite/graphite-cli | unknown_error |
updater | +----------------------------+---------------+

updater | 2023/04/23 05:18:32 ERROR <job_650149457> Error processing @withgraphite/graphite-cli (Dependabot::SharedHelpers::HelperSubprocessFailed)
updater | 2023/04/23 05:18:32 ERROR <job_650149457> npm WARN using --force Recommended protections disabled.
updater | npm ERR! code EUNSUPPORTEDPROTOCOL
updater | npm ERR! Unsupported URL Type "workspace:": workspace:*
updater | 
updater | npm ERR! A complete log of this run can be found in:
updater | npm ERR!     /home/dependabot/.npm/_logs/2023-04-23T05_18_30_616Z-debug-0.log
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/common/lib/dependabot/shared_helpers.rb:329:in `run_shell_command'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:271:in `run_npm_install_lockfile_only'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:193:in `run_npm8_top_level_updater'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:160:in `run_npm_top_level_updater'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:149:in `block in run_npm_updater'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/common/lib/dependabot/shared_helpers.rb:181:in `with_git_configured'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:146:in `run_npm_updater'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:115:in `run_current_npm_update'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:60:in `block (2 levels) in updated_lockfile_content'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:60:in `chdir'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:60:in `block in updated_lockfile_content'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/common/lib/dependabot/shared_helpers.rb:49:in `block in in_a_temporary_directory'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/common/lib/dependabot/shared_helpers.rb:49:in `chdir'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/common/lib/dependabot/shared_helpers.rb:49:in `in_a_temporary_directory'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:58:in `updated_lockfile_content'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:29:in `updated_lockfile'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater.rb:239:in `updated_lockfile_content'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater.rb:166:in `package_lock_changed?'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater.rb:195:in `block in updated_lockfiles'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater.rb:194:in `each'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater.rb:194:in `updated_lockfiles'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater.rb:40:in `updated_dependency_files'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/dependency_change_builder.rb:85:in `generate_dependency_files'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/dependency_change_builder.rb:36:in `run'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/dependency_change_builder.rb:25:in `create_from'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/updater/operations/update_all_versions.rb:122:in `check_and_create_pull_request'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/updater/operations/update_all_versions.rb:59:in `check_and_create_pr_with_error_handling'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/updater/operations/update_all_versions.rb:34:in `block in perform'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/updater/operations/update_all_versions.rb:34:in `each'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/updater/operations/update_all_versions.rb:34:in `perform'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/updater.rb:69:in `run'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/update_files_command.rb:38:in `perform_job'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> /home/dependabot/dependabot-updater/lib/dependabot/base_command.rb:52:in `run'
updater | 2023/04/23 05:18:32 ERROR <job_650149457> bin/update_files.rb:23:in `<main>'
```
