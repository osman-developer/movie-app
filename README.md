# MOVIE APP

This project is a backend service developed with **NestJS**, designed to integrate with the [TMDB API](https://www.themoviedb.org/) to fetch and synchronize movie data into a **PostgreSQL** database. It exposes a set of RESTful APIs that support movie listing, searching, filtering, and pagination. Additionally, the application includes endpoints for user interactions such as rating movies, managing personal watchlists, and handling authentication. To enhance performance and reduce database load, a caching mechanism is implemented.

---

## Features

- Periodic synchronization (Scheduler/Cron job) with TMDB API (default every 12 hours, configurable)
- Movie listing with average rating calculation and support for pagination, searching, and filtering by genre
- Movie rating functionality
- User watchlist management
- API documentation via Swagger
- Caching to optimize performance
- Dynamic query building applicable across methods
- Dynamic paging support
- Unit testing
- Dockerized application
- Clean architecture
- Authentication
- Dynamic HTTP Helper for external API calls with full request configurations
- Scalable and production-ready setup

---

## Technology Stack

- Node.js / NestJS  
- PostgreSQL  
- Redis & NestJS Cache Manager  
- Axios (for TMDB API communication)  
- Bcrypt (for password hashing)  
- Jest (for testing)  
- Docker & Docker Compose  

---

## Getting Started

### Prerequisites

- Docker installed  
- TMDB API Key (use the existing key in `.env` / `.env.docker` or obtain one from https://www.themoviedb.org/)

### Setup

```bash
git clone https://github.com/osman-developer/movie-app
