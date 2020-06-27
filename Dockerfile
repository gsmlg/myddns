FROM node:alpine

LABEL maintainer="GSMLG < me@gsmlg.org >"

ENV CF_KEY=cloudflare-api-key \
 CF_EMAIL=cloudflare-email \
 ROUTER_ADDR=192.168.1.1 \
 ROUTER_PASSWD=admin \
 DAEMON=false \
 ZONE=gsmlg.org \
 DDNS_NAME=ddns.gsmlg.org

COPY index.js package.json .

RUN npm install

ENTRYPOINT ["node", "index.js"]

