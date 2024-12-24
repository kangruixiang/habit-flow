FROM oven/bun:latest AS builder 
WORKDIR /app
COPY package.json ./ 
RUN bun install

COPY . .
RUN bun run db:push
RUN bun run build

RUN rm -rf src/ static/ emailTemplates/ docker-compose.yml

FROM oven/bun

COPY --from=builder /app/build .
ENV PORT=80
EXPOSE 80
ENTRYPOINT ["bun", "run", "start"]