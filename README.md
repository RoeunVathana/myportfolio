# Noah Portfolio

A bold, editorial portfolio starter built with Next.js and a small NestJS API.

## Run locally

```bash
npm install
npm run dev
```

- Frontend: http://localhost:3000
- API health check: http://localhost:4000/api/contact/health

The contact form posts to `POST /api/contact`. Contact messages are stored in PostgreSQL table `contact_messages` inside database `myportfolio` during local development. The hosted Site uses its remote API bridge at `https://noah-portfolio-api.vivaciousdandelion4.chatgpt.site`. Database values live in `.env.local`, which is ignored by Git. Copy `.env.example` when setting up another machine. Set `NEXT_PUBLIC_API_URL` to override the API URL.
