FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN yarn
COPY . ./
RUN yarn run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/index.js"]
