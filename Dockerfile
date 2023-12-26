# Multistage build - Builder stage
FROM node:20.10-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Production stage
FROM node:20.10-alpine
RUN apk add --no-cache --virtual .gyp python make g++

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod
RUN apk del .gyp

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
