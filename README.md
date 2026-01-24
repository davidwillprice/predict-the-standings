Repo for the [Predict The Standings](https://predictthestandings.com/) website.

This is a [Next.js](https://nextjs.org/) project that was bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). The game data and accounts are hosted within a MongoDB database.

People can make an account on the site and then predict the final table for different competitions. Their account and predictions are stored within the database.

Competition results are manually stored and updated within the `src/data` folder as TypeScript files.

When `updateDevDb` or `updateProdDb` are run via NPM, code runs which calculates how valid people's predictions were and updates that database with their performance and stats.

It is important to correctly update when a competition opens for predictions, closes for predictions, and add round results as the competition progresses. Locking the gamedata for a competition avoids the calculations running for a competition that has already finished.

Authentication is via [Auth.js](https://authjs.dev/).

The domain is managed with [Namecheap](https://www.namecheap.com/).

The site is deployed as Project on [Railway](https://railway.com/).

## Getting Started

1. Add `.env` containing the database connection details, and all the auth ID's and secrets
2. Add `.env.development` containing the local database connection details
3. Install MongoDB Compass to help manage the local and production databases
4. Connect to the production database using Compass and the connection string in the `.env`
5. Install the [MongoDB Community Server](https://www.mongodb.com/try/download/community) as a Network service user for use as a local DB
6. Run `npm run dev` to boot a developer environment which uses the local database
7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
