#!/usr/bin/env bash
# shellcheck source=../core/git.bash # @root

# Example: run tools install
# Example: run tools npm i vercel@latest
# Example: run tools npm ci
tools() {
  pushd "$(@root)/tools" >/dev/null || exit 1
  trap 'popd >/dev/null' ERR
  "${@}"
  popd >/dev/null || exit 1
}
