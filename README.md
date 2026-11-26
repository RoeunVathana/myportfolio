# Noah Portfolio

A bold, editorial portfolio starter built with Next.js and a small NestJS API.

## Run locally

```bash
npm install
npm run dev
```

- Frontend: http://localhost:3000
- API health check: http://localhost:4000/api/contact/health

The contact form posts to `POST /api/contact`. Contact messages are stored in PostgreSQL table `contact_messages` inside database `myportfolio`. Database values live in `.env.local`, which is ignored by Git. Copy `.env.example` when setting up another machine. Set `NEXT_PUBLIC_API_URL` if the API is hosted somewhere other than `http://localhost:4000`.
