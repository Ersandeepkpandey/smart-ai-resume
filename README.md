# Rezume

Resume builder with ATS scoring for job applications.

## Quick Start

```bash
npm install
cp env.template .env.local
npm run dev
```

Open http://localhost:3000

## Environment Variables

See `env.template` for configuration options. The app works without any configuration using in-memory SQLite.

For production, set up:
- Turso database (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
- SendGrid for emails (SENDGRID_API_KEY, SENDGRID_FROM_EMAIL)

## Development

```bash
npm run dev          # start dev server
npm run build        # production build
npm test             # run tests
npm run lint         # check code style
```

## Project Layout

```
src/
  app/          routes and api
  components/   ui components
  contexts/     react context providers
  lib/          database, auth, utilities
  __tests__/    test files
```

## Deployment

Deploy to Vercel, Netlify, or any platform supporting Next.js. Configure environment variables in your hosting dashboard.

## License

MIT
