---
title: Changelog
---

# Release notes, v0.4.0

## Features

- [TACT-393](https://linear.app/tact/issue/TACT-393/auth0-integration): Auth0 integration (#927)

## Improvements

- [TACT-335](https://linear.app/tact/issue/TACT-335/goal-setting-rework-update-the-emoji-picker-type): Goal setting rework: Update the emoji picker type (#838)
- [TACT-336](https://linear.app/tact/issue/TACT-336/goal-setting-rework-shange-task-editor-behaviour): Goal setting rework: Сhange Task Editor behaviour (#837)
- [TACT-389](https://linear.app/tact/issue/TACT-389/adopt-changes-from-react-datepicker-and-typesreact-datepicker-try-to): Adopt changes from react-datepicker and @types/react-datepicker, try to fix vercel build on next.js 13.4.4 (#850)
- [TACT-346](https://linear.app/tact/issue/TACT-346/goal-setting-rework-additional-improvements): Goal setting rework: Additional improvements (#879)

## Fixes

- [TACT-390](https://linear.app/tact/issue/TACT-390/fix-broken-builds-with-new-typescript-513-and-typesreact-1828): Fix broken builds with new typescript (5.1.3) and @types/react (18.2.8) (#864)
- [TACT-393](https://linear.app/tact/issue/TACT-393/auth0-integration): 404 error for pages (#934)

## Dependencies

### Production

- feat(deps): bump @chakra-ui/modal from 2.2.11 to 2.2.12 (#855)
- feat(deps): bump @chakra-ui/react from 2.6.1 to 2.7.1 (#854, #893)
- feat(deps): bump @chakra-ui/theme-tools from 2.0.17 to 2.0.18 (#853)
- feat(deps): bump @emotion/react from 11.11.0 to 11.11.1 (#869)
- feat(deps): bump @faker-js/faker from 7.6.0 to 8.0.2 (#804, #811, #846)
- feat(deps): bump @sentry/nextjs from 7.51.2 to 7.57.0 (#810, #834, #858, #882, #885, #892, #908)
- feat(deps): bump framer-motion from 10.12.8 to 10.12.18 (#805, #814, #835, #902, #914)
- feat(deps): bump next from 13.4.1 to 13.4.9 (#803, #824, #840, #876, #888, #897, #926)
- feat(deps): bump prosemirror-state from 1.4.2 to 1.4.3 (#816)
- feat(deps): bump react-datepicker from 4.12.0 to 4.16.0 (#878, #890, #895, #915, #936)
- feat(deps): bump react-hotkeys-hook from 4.4.0 to 4.4.1 (#919)

### Development

- chore(deps-dev): bump @babel/core from 7.21.8 to 7.22.8 (#845, #871, #924)
- chore(deps-dev): bump @types/node from 20.1.1 to 20.4.1 (#802, #817, #818, #826, #842, #844, #872, #875, #880, #922, #928)
- chore(deps-dev): bump @types/react from 18.2.6 to 18.2.14 (#832, #857, #870, #874, #881, #894, #903)
- chore(deps-dev): bump eslint from 8.40.0 to 8.44.0 (#825, #862, #891, #913)
- chore(deps-dev): bump eslint-config-next from 13.4.1 to 13.4.9 (#806, #821, #841, #852, #877, #887, #898, #925)
- chore(deps-dev): bump eslint-plugin-unused-imports from 2.0.0 to 3.0.0 (#935)
- chore(deps-dev): bump prettier from 2.8.8 to 3.0.0 (#921)
- chore(deps-dev): bump typescript from 5.1.3 to 5.1.6 (#906, #909)
- chore(deps-dev): bump vercel from 30.2.0 to 30.2.1
- ci/cd(deps): bump actions/upload-pages-artifact from 1 to 2 (#931)
- docs(deps): bump next from 13.4.1 to 13.4.9 in /docs (#798, #820, #843, #873, #889, #899, #923)
- docs(deps): bump nextra-theme-docs from 2.5.1 to 2.9.0 in /docs (#799, #836, #847, #865, #901, #929)
- tools(deps): bump @sentry/cli from 2.17.5 to 2.19.4 in /tools (#823, #827, #886, #904, #907)
- tools(deps): bump @withgraphite/graphite-cli from 0.20.18 to 0.20.22 in /tools (#796, #900, #930)
- tools(deps): bump vercel from 29.2.1 to 31.0.2 in /tools (#797, #815, #819, #822, #833, #859, #863, #883, #896, #910, #932)
- tools(deps): bump vm2 from 3.9.17 to 3.9.18 in /tools (#807)

## Miscellaneous

- dev: temporary disabling engine-strict
- fix #800: docs: bad title for release notes
- fix #848: dev: md5sum: command not found
- TS update (#861)
- chore: change file permissions for the scripts
- ci/cd: temporary hacks to fix builds
- dev: add debug method instead whoami
- dev: complete @deps refactoring
- dev: declare includes explicitly and support publish subcommand for docs
- dev: define @root command
- dev: final cut for Taskfile
- dev: improve Taskfile for docker run
- dev: move setup to the app
- dev: refactor @deps install
- dev: refactor core
- dev: refactor core/legacy
- dev: refactor docs
- dev: refactor setup tokens
- dev: simplify @npm and move config to app
- dev: split Taskfile, first iteration
- dev: split Taskfile, refactoring
- dev: split Taskfile, second iteration - tools
- dev: split Taskfile, third iteration - app and core
- dev: split refresh command and define @pull
- fix #210: dev: sentry doesnt work on staging/production
- fix #849: dev: Sentry CLI binary not found
- chore: routine with auth0 and vercel

## Active contributors

Special thanks to the following contributors for their contributions to this release:
- @kamilsk, Lead
- @al-petrushin, Dev

## Full changelog

Compare view [v0.3.0...v0.4.0][].

[v0.3.0...v0.4.0]: https://github.com/tact-app/web/compare/v0.3.0...v0.4.0

---

# Release notes, v0.3.0

## Improvements

- [TACT-305](https://linear.app/tact/issue/TACT-305/separate-input-shortcuts-and-context-menu-and-keyboard-shortcuts): Separate input shortcuts and context menu, and keyboard shortcuts (#717)
- [TACT-111](https://linear.app/tact/issue/TACT-111/goal-setting-rework): Goal setting rework (#575)
- [TACT-332](https://linear.app/tact/issue/TACT-332/goal-setting-rework-toolbar-actions-filters): Goal setting rework: Toolbar, Actions, Filters (#685)
- [TACT-347](https://linear.app/tact/issue/TACT-347/goal-setting-rework-archived-goals-page): Goal setting rework: Archived Goals Page (#711)
- [TACT-333](https://linear.app/tact/issue/TACT-333/goal-setting-rework-task-list): Goal setting rework: Task list (#738)
- [TACT-346](https://linear.app/tact/issue/TACT-346/goal-setting-rework-additional-improvements): Goal setting rework: Additional improvements, part I (#795)
- [TACT-348](https://linear.app/tact/issue/TACT-348/goal-setting-rework-keyboard-navigation): Goal setting rework: Keyboard Navigation (#769)

## Fixes

- Fixed action menu display (#749)
- fix #620: fix cache keys, sync Cache invalidation workflow
- Reverted mobx-react-lite version (#661)
- Revert "feat(deps): bump react-datepicker from 4.10.0 to 4.10.1 (#715)"

## Dependencies

### Production

- feat(deps): bump @chakra-ui/modal from 2.2.9 to 2.2.10 (#606)
- feat(deps): bump @chakra-ui/react from 2.5.2 to 2.6.1 (#608, #622, #746, #774)
- feat(deps): bump @chakra-ui/system from 2.5.3 to 2.5.4 (#621, #744)
- feat(deps): bump @emotion/react from 11.10.6 to 11.10.8 (#754, #784)
- feat(deps): bump @emotion/styled from 11.10.6 to 11.10.8 (#757, #783)
- feat(deps): bump @fortawesome/fontawesome-pro from 6.3.0 to 6.4.0 (#627)
- feat(deps): bump @fortawesome/pro-light-svg-icons from 6.2.1 to 6.4.0 (#627)
- feat(deps): bump @fortawesome/pro-regular-svg-icons from 6.2.1 to 6.4.0 (#627)
- feat(deps): bump @fortawesome/pro-solid-svg-icons from 6.2.1 to 6.4.0 (#627)
- feat(deps): bump @sentry/nextjs from 7.43.0 to 7.51.2 (#596, #600, #616, #677, #708, #727, #750, #778, #791)
- feat(deps): bump @tiptap/core from 2.0.0 to 2.0.3 (#652, #639, #668, #699)
- feat(deps): bump @tiptap/extension-highlight from 2.0.0 to 2.0.3 (#658, #642, #672, #700)
- feat(deps): bump @tiptap/extension-link from 2.0.0 to 2.0.3 (#659, #645, #673, #707)
- feat(deps): bump @tiptap/extension-placeholder from 2.0.0 to 2.0.3 (#648, #634, #666, #703)
- feat(deps): bump @tiptap/extension-task-item from 2.0.0 to 2.0.3 (#660, #644, #674, #705)
- feat(deps): bump @tiptap/extension-task-list from 2.0.0 to 2.0.3 (#649, #643, #665, #698)
- feat(deps): bump @tiptap/extension-underline from 2.0.0 to 2.0.3 (#651, #638, #670, #706)
- feat(deps): bump @tiptap/react from 2.0.0 to 2.0.3 (#655, #641, #671, #701)
- feat(deps): bump @tiptap/starter-kit from 2.0.0 to 2.0.3 (#654, #635, #667, #702)
- feat(deps): bump @tiptap/suggestion from 2.0.0 to 2.0.3 (#657, #640, #669, #704)
- feat(deps): bump allotment from 1.18.1 to 1.19.0 (#748)
- feat(deps): bump framer-motion from 10.6.0 to 10.12.8 (#598, #602, #603, #615, #678, #687, #690, #693, #710, #720, #766, #771, #790)
- feat(deps): bump mobx from 6.8.0 to 6.9.0 (#617)
- feat(deps): bump mobx-react-lite from 3.4.3 to 4.0.2 (#619)
- feat(deps): bump next from 13.2.4 to 13.4.1 (#680, #731, #760, #768, #780, #785)
- feat(deps): bump react-datepicker from 4.10.0 to 4.11.0 (#715, #663, #697)
- feat(deps): bump react-hotkeys-hook from 4.3.8 to 4.4.0 (#709)

### Development

- chore(deps-dev): bump @babel/core from 7.21.3 to 7.21.8 (#662, #761, #770)
- chore(deps-dev): bump @types/node from 18.15.3 to 20.1.1 (#597, #609, #614, #618, #633, #723, #726, #736, #745, #752, #762, #792)
- chore(deps-dev): bump @types/react from 18.0.28 to 18.2.6 (#611, #623, #632, #664, #675, #686, #691, #719, #728, #747, #772, #782)
- chore(deps-dev): bump eslint from 8.36.0 to 8.40.0 (#631, #682, #732, #786)
- chore(deps-dev): bump eslint-config-next from 13.2.4 to 13.4.1 (#679, #730, #758, #765, #776, #788)
- chore(deps-dev): bump eslint-config-prettier from 8.7.0 to 8.8.0 (#599)
- chore(deps-dev): bump prettier from 2.8.5 to 2.8.8 (#601, #613, #739)
- chore(deps-dev): bump typescript from 4.9.5 to 5.0.4 (#647, #683)
- docs(deps): bump nextra-theme-docs from 2.5.0 to 2.5.1 in /docs (#793)
- tools(deps): bump @sentry/cli from 2.15.2 to 2.17.5 in /tools (#612, #630, #676, #688, #692, #721, #725, #756)
- tools(deps): bump @withgraphite/graphite-cli from 0.20.14 to 0.20.18 in /tools (#605, #740, #755)
- tools(deps): bump next from 13.3.0 to 13.4.1 in /tools (#729, #753, #767, #777, #789)
- tools(deps): bump nextra-theme-docs from 2.3.0 to 2.5.0 in /tools (#712, #734, #741, #779)
- tools(deps): bump vercel from 28.17.0 to 29.2.1 in /tools (#604, #610, #624, #684, #689, #722, #724, #751, #759, #764, #773, #794)
- tools(deps): bump vm2 from 3.9.14 to 3.9.16 in /tools (#681, #696)

## Miscellaneous

- chore(deps): fix depcheck issues
- chore(deps): update transitive deps
- chore: dev: customize listening port
- chore: dev: improve refresh command to work with forks
- chore: fix hidden dependencies
- chore: minor downgrade node version for vercel
- chore: update settings and refactor Taskfile
- ci/cd: add Dependabot at weekends experimental workflow
- ci/cd: add Documentation delivery workflow boilerplate
- ci/cd: add Workflow invalidation, refactor Continuous integration, rename Continuous delivery
- ci/cd: add name for cron job
- ci/cd: dependabot: reorg config
- ci/cd: experiments with caching
- ci/cd: optimize Continuous integration workflow
- ci/cd: refactor Continuous delivery (Docker) workflow
- ci/cd: refactor Continuous delivery (Vercel) workflow
- ci/cd: refactor workflows
- ci/cd: refactor workflows and adopt scripts for new docs structure
- ci/cd: replace stale bot by github action based on actions/stale
- ci/cd: run Workflow invalidation by cron
- ci/cd: try to fix notify action
- ci/cd: try to fix warning in Documentation delivery workflow
- docs: add redirects
- docs: add social previews
- docs: build local artifacts
- docs: changelog: split changelog by versions and move it to /docs
- docs: publish notes about v0.3.0-rc.3 release
- docs: remove static artifacts
- docs: rename Tact.app to Tact.web
- docs: reorg structure
- feat: switch to node v18
- fix #694: docs: integrate Nextra for docs publishing
- fix #695: ci/cd: configure GitHub Pages for docs
- fix #716: ci/cd: notify action has a problem
- fix #733: deps: remove hack for chakra-ui/react-use-outside-click
- fix #735: ci/cd: notification has wrong status
- issue #695: prepare content
- issue #735: experiments with Documentation delivery workflow to check notifications

## Active contributors

Special thanks to the following contributors for their contributions to this release:
- @kamilsk, Lead
- @al-petrushin, Dev
- @DimovyM, Dev
- @Tatiana683, QA

## Full changelog

Compare view [v0.2.0...v0.3.0](https://github.com/tact-app/web/compare/v0.2.0...v0.3.0).

---

# Release notes, v0.2.0

## Improvements

- [TACT-87](https://linear.app/tact/issue/TACT-87/support-right-click-and-control-with-left-click): Support right-click, and Control with left-click (#455, #550, #556, #563)
- [TACT-50](https://linear.app/tact/issue/TACT-50/select-tasks-by-cursor): Select tasks by cursor (#510)
- [TACT-294](https://linear.app/tact/issue/TACT-294/tags-window-doesnt-close-when-esc-is-pressed): Tags window doesn't close when ESC is pressed (#533)
- [TACT-137](https://linear.app/tact/issue/TACT-137/rework-arrow-experience): Rework arrow experience (#495)
- [TACT-138](https://linear.app/tact/issue/TACT-138/highlight-actual-context): Highlight actual context (#495)
- [TACT-40](https://linear.app/octolab/issue/TACT-40/make-editor-context-consistent): Make editor context consistent (#459)
- [TACT-105](https://linear.app/octolab/issue/TACT-105/improve-experience-while-tag-editing): Improve experience while tag editing (#456)
- [TACT-216](https://linear.app/octolab/issue/TACT-216/it-isnt-possible-to-remove-one-or-more-tags-from-the-editors-list): It isn't possible to remove one or more tags from the editor's list (#461)
- [TACT-223](https://linear.app/octolab/issue/TACT-223/no-scrolling-option-when-creating-more-than-14-spaces): No scrolling option when creating more than 14 spaces (#460)

## Fixes

- [TACT-137](https://linear.app/tact/issue/TACT-137/rework-arrow-experience) fixes (#549)
- [TACT-105](https://linear.app/octolab/issue/TACT-105/improve-experience-while-tag-editing) fixes (#555, #564)
- [TACT-138](https://linear.app/tact/issue/TACT-138/highlight-actual-context) fixes (#555, #564, #567)
- [TACT-245](https://linear.app/octolab/issue/TACT-245/task-with-an-empty-name-jumps-in-edit-mode): Task with an empty name jumps in edit mode (#477)
- [TACT-247](https://linear.app/octolab/issue/TACT-247/the-presence-of-sorting-in-the-context-of-the-inbox-tab): The presence of sorting in the context of the inbox tab (#457)

## Dependencies

### Production

- feat(deps): bump @chakra-ui/react from 2.5.1 to 2.5.2 (#592)
- feat(deps): bump @emotion/react from 11.10.5 to 11.10.6 (#482)
- feat(deps): bump @emotion/styled from 11.10.5 to 11.10.6 (#481)
- feat(deps): bump @sentry/nextjs from 7.37.2 to 7.38.0 (#483)
- feat(deps): bump @sentry/nextjs from 7.38.0 to 7.39.0 (#521)
- feat(deps): bump @sentry/nextjs from 7.39.0 to 7.40.0 (#544)
- feat(deps): bump @sentry/nextjs from 7.40.0 to 7.41.0 (#558)
- feat(deps): bump @sentry/nextjs from 7.41.0 to 7.42.0 (#570)
- feat(deps): bump @sentry/nextjs from 7.42.0 to 7.43.0 (#581)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.48 to 3.0.0-beta.49 (#498)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.49 to 3.0.0-beta.52 (#512)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.52 to 3.0.0-beta.53 (#554)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.53 to 3.0.0-beta.54 (#560)
- feat(deps): bump @tiptap/core from 2.0.0-beta.217 to 2.0.0-beta.218 (#493)
- feat(deps): bump @tiptap/extension-highlight from 2.0.0-beta.217 to 2.0.0-beta.218 (#492)
- feat(deps): bump @tiptap/extension-highlight from 2.0.0-beta.218 to 2.0.0-beta.219 (#517)
- feat(deps): bump @tiptap/extension-highlight from 2.0.0-beta.218 to 2.0.0-beta.220 (#529)
- feat(deps): bump @tiptap/extension-link from 2.0.0-beta.217 to 2.0.0-beta.218 (#485)
- feat(deps): bump @tiptap/extension-link from 2.0.0-beta.218 to 2.0.0-beta.220 (#526)
- feat(deps): bump @tiptap/extension-placeholder from 2.0.0-beta.217 to 2.0.0-beta.218 (#487)
- feat(deps): bump @tiptap/extension-placeholder from 2.0.0-beta.218 to 2.0.0-beta.219 (#523)
- feat(deps): bump @tiptap/extension-placeholder from 2.0.0-beta.219 to 2.0.0-beta.220 (#534)
- feat(deps): bump @tiptap/extension-task-item from 2.0.0-beta.217 to 2.0.0-beta.218 (#488)
- feat(deps): bump @tiptap/extension-task-item from 2.0.0-beta.218 to 2.0.0-beta.220 (#528)
- feat(deps): bump @tiptap/extension-task-list from 2.0.0-beta.217 to 2.0.0-beta.218 (#486)
- feat(deps): bump @tiptap/extension-task-list from 2.0.0-beta.218 to 2.0.0-beta.220 (#527)
- feat(deps): bump @tiptap/extension-underline from 2.0.0-beta.217 to 2.0.0-beta.218 (#484)
- feat(deps): bump @tiptap/extension-underline from 2.0.0-beta.218 to 2.0.0-beta.219 (#524)
- feat(deps): bump @tiptap/extension-underline from 2.0.0-beta.219 to 2.0.0-beta.220 (#539)
- feat(deps): bump @tiptap/react from 2.0.0-beta.217 to 2.0.0-beta.218 (#494)
- feat(deps): bump @tiptap/react from 2.0.0-beta.218 to 2.0.0-beta.220 (#532)
- feat(deps): bump @tiptap/starter-kit from 2.0.0-beta.217 to 2.0.0-beta.218 (#490)
- feat(deps): bump @tiptap/starter-kit from 2.0.0-beta.218 to 2.0.0-beta.220 (#531)
- feat(deps): bump @tiptap/suggestion from 2.0.0-beta.217 to 2.0.0-beta.218 (#489)
- feat(deps): bump @tiptap/suggestion from 2.0.0-beta.218 to 2.0.0-beta.219 (#525)
- feat(deps): bump @tiptap/suggestion from 2.0.0-beta.219 to 2.0.0-beta.220 (#535)
- feat(deps): bump framer-motion from 10.0.0 to 10.0.1 (#518)
- feat(deps): bump framer-motion from 10.0.1 to 10.0.2 (#553)
- feat(deps): bump framer-motion from 10.0.2 to 10.1.0 (#559)
- feat(deps): bump framer-motion from 10.1.0 to 10.6.0 (#566)
- feat(deps): bump framer-motion from 10.2.3 to 10.2.4 (#573)
- feat(deps): bump framer-motion from 10.2.4 to 10.2.5 (#578)
- feat(deps): bump framer-motion from 10.2.5 to 10.3.1 (#583)
- feat(deps): bump framer-motion from 10.3.1 to 10.3.2 (#586)
- feat(deps): bump framer-motion from 10.3.2 to 10.5.0 (#589)
- feat(deps): bump framer-motion from 10.5.0 to 10.6.0 (#593)
- feat(deps): bump framer-motion from 9.0.3 to 9.0.4 (#479)
- feat(deps): bump framer-motion from 9.0.4 to 9.0.7 (#499)
- feat(deps): bump framer-motion from 9.0.7 to 9.1.6 (#504)
- feat(deps): bump framer-motion from 9.1.6 to 10.0.0 (#509)
- feat(deps): bump mobx-react-lite from 3.4.0 to 3.4.2 (#552)
- feat(deps): bump mobx-react-lite from 3.4.2 to 3.4.3 (#568)
- feat(deps): bump next from 13.1.6 to 13.2.1 (#503)
- feat(deps): bump next from 13.2.1 to 13.2.2 (#537)
- feat(deps): bump next from 13.2.2 to 13.2.3 (#540)
- feat(deps): bump next from 13.2.3 to 13.2.4 (#571)
- feat(deps): bump react-hotkeys-hook from 4.3.5 to 4.3.6 (#496)
- feat(deps): bump react-hotkeys-hook from 4.3.6 to 4.3.7 (#501)
- feat(deps): bump react-hotkeys-hook from 4.3.7 to 4.3.8 (#579)

### Development

- chore(deps-dev): bump @babel/core from 7.20.12 to 7.21.0 (#497)
- chore(deps-dev): bump @babel/core from 7.21.0 to 7.21.3 (#584)
- chore(deps-dev): bump @types/node from 18.13.0 to 18.14.0 (#491)
- chore(deps-dev): bump @types/node from 18.14.0 to 18.14.1
- chore(deps-dev): bump @types/node from 18.14.1 to 18.14.2 (#513)
- chore(deps-dev): bump @types/node from 18.14.2 to 18.14.3 (#543)
- chore(deps-dev): bump @types/node from 18.14.3 to 18.14.6 (#548)
- chore(deps-dev): bump @types/node from 18.14.6 to 18.15.0 (#569)
- chore(deps-dev): bump @types/node from 18.15.0 to 18.15.1 (#577)
- chore(deps-dev): bump @types/node from 18.15.1 to 18.15.2 (#580)
- chore(deps-dev): bump @types/node from 18.15.2 to 18.15.3 (#582)
- chore(deps-dev): bump eslint from 8.34.0 to 8.35.0 (#511)
- chore(deps-dev): bump eslint from 8.35.0 to 8.36.0 (#574)
- chore(deps-dev): bump eslint-config-next from 13.1.6 to 13.2.1 (#507)
- chore(deps-dev): bump eslint-config-next from 13.2.1 to 13.2.2 (#538)
- chore(deps-dev): bump eslint-config-next from 13.2.2 to 13.2.3 (#541)
- chore(deps-dev): bump eslint-config-next from 13.2.3 to 13.2.4 (#572)
- chore(deps-dev): bump eslint-config-prettier from 8.6.0 to 8.7.0 (#557)
- chore(deps-dev): bump prettier from 2.8.4 to 2.8.5 (#595)
- tools(deps): bump @sentry/cli from 2.12.0 to 2.13.0 in /tools (#478)
- tools(deps): bump @sentry/cli from 2.13.0 to 2.14.3 in /tools (#547)
- tools(deps): bump @sentry/cli from 2.14.3 to 2.14.4 in /tools (#561)
- tools(deps): bump @sentry/cli from 2.14.4 to 2.15.0 in /tools (#585)
- tools(deps): bump @sentry/cli from 2.15.0 to 2.15.1 in /tools (#587)
- tools(deps): bump @sentry/cli from 2.15.1 to 2.15.2 in /tools (#591)
- tools(deps): bump vercel from 28.15.6 to 28.16.2 in /tools (#480)
- tools(deps): bump vercel from 28.16.10 to 28.16.11 in /tools (#542)
- tools(deps): bump vercel from 28.16.11 to 28.16.12 in /tools (#546)
- tools(deps): bump vercel from 28.16.12 to 28.16.13 in /tools (#562)
- tools(deps): bump vercel from 28.16.13 to 28.16.15 in /tools (#565)
- tools(deps): bump vercel from 28.16.15 to 28.17.0 in /tools (#590)
- tools(deps): bump vercel from 28.16.2 to 28.16.4 in /tools (#500)
- tools(deps): bump vercel from 28.16.4 to 28.16.5
- tools(deps): bump vercel from 28.16.5 to 28.16.6
- tools(deps): bump vercel from 28.16.6 to 28.16.7 in /tools (#508)
- tools(deps): bump vercel from 28.16.7 to 28.16.10 in /tools (#536)

## Miscellaneous

- fix #576: dev: tools: add graphite
- ci/cd: add cache invalidation workflow
- ci/cd: dependabot: remove experiment
- ci/cd: dependabot: remove dry-run
- ci/cd: dependabot: refactor deps workflow
- ci/cd: dependabot: change schedule.time for all jobs
- ci/cd: dependabot: last chance to use the approach with dependabot cli
- ci/cd: dependabot: use dependabot cli instead of action
- ci/cd: dependabot: experiment with actions
- docs(changelog): v0.2.0 pre-release notes
- chore: update package-lock

## Active contributors

Special thanks to the following contributors for their contributions to this release:
- @kamilsk, Lead
- @al-petrushin
- @DimovyM
- @Tatiana683, QA

## Full changelog

Compare view [v0.1.1...v0.2.0](https://github.com/tact-app/web/compare/v0.1.1...v0.2.0).

---

# Release notes, v0.1.1

## Improvements

- [TACT-99](https://linear.app/octolab/issue/TACT-99/support-dnd-on-random-place-of-a-task-change-cursor-to-pointer-for): Support d'n'd on random place of a task, change cursor to pointer for task list (#471)

## Dependencies

### Production

- feat(deps): bump allotment from 1.18.0 to 1.18.1 (#462)
- feat(deps): bump @sentry/nextjs from 7.37.1 to 7.37.2 (#468)
- feat(deps): bump @chakra-ui/system from 2.4.0 to 2.5.0 (#469)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.47 to 3.0.0-beta.48 (#472)
- feat(deps): bump @chakra-ui/react from 2.4.9 to 2.5.1 (#474)
- feat(deps): bump framer-motion from 9.0.2 to 9.0.3 (#475)

### Development

- tools(deps): bump vercel from 28.15.3 to 28.15.5 in /tools (#473)
- tools(deps): bump vercel from 28.15.5 to 28.15.6 in /tools (#476)

## Miscellaneous

- docs: changelog: extend v0.1.0 by hidden parts
- chore(org): update license layout

## Active contributors

Special thanks to the following contributors for their contributions to this release:
- @kamilsk, Lead
- @al-petrushin
- @Tatiana683, QA

## Full changelog

Compare view [v0.1.0...v0.1.1](https://github.com/tact-app/web/compare/v0.1.0...v0.1.1).

---

# Release notes, v0.1.0

## Improvements

- [TACT-92](https://linear.app/octolab/issue/TACT-92/simplify-the-logic-of-the-editor-while-task-switching): Simplify the logic of the editor while task switching (#423)
- [TACT-93](https://linear.app/octolab/issue/TACT-93/activate-editing-mode-by-clicking-on-wide-area): Activate editing mode by clicking on wide area (#360)
- [TACT-99](https://linear.app/octolab/issue/TACT-99/support-dnd-on-random-place-of-a-task-change-cursor-to-pointer-for): Support d'n'd on random place of a task, change cursor to pointer for task list (#384)
- [TACT-100](https://linear.app/octolab/issue/TACT-100/rework-touch-and-click-experience): Rework touch and click experience (#384)
- [TACT-104](https://linear.app/octolab/issue/TACT-104/bad-experience-with-esc-and-task-editing): Bad experience with Esc and task editing (#450)
- [TACT-170](https://linear.app/octolab/issue/TACT-170/add-crosses-to-tags): Add crosses to tags (#369, #401)
- [TACT-203](https://linear.app/octolab/issue/TACT-203/bad-editor-unfocusing-experience): Bad editor unfocusing experience (#360)
- [TACT-210](https://linear.app/octolab/issue/TACT-210/implement-new-space-and-origin-creation-on-client-side): Implement new space and origin creation on client side (#402, #464)
- [TACT-241](https://linear.app/octolab/issue/TACT-241/strange-appearance-of-the-target-binding-window): Strange appearance of the target binding window (#466)
- [TACT-255](https://linear.app/octolab/issue/TACT-255/fix-dependency-tree): Fix dependency tree (#409)

## Fixes

- [TACT-118](https://linear.app/octolab/issue/TACT-118/exclude-all-spaces-from-the-suggestion): Exclude All spaces from the suggestion (#449, #463)
- [TACT-212](https://linear.app/octolab/issue/TACT-212/drop-menu-hides-behind-task-list): Drop menu hides behind task list (#369)
- [TACT-233](https://linear.app/octolab/issue/TACT-233/when-scaling-the-window-the-page-collapses-completely): When scaling the window, the page collapses completely (#379, #383)
- [TACT-242](https://linear.app/octolab/issue/TACT-242/floating-tag-and-focus-on-hidden-delete-button-x): Floating tag and focus on hidden delete button (#447)
- [TACT-257](https://linear.app/octolab/issue/TACT-257/window-overlay-in-today-tab): Window Overlay in Today Tab (#454, #465)

## Dependencies

### Production

- feat(deps): bump @fortawesome/fontawesome-pro from 6.2.1 to 6.3.0 (#404)
- feat(deps): bump @sentry/nextjs from 7.34.0 to 7.35.0
- feat(deps): bump @sentry/nextjs from 7.35.0 to 7.36.0
- feat(deps): bump @sentry/nextjs from 7.36.0 to 7.37.1 (#448)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.41 to 3.0.0-beta.42 (#374)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.41 to 3.0.0-beta.43 (#380)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.43 to 3.0.0-beta.44 (#387)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.44 to 3.0.0-beta.45 (#389)
- feat(deps): bump @tanstack/react-virtual from 3.0.0-beta.45 to 3.0.0-beta.47 (#452)
- feat(deps): bump @tiptap/core from 2.0.0-beta.209 to 2.0.0-beta.212
- feat(deps): bump @tiptap/core from 2.0.0-beta.212 to 2.0.0-beta.216 (#429)
- feat(deps): bump @tiptap/core from 2.0.0-beta.216 to 2.0.0-beta.217 (#438)
- feat(deps): bump @tiptap/extension-highlight from 2.0.0-beta.209 to 2.0.0-beta.212 (#371)
- feat(deps): bump @tiptap/extension-highlight from 2.0.0-beta.212 to 2.0.0-beta.216 (#430)
- feat(deps): bump @tiptap/extension-highlight from 2.0.0-beta.216 to 2.0.0-beta.217 (#441)
- feat(deps): bump @tiptap/extension-link from 2.0.0-beta.209 to 2.0.0-beta.212
- feat(deps): bump @tiptap/extension-link from 2.0.0-beta.212 to 2.0.0-beta.217 (#435)
- feat(deps): bump @tiptap/extension-placeholder from 2.0.0-beta.209 to 2.0.0-beta.212 (#376)
- feat(deps): bump @tiptap/extension-placeholder from 2.0.0-beta.212 to 2.0.0-beta.216 (#428)
- feat(deps): bump @tiptap/extension-placeholder from 2.0.0-beta.216 to 2.0.0-beta.217 (#445)
- feat(deps): bump @tiptap/extension-task-item from 2.0.0-beta.209 to 2.0.0-beta.212 (#375)
- feat(deps): bump @tiptap/extension-task-item from 2.0.0-beta.212 to 2.0.0-beta.216 (#426)
- feat(deps): bump @tiptap/extension-task-item from 2.0.0-beta.216 to 2.0.0-beta.217 (#437)
- feat(deps): bump @tiptap/extension-task-list from 2.0.0-beta.209 to 2.0.0-beta.212 (#373)
- feat(deps): bump @tiptap/extension-task-list from 2.0.0-beta.212 to 2.0.0-beta.216 (#432)
- feat(deps): bump @tiptap/extension-task-list from 2.0.0-beta.216 to 2.0.0-beta.217 (#446)
- feat(deps): bump @tiptap/extension-underline from 2.0.0-beta.209 to 2.0.0-beta.212 (#377)
- feat(deps): bump @tiptap/extension-underline from 2.0.0-beta.212 to 2.0.0-beta.216 (#434)
- feat(deps): bump @tiptap/extension-underline from 2.0.0-beta.216 to 2.0.0-beta.217 (#442)
- feat(deps): bump @tiptap/react from 2.0.0-beta.209 to 2.0.0-beta.212
- feat(deps): bump @tiptap/react from 2.0.0-beta.212 to 2.0.0-beta.216 (#431)
- feat(deps): bump @tiptap/react from 2.0.0-beta.216 to 2.0.0-beta.217 (#443)
- feat(deps): bump @tiptap/starter-kit from 2.0.0-beta.209 to 2.0.0-beta.212
- feat(deps): bump @tiptap/starter-kit from 2.0.0-beta.212 to 2.0.0-beta.216 (#427)
- feat(deps): bump @tiptap/starter-kit from 2.0.0-beta.216 to 2.0.0-beta.217 (#439)
- feat(deps): bump @tiptap/suggestion from 2.0.0-beta.209 to 2.0.0-beta.212 (#372)
- feat(deps): bump @tiptap/suggestion from 2.0.0-beta.212 to 2.0.0-beta.216 (#433)
- feat(deps): bump @tiptap/suggestion from 2.0.0-beta.216 to 2.0.0-beta.217 (#440)
- feat(deps): bump allotment from 1.17.1 to 1.18.0 (#370)
- feat(deps): bump framer-motion from 8.5.5 to 9.0.0
- feat(deps): bump framer-motion from 9.0.0 to 9.0.1 (#378)
- feat(deps): bump framer-motion from 9.0.1 to 9.0.2 (#396)
- feat(deps): bump mobx from 6.7.0 to 6.8.0 (#444)
- feat(deps): bump react-hotkeys-hook from 4.3.4 to 4.3.5 (#385)

### Development

- chore(deps-dev): bump @types/node from 18.11.18 to 18.11.19 (#381)
- chore(deps-dev): bump @types/node from 18.11.19 to 18.13.0 (#395)
- chore(deps-dev): bump @types/react from 18.0.27 to 18.0.28 (#453)
- chore(deps-dev): bump eslint from 8.33.0 to 8.34.0 (#451)
- chore(deps-dev): bump prettier from 2.8.3 to 2.8.4 (#406)
- tools(deps): bump vercel from 28.14.1 to 28.15.0
- tools(deps): bump vercel from 28.15.0 to 28.15.1 in /tools (#386)
- tools(deps): bump vercel from 28.15.1 to 28.15.2 in /tools (#405)
- tools(deps): bump vercel from 28.15.2 to 28.15.3 in /tools (#425)

## Miscellaneous

- dev: allow to skip token setup (#363)
- ci/cd: dependabot: increase open-pull-requests-limit

## Active contributors

Special thanks to the following contributors for their contributions to this release:
- @kamilsk, Lead
- @al-petrushin
- @DimovyM
- @Tatiana683, QA

## Full changelog

Compare view [v0.0.10...v0.1.0](https://github.com/tact-app/web/compare/v0.0.10...v0.1.0).
