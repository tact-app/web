# syntax=docker/dockerfile:latest

FROM node:18-alpine AS build

ARG token
ENV FONTAWESOME_TOKEN=${token}

WORKDIR /app

COPY . .
RUN npm ci --ignore-scripts --include=dev && TARGET=standalone npm run build


FROM node:18-alpine AS prod
LABEL author="Tact team <team@tact.run>"
LABEL org.opencontainers.image.source="https://github.com/tact-app/web"
LABEL org.opencontainers.image.description="Web version for desktops."
LABEL org.opencontainers.image.licenses="AGPL-3.0-later"

WORKDIR /app

COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
