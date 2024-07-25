# Sepia Store

## Installation

### Run docker services

```
docker compose up -d
```

### Create database

```
docker compose exec -ti pgsql createdb -U postgres medusa-9ugN
```

### Run migrations

```
pnpm run --filter backend migrations
```

### Load example database

```
pnpm run --filter backend seed
```

## Run applications

### Front and back

```
pnpm run dev
```

### Open sites

* Frontend: http://localhost:3000/
* Backend: http://localhost:7001/
    * Username: `admin@medusa-test.com`
    * Password: `supersecret`
