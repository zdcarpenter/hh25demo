This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment and Auth setup

Copy `.env.example` to `.env` and fill in values. At minimum set:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
MONGODB_URI=mongodb+srv://...
STRIPE_SECRET_KEY=sk_test_...
```

If you see a Mongo SSL/TLS error during login/registration (e.g. `tlsv1 alert internal error`):

- Ensure your `MONGODB_URI` is valid and reachable from your machine.
- If using AWS DocumentDB or a cluster requiring a custom CA, download the CA bundle and set `MONGODB_CA_FILE=/absolute/path/to/ca.pem`.
- As a last resort for local dev only, you can disable certificate validation by setting `MONGODB_TLS_INSECURE=true`.

These options are read in `src/lib/mongodb.js` when creating the Mongo client.
