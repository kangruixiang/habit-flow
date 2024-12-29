# Builder
FROM oven/bun:latest AS builder 
WORKDIR /app
COPY package.json bun.lockb ./ 
RUN bun install

# Environmental variables
ENV DATABASE_URL=file:db/local.db

COPY . .
RUN bun db:push
RUN bun run build
# Generate migration files
RUN bun run drizzle-kit generate

# Runner
FROM oven/bun:1.1.42 AS runner
WORKDIR /app

# Environmental variables
# ENV DATABASE_URL = file:db/local.db
ENV PORT=80

# Copies the build folder
COPY --from=builder /app/build .
COPY --from=builder /app/run.sh run.sh
COPY --from=builder /app/drizzle.config.ts drizzle.config.ts
COPY --from=builder /app/drizzle drizzle

# Copies the local database
COPY --from=builder /app/db /app/db_init

EXPOSE 80

CMD ["sh", "run.sh"] 