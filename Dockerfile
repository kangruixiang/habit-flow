FROM oven/bun:latest AS builder 
WORKDIR /app
COPY package.json ./ 
RUN bun install

COPY . .
# COPY db/local.db ./db/local.db
RUN mkdir -p db && touch db/local.db
RUN bun run db:push
RUN bun run build

FROM oven/bun

COPY --from=builder /app/build .
ENV PORT=80
EXPOSE 80
ENTRYPOINT ["bun", "run", "start"]