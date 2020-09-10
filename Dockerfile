FROM node:14-alpine3.11

WORKDIR /usr/src
COPY . /usr/src

RUN npm install

ENTRYPOINT ["node", "/usr/src/index.js"]
