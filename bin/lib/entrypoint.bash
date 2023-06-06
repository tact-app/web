#!/usr/bin/env bash

export PATH="/app/tools/node_modules/.bin:${PATH}"

if [ $# -eq 0 ]; then
  /bin/bash
  exit $?
fi

"${@}"
