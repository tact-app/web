#!/usr/bin/env sh

# TODO:refactor extend $PATH by tools

if [ $# -eq 0 ]; then
  /bin/sh
  exit $?
fi

"${@}"
