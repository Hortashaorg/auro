#!/bin/sh
set -e

# Run database seed
echo "Running database seed..."
deno task db:seed

# Run database migrations
echo "Running database migrations..."
deno task db:migrate

# Start the application
echo "Starting application..."
exec "$@"
