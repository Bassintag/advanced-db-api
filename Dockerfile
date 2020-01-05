FROM node:12-alpine AS builder

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++

COPY package*.json ./

RUN npm install

RUN apk del .gyp

COPY ./src/ ./src
COPY webpack.config.js .
COPY tsconfig.json .

RUN npm run build

FROM node:12-alpine

WORKDIR /var/www
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/index.js"]
