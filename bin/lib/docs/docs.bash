#!/usr/bin/env bash
# shellcheck source=../core/git.bash # @root

# Example: run docs install
# Example: run docs npm i nextra@latest
# Example: run docs npm ci
docs() {
  pushd "$(@root)/docs" >/dev/null || exit 1
  trap 'popd >/dev/null' ERR
  "${@}"
  popd >/dev/null || exit 1
}

#npx --no-install next dev # dev
#
#npx --no-install next build # build
#
#npx --no-install next start # start
#
#rm -rf dist/
#TARGET=static npx --no-install next build # publish
