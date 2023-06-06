#!/usr/bin/env bash
# shellcheck source=../core/git.bash # @pull
# shellcheck source=deps.bash        # @deps
# shellcheck source=build.bash       # build

refresh() {
  @pull

  @deps install
  @deps docs
  @deps tools

  build
}
