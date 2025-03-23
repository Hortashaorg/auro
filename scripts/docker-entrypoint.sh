#!/bin/sh
set -e

# Run database migrations
echo "Running database migrations..."
deno task db:migrate

# Start the application
echo "Starting application..."
exec "$@" 