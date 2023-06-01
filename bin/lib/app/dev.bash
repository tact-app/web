#!/usr/bin/env bash

dev() { @node -p 3000:3000 -- npm run dev; }

# TODO:refactor see node.bash
isolated() {
  docker run --rm -it \
    --env-file .env \
    -v "$(pwd)":/app \
    -w /app \
    --entrypoint=/bin/bash \
    node:18
}

npm() { @node npm "${@}"; }
