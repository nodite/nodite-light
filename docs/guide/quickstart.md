# Quickstart

## Preparation

- git
- Node.js (>=18)
- docker
- docker-compose

```shell
# Clone project
git clone https://github.com/nodite/nodite-light.git

# Entry project
cd nodite-light
```

## By docker

```shell
docker-compose -f deployment/docker/docker-compose.mysql.yml up -d
```

## By Host

1. Install dependencies

```shell
# Install dependencies
npm i

# If npm is slow, please npmmirror
npm i --registry=https://registry.npmmirror.com
```

2. Start databases

```shell
docker-compose up -d
```

2. Start admin-api

```shell
cp services/admin-api/.env.template services/admin-api/.env
npm run start:admin-api
```

Swagger docs: http://localhost:8080/admin-api/api-docs/

3. Start admin-web

```shell
npm run start:admin-web
```

## Access locally

Admin: http://localhost:4399/admin <br>
Username: admin <br>
Password: admin
