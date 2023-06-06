#!/usr/bin/env bash
# shellcheck source=../core/git.bash # @root

_os=$(uname -s | tr '[:upper:]' '[:lower:]')
_arch=$(uname -m | tr '[:upper:]' '[:lower:]')

# TODO:dirty hack with script name to load it before tools
path=$(@root)/tools/node_modules/.bin
if [[ ":${PATH}:" != *":${path}:"* ]]; then
  export PATH="${path}:${PATH}"
fi
