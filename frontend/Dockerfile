FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* /app/
RUN npm ci
COPY . /app
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist /app/dist
RUN npm i -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
