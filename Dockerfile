FROM oven/bun:latest

WORKDIR /app

COPY bun.lock package.json .

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

CMD ["bun", "start"]
