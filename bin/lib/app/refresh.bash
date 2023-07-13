#!/usr/bin/env bash
# shellcheck source=build.bash       # build
# shellcheck source=deps.bash        # @deps
# shellcheck source=../git/core.bash # @pull

refresh() {
  @pull

  @deps install
  @deps docs
  @deps tools

  build
}
