# EPOC
## Table of contents
<!--ts-->
   * [Initialize](#initialize)
   * [Run](#run)
       * [Develop](#develop)
       * [Production](#production)
   * [Helpful commands](#helpful-commands)
       * [Migrations](#migrations)
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
docker-compose -f docker-compose.yaml build
```

## Run
You can run _EPOC_ either in development or production mode, refer to the sections below for the one you want.

### Develop
In order to run _EPOC_ in development mode:

```bash=
docker-compose -f docker-compose.dev.yaml -d up
nmp run develop
```

### Production
In order to run _EPOC_ in production mode:
```bash=
docker-compose -f docker-compose.yaml -d up
```

## Helpful commands

### Migrations

When you modify the representation of entities in the database you should generate a new migration with
```bash=
npm run migration:generate
```

The latest migrations should be automatically applied when you docker compose up. To ensure they are you can run

```bash=
npm run migration:run
```


### Foal

```bash=
foal generate controller
```

```bash=
foal generate entity
```

```bash=
foal generate hook
```

```bash=
foal generate service
```
