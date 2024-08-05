# Sepia Store

## What is Sepia?

Sepia is a plugin for MedusaJS, an open-source e-commerce framework that provides a flexible and scalable backend for building online stores. Sepia integrates with the Vercel AI SDK to add a chatbot to the MedusaJS Next.js store. This chatbot can assist with personal shopping, find order statuses, and display cart information. While Sepia is just a proof of concept (PoC), it showcases the potential of using the Vercel AI SDK to create innovative products with open-source e-commerce solutions for various businesses.

Sepia leverages the following features from the Vercel AI SDK:

*	From the AI SDK Core: Generating text, tool callings, embeddings generation
* From the AI SDK SRC: Streaming React components

The bot dynamically creates an embedding database from the products in the MedusaJS store, allowing it to recommend the right products based on client requirements using RAG. Additionally, it uses the MedusaJS API to check the status of the cart and orders. Although it’s a PoC, Sepia demonstrates the numerous possibilities that can be explored with these technologies.

## Demo

### Shopping assistant

The bot can help you to find the right product, color and size. Just ask for it!

Click in the next image to see a demo:

<div align="center">

[![Shopping assistant](https://img.youtube.com/vi/LFEo_UOD3dg/0.jpg)](https://www.youtube.com/watch?v=LFEo_UOD3dg)

</div>

### Cart status

The bot can show you the cart status.

Click in the next image to see a demo:

<div align="center">

[![Cart status](https://img.youtube.com/vi/-ntKVHR39H8/0.jpg)](https://www.youtube.com/watch?v=-ntKVHR39H8)

</div>


### Check order 

The bot can help you to see the status of a previous order. You need to specify the order id and the email. For the demo web you can use the email `john@example.com` and the orders 1, 2 or 3. 

Click in the next image to see a demo:

<div align="center">

[![Check an order status](https://img.youtube.com/vi/Cg9DeOO7rPk/0.jpg)](https://www.youtube.com/watch?v=Cg9DeOO7rPk)

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


## Who we are

* [Adrián López](https://github.com/AdrianLopezGue)
* [Antonio Moruno](https://github.com/moruno21)
* [Guillermo Cosano](https://github.com/guillecg98)
* [Javier de Santiago](https://github.com/jdes01)
* [Sergio Gómez](https://github.com/sgomez)
* [Victor Monserrat](https://github.com/victormonserrat/)
