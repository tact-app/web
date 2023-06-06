#!/usr/bin/env bash
# shellcheck source=../core/git.bash # @pull
# shellcheck source=deps.bash        # @deps

refresh() {
  @pull

  @deps install
#  @deps docs
#  @deps tools

  #  build --from-scratch
}
