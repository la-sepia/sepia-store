# Sepia Store

## Demo

### Check order 

The bot can help you to see the status of a previous order. You need to specify the order id and the email. For the demo web you can use the email `john@example.com` and the orders 1, 2 or 3.

<div align="center">
  
https://github.com/user-attachments/assets/a1859b72-076a-4f12-9a52-1f4823e16d05

</div>


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
