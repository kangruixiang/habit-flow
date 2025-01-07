#!/bin/bash

if [ ! -f /app/db/local.db ]; then
  echo "Database not found, creating database..."
  mkdir -p /app/db
  cp -r /app/db_init/* /app/db/
  echo "Database created."
fi

echo "Starting Server..."
bun run start