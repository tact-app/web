#!/usr/bin/env bash

# Example: run docs install
docs() {
  pushd docs >/dev/null || exit 1
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
