# Stage 1: Fetch raw hero data and images using HeroesDataParser
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS data-fetcher

ENV PATH="${PATH}:/root/.dotnet/tools"

WORKDIR /data
RUN dotnet tool install --global HeroesDataParser && \
    dotnet heroes-data-parser online -e hero:i -g 4 -o hdp

# Stage 2: Transform data (JSON + AVIF images) and build the Vite SPA
FROM node:26-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
COPY --from=data-fetcher /data/hdp ./hdp

RUN npm run transform-data && npm run build

# Stage 3: Serve static output with Caddy (configured for Railway)
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

