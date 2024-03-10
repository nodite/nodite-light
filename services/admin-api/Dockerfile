####################
# base
FROM node:20-alpine AS base

ENV PYTHONUNBUFFERED=1
RUN apk update && \
  apk add --update --no-cache libc6-compat bash git make g++ python3 py3-pip python3-dev && \
  ln -sf python3 /usr/bin/python

ENV ROOT_DIR services/admin-api
ENV LIBS_DIR packages

ENV APP_HOME /app
WORKDIR ${APP_HOME}

COPY ["package.json", "package-lock.json", "tsconfig.json", "lerna.json", "./"]
COPY ${ROOT_DIR}/package.json ./${ROOT_DIR}/package.json
COPY ${LIBS_DIR}/ ./${LIBS_DIR}

####################
# builder.
FROM base as builder

RUN npm ci

COPY ${ROOT_DIR}/ ./${ROOT_DIR}

RUN npm run build

####################
# server.
FROM base AS server

RUN npm ci --omit=dev --ignore-scripts && \
  npm rebuild bcrypt

COPY --from=builder ${APP_HOME}/${ROOT_DIR}/dist ./
COPY --from=builder ${APP_HOME}/${LIBS_DIR}/ ./${LIBS_DIR}

EXPOSE 8080

# Run the server in production mode
ENV NODE_ENV production
CMD ["node", "server.js"]
