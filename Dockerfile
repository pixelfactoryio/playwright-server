FROM node:lts as builder

WORKDIR /build
COPY package.json yarn.lock /build/
RUN yarn install
COPY . .
RUN yarn build

FROM mcr.microsoft.com/playwright:v1.22.2

ENV TINI_VERSION v0.19.0
ENV GOSU_VERSION 1.12

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /usr/local/bin/tini
RUN chmod +x /usr/local/bin/tini

ADD https://github.com/tianon/gosu/releases/download/${GOSU_VERSION}/gosu-amd64 /usr/local/bin/gosu
RUN chmod +x /usr/local/bin/gosu

WORKDIR /usr/local/app
COPY package.json yarn.lock /usr/local/app/
RUN yarn install --production
COPY --from=builder /build/dist /usr/local/app/dist

ENTRYPOINT ["/usr/local/bin/tini", "-g", "--"]

EXPOSE 3000

CMD ["gosu", "pwuser", "node", "dist/index.js"]
