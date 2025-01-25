FROM debian:12.7-slim AS base

WORKDIR /app

# Apt Update + curl + unzip
RUN apt-get update && \
    rm -rf /var/lib/apt/lists/*

# Install Deno
COPY --from=denoland/deno:bin-2.1.7 /deno /usr/local/bin/deno

FROM base AS local

# Install git
RUN apt-get update && \
    apt-get install -y git curl && \
    rm -rf /var/lib/apt/lists/*