# Pledge to Vote 2026

> **Status: Archived (September 2026).** The site is no longer online and this repository is no longer maintained. It's kept public as a record of where I started.

A full-stack web app where people could make a symbolic pledge to vote in the 2026 U.S. Midterm Elections, see a running national total, and watch a U.S. heatmap fill in by state. It ran at `pledgetovote2026.com` from September 2025 to September 2026.

![Pledge to Vote 2026 social card](./public/social-share-card.png)

## Why this repo is archived

This was my **very first project** in my self-taught journey into software development: the first thing I built end to end and shipped to a real domain. I built it with a lot of help from AI tools, at a point when I could get features working but didn't yet know how to judge the code those tools gave me.

My focus has since shifted to **backend engineering and DevOps**, and looking back at this code there's a lot I would do differently. Rather than quietly delete it, I'm leaving it up with an honest write-up of what I'd change and why. The [What I'd do differently](#what-id-do-differently) section below is the most useful part of this README.

## What it did

- **Pledge form:** Pick a state, enter a ZIP code, and the browser checks that the two match (via the Zippopotam.us API) before letting you submit.
- **National counter and goal thermometer:** A running total of pledges against a goal that scaled up (500 → 5,000 → 50,000 → 1,000,000).
- **U.S. heatmap:** States shaded by pledge count, with a hover tooltip (`react-simple-maps` + `d3-scale`).
- **Countdown timer** to Election Day, November 3, 2026.
- **Personalized share image:** After pledging, the server generated an "I PLEDGED TO VOTE in Illinois!" image with `sharp`.
- **Online-user counter:** A Socket.io connection count showing how many people had the page open.
- **Social cards** (Open Graph / Twitter meta tags) and a mobile-responsive layout.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 18, Vite, React Router, `react-simple-maps`, `d3-scale`, `socket.io-client` |
| Backend | Node.js, Express 5, Mongoose, `sharp`, Socket.io, `node-cron` |
| Database | MongoDB Atlas |
| Hosting | Render (static site for the frontend, web service for the API), domain via Namecheap |

## A note on the pledge numbers

Most of the pledges this site displayed were **not real**. When it was shut down, the database held 1,113 pledges:

| Source | Count |
|---|---|
| A daily job in `server/server.js` that inserted 1–5 random pledges every night | 1,003 |
| A one-time seed script (`server/seed.js`) | 50 |
| Submitted one at a time through the form (including my own testing while building it) | 60 |

The privacy policy disclosed that the count "may include simulated or test data," but the counter on the home page didn't. I wouldn't do that again. On a civic site especially, the number people see should be real, or clearly labeled as demo data.

## What I'd do differently

Now that I'm focused on the backend, these are the changes I'd make, most important first:

1. **Validate on the server, not just in the browser.** The only state/ZIP check ran in the React form. `POST /api/pledges` accepted any `state` and `zipCode` strings from anyone, so a single `curl` loop could inflate the count or fill up the database. I'd validate the request body with a schema (for example `zod`), restrict `state` to a fixed list, and do the ZIP-to-state check on the server.
2. **Add basic abuse protection.** Rate limiting on the write endpoint (`express-rate-limit`), a CORS allowlist instead of `origin: "*"`, security headers via `helmet`, and a cap on socket connections so the "online" count couldn't be inflated.
3. **Use PostgreSQL.** The data is one small, well-structured table. Postgres would let the database enforce the rules itself (`CHECK` constraints on state and ZIP format, `NOT NULL`, an index on `state`), and "pledges by state" is a plain `GROUP BY`.
4. **Keep development and production separate.** My local `.env` pointed at the production database. Running `npm run seed:reset` on my laptop would have deleted every production pledge, and starting the server locally ran a second copy of the daily job against prod. I'd use a local or dev database, and seed scripts that refuse to run against production.
5. **Move scheduled work out of the web server.** The nightly job ran inside the API process via `node-cron`, so it would have run twice with two instances, and it ran every time I started the server locally. That kind of work belongs in a separate scheduled job (for example, a Render Cron Job). This one shouldn't have existed at all; see the note above.
6. **Keep one source of truth.** The Mongoose schema was defined in three files and the list of states in five, and they had already drifted apart. Washington, D.C. was selectable in the form but missing from the server's list, so a D.C. pledger's share image said "I pledged to vote… in this election!" I'd use one shared module, or let the database be the source of truth.
7. **Cache expensive work.** Every request to the share-image endpoint re-rendered a 1.2 MB PNG with `sharp`, which made it an easy way to max out the server's CPU. There are only 51 possible images, so I'd generate them once at build time and serve them as static files.
8. **Tests and CI from day one.** There were no tests (`"test": "echo \"Error: no test specified\""`) and no CI. I'd add API tests with `supertest`, run lint, tests and `npm audit` in GitHub Actions on every push, and turn on Dependabot. When this was archived, `npm audit` reported 11 high-severity issues across the two `package.json` files, mostly the `ws` package that Socket.io depends on.
9. **Get the operational basics right.** Read the port from `process.env.PORT` instead of hard-coding `5002`, add a `/health` endpoint and point Render's health check at it, stop the process when the database connection fails instead of serving errors, and use explicit timezones for dates (the Election Day cutoff was parsed in whatever timezone the server or browser happened to be in).
10. **Read AI-generated code before committing it.** `server/server.js` still contains the comment `// NOTE: I've collapsed these for brevity, your actual code is still here.` That's an AI assistant talking to me, committed straight to production. Using AI tools is fine; shipping their output without reading it closely is how most of the issues above got in.

## Running it locally (for reference)

The code is kept as it was when the project was archived; none of the issues above have been fixed.

```bash
# Frontend (from the repo root)
npm install
npm run dev

# Backend
cd server
npm install
echo "MONGO_URI=<your own dev database connection string>" > .env
npm run dev
```

Use your own development database. Don't run the seed scripts against a database you care about.
