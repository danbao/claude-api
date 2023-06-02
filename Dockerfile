FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN yarn

RUN yarn run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist


EXPOSE 8080

CMD ["node", "dist/main.js"]
