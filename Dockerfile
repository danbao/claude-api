FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN yarn
COPY . ./
RUN yarn run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./dist/node_modules


EXPOSE 8080

CMD ["node", "dist/main.js"]
