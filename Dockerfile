FROM node:buster-slim

RUN mkdir -p /usr/src/node-app-demand && chown -R node:node /usr/src/node-app-demand

WORKDIR /usr/src/node-app-demand

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
