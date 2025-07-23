FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

# Installa Node.js 20.x + librerie richieste
RUN apt-get update && \
    apt-get install -y curl ca-certificates gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs libtbbmalloc2 libtbb12 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "."]