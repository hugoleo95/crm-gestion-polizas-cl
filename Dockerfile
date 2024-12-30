FROM node:14-alpine3.16
# create destination directory
RUN mkdir -p ./usr/src/nuxt-app
WORKDIR ./usr/src/nuxt-app
# update and install dependency
RUN apk update && apk upgrade
RUN apk add git
# copy the app, note .dockerignore
COPY . .
RUN npm install
# Declarar el argumento
ARG HOST
ARG NUXT_ENV_API_URL
ARG NUXT_ENV_LEAD_SOCKET_URL
ARG VERSION
# Build the app
RUN npm run build
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=8000
EXPOSE 8000
CMD [ "npm", "start" ]