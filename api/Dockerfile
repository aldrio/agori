# API Dockerfile
# Defines base, prod, and dev images
# Base contains common dependencies for prod and dev
# 
# (Depends on context of entire repo, not just the API directory)
# 
# Target prod or dev with docker --target option

# Base image
FROM node:12 AS base


# Install native dependencies
RUN apt-get update && apt-get install -y \
    netcat \
    libvips-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/agori

# Scripts
COPY scripts scripts
RUN chmod +x scripts/*

# Install local packages
COPY avatars avatars
WORKDIR /usr/agori/avatars
RUN yarn install && yarn build

# Install API
WORKDIR /usr/agori/api
COPY ./api/package.json ./api/yarn.lock ./ 
RUN yarn install

USER node


# Prod image
FROM base AS prod

COPY api .

EXPOSE 8080

ENTRYPOINT [ "yarn" ]
CMD [ "start" ]


# Dev image
FROM base AS dev

COPY ./api/*.json ./api/*.ts ./api/*.js ./
VOLUME /usr/agori/api/src
EXPOSE 8080

ENTRYPOINT [ "/usr/agori/scripts/wait-for.sh", "db:5432", "--", "yarn" ]
CMD [ "dev" ]
