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
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --prod

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
