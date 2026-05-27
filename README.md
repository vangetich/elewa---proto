# ELEWA Prototype

## Overview
Prototype web app for ELEWA: landing → signup → dashboard with proverbs, books, how-to guides, FAQ, activities.

## Run locally
1. `npm install`
2. `npm start`
3. Open `http://localhost:3000`

## Files
- `server.js` - Express server and API endpoints
- `public/` - frontend pages (landing, signup, dashboard)
- `data/` - JSON data (languages, proverbs, books, faq, users)

## Next steps
- Replace JSON persistence with MongoDB/Postgres
- Add authentication (JWT / sessions)
- Build admin CMS for books/proverbs/activities
- Add scoring, leaderboards, contest workflows
