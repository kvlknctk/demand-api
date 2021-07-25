FROM node:buster-slim

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json yarn.lock ./

USER node

ENTRYPOINT ["/bin/sh", "yarn install --pure-lockfile"]

COPY --chown=node:node . .

EXPOSE 3000
