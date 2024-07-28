# Sepia Store

## Installation

### Install dependencies

```
pnpm install
```

### Configure the projects

Remember to copy and fill the templates with the OPENAI token (in both projects):

#### Backend

```
cp apps/backend/.env.template apps/backend/.env
```

#### Frontend

```
cp apps/frontend/.env.template apps/frontend/.env.local
```

### Run docker services

```
docker compose up -d
```

### Create database

```
docker compose exec -ti pgsql createdb -U postgres medusa-9ugN
```

### Load example database

```
pnpm run --filter medusa-plugin-sepia build
pnpm run --filter backend seed
```

## Run applications

### Front and back

```
pnpm run dev
```

### Open sites

- Frontend: http://localhost:3000/
- Backend: http://localhost:7001/
  - Username: `admin@example.com`
  - Password: `admin`
