# letterboxd-clone

A PERN stack (PostgreSQL, Express, React, Node) clone of Letterboxd, built as a personal/school project.
Search movies through the TMDB API, then log what you've watched with a date, a star rating, and an optional review.

## Features
- User accounts (register/login) with JWT
- Browse popular movies and search TMDB's catalog
- Log a movie to your diary with a watch date, rating, and review in one step
- See other people's reviews on each movie's page

## Tech Stack
- PostgreSQL - database
- Express - backend API
- React (Vite) - frontend
- Node.js - runtime
- TMDB API - movie data and posters

## Setup

 Node.js, PostgreSQL, and a free TMDB API key: https://www.themoviedb.org/settings/api (create account and request the key)

### 1. Database
```
createdb letterboxd_clone
psql -d letterboxd_clone -f server/schema.sql
```

### 2. Backend
```
cd server
npm install
cp .env.example .env
npm run dev
```
open `.env` and fill in your DATABASE_URL, JWT_SECRET, and TMDB_API_KEY.
dont share .env anywhere as that contains your information, only .env.example