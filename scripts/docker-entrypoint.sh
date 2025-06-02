#!/bin/sh
set -e

# Run database migrations
echo "Running database migrations..."
deno task db:migrate

# Run database seed
echo "Running database seed..."
deno task db:seed

# Start the application
echo "Starting application..."
exec "$@"
