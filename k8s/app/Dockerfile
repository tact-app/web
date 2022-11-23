FROM node:16-alpine AS build

ARG token
ENV FONTAWESOME_NPM_AUTH_TOKEN=${token}

WORKDIR /app

COPY .. .
RUN npm ci --ignore-scripts --include=dev && npm run build


FROM node:16-alpine AS prod
LABEL author="Tact team <tact@octolab.net>"

WORKDIR /app

COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
