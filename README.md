[![Build Status](https://travis-ci.org/fedeizzo/EPOC.svg?branch=master)](https://travis-ci.org/fedeizzo/EPOC)
<p align="center">
  <img width="460" src="https://i.imgur.com/aQEokxI.png">
</p>
# EPOC
## Table of contents
<!--ts-->
   * [Initialize](#initialize)
   * [Run](#run)
       * [Develop](#develop)
       * [Production](#production)
       * [Tips](#tips)
   * [Helpful commands](#helpful-commands)
       * [Foal](#foal)
<!--te-->
## Initialize
Development setup:
```bash=
npm i && npm i -D
npm i -g @foal/cli
docker-compose -f docker-compose.dev.yaml build
```

Production setup:
```bash=
docker build -f Dockerfile.production -t epoc/epoc:latest .
```

## Run
You can run _EPOC_ either in development or production mode, refer to the sections below for the one you want. If you want to run this project on your machine follow develop section below.

### Develop
In order to run _EPOC_ in development mode some steps are required:

1. set _SETTINGS_JWT_SECRET_OR_PUBLIC_KEY_ inside .env file
2. run `docker-compose -f docker-compose.dev.yaml -d up`
3. run `npm run develop`

### Production
In order to run _EPOC_ in production mode some steps are required:

1. set _SETTINGS_JWT_SECRET_OR_PUBLIC_KEY_ inside .env file
2. set _MONGODB_URI_ inside .env file
3. run `docker run --name epoc -d --rm epoc:latest`

### Tips
* There is a .env.sample for easy setup. Inside it is written the command that can be used in order to generate _SETTINGS_JWT_SECRET_OR_PUBLIC_KEY_

## Helpful commands

### Foal

```bash=
foal generate controller
```

```bash=
foal generate model
```

```bash=
foal generate hook
```

```bash=
foal generate service
```
