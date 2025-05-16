# Typing Speed Game

A web-based typing speed game built with Next.js, Prisma ORM, and PostgreSQL. This project tracks user scores including accuracy and words per minute (WPM), with a backend powered by Prisma and a PostgreSQL database.


## Features

* Timer-based typing speed test
* Tracks score, accuracy, and WPM
* Stores and fetches sentences for typing practice
* Stores user scores with timestamps
* REST API with Next.js API routes
* Database seeding with Prisma
* TypeScript support


## Tech Stack

* **Frontend:** Next.js (React)
* **Backend:** Node.js, Next.js API routes
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Language:** TypeScript / JavaScript


## Getting Started

### Prerequisites

* Node.js (v16 or later recommended)
* PostgreSQL database
* Yarn or npm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/typing-speed-game.git
cd typing-speed-game
```

2. **Install dependencies**

```bash
yarn install
# or
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Replace the placeholders with your actual PostgreSQL connection details.

4. **Generate Prisma Client**

```bash
npx prisma generate
```

5. **Run migrations**

```bash
npx prisma migrate dev --name init
```

6. **Seed the database**

```bash
node prisma/seed.js
```

This will populate your database with initial sentences for the typing test.

7. **Run the development server**

```bash
yarn dev
# or
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000) to see the app.


## Project Structure

```
/prisma
  ├── migrations/        # Database migration files
  ├── seed.js            # Seed script to populate initial data
  └── schema.prisma      # Prisma schema file

/src
  ├── app                # Next.js app directory with React components and API routes
  │   ├── api
  │   │   ├── sentences  # API routes for sentences
  │   │   └── scores     # API routes for scores
  ├── generated/prisma   # Prisma client (ignored in git)
/package.json
/.env
```


## API Endpoints

* `GET /api/sentences` - Fetch a random sentence for typing practice
* `POST /api/scores` - Submit a user score (score, accuracy, wpm)


## Usage Notes

* The project uses Prisma Client generated in `/src/generated/prisma`. This folder is gitignored; run `npx prisma generate` after cloning.
* The seed script uses `node prisma/seed.js` (runs with plain Node.js).
* Make sure to run `npx prisma migrate dev` before seeding to create the database schema.
* Use modern Node.js (v16+) for better ES module support.


## Troubleshooting

* **Error: @prisma/client did not initialize yet:** Run `npx prisma generate` and ensure the client is generated.
* **Unknown file extension ".ts" errors:** Rename seed script to `.js` or run with `ts-node`.
* **Module resolution errors:** Check your import paths and ensure `"type": "module"` in `package.json` if using ES modules.


## Future Improvements

* Add user authentication and profiles
* Enhance UI/UX with Tailwind CSS or another styling framework
* Add leaderboards and score history
* Add multiplayer support or challenge mode
* Improve accessibility and mobile responsiveness


## License

[MIT License](LICENSE)

---

