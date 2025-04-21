# MOVIE APP
---------------------

This project is a backend service developed with NestJS, designed to integrate with the TMDB API (https://www.themoviedb.org/) to fetch and synchronize movie data into a PostgreSQL database. It exposes a set of RESTful APIs that support movie listing, searching, filtering, and pagination. Additionally, the application includes endpoints for user interactions such as rating movies, managing personal watchlists, and handling authentication. To enhance performance and reduce database load, a caching mechanism is implemented.

## FEATURES:

- Periodic synchronization (Scheduler/Cron job) with TMDB API (default every 12 hours, configurable)  
- Movie listing with average rating calculation and support for pagination, searching, and filtering by genre  
- Movie rating  
- User watchlist functionality  
- API documentation via Swagger  
- Caching to optimize performance  
- Dynamic query building could be applied on any method  
- Dynamic paging could be applied anywhere  
- Unit test  
- Dockerized application  
- Clean architecture  
- Authentication  
- Dynamic Http Helper can be used to call any API with all requests configs  
- Scalable and production-ready architecture  

## TECHNOLOGY STACK:

- Node.js / NestJS  
- PostgreSQL  
- Redis & NestJS Cache Manager  
- Axios (for TMDB API communication)  
- Bcrypt for hashing passwords  
- Jest (for testing)  
- Docker and Docker Compose  

## GETTING STARTED:

**Prerequisites:**  
- Docker installed  
- TMDB API Key (use the existing key in `.env`, `.env.docker` or obtain one from https://www.themoviedb.org/)

**Setup:**  
- `git clone https://github.com/osman-developer/movie-app`  
- Adjust `.env` file (for development) or `.env.docker` file (for production)  
- Build and start the application using: `docker-compose up --build`  
- Once running, the API will be available at: `http://localhost:8080`  
- API documentation (Swagger) can be accessed at: `http://localhost:8080/api` or `http://localhost:3000/api`  
- To run normally (not on Docker), don't forget to run: `npm install` or `npm install --force` and then: `npm run start:dev`

## TESTING:  
- To run unit tests: `npm run test`

## DESIGN CONSIDERATIONS:  
- Built with a modular, scalable architecture using NestJS best practices  
- Follows software design principles: SOLID, DRY, KISS, YAGNI  
- Caching layer reduces read operations on the database  
- Designed for easy extension and maintainability  
- Includes few unit testing and clean code practices  

## PROJECT STRUCTURE:
- `scripts/start.sh`  
- `src/common`: contains cache, constants, dtos, helpers, interfaces which are commonly used in app  
- `src/config`: contains `jwt.config` & `postgres.config`  
- `src/utils`: contains file to create database or use existing one  
- `src/modules`:  
  - `auth`: contains dto, guards, strategies, types along with controller, module, service, test file  
  - `genre`: contains entity, module  
  - `rating`: contains dto, controller, entity, module, service  
  - `user`: contains controller, entity, module, service, test file  
  - `watchlist`: contains controller, entity, module, service, test file  
  - `movie`: contains module, entity  
    - `local`: (for local movies in db) contains dto, controller, mapping profile for dto, service, module  
    - `tmdb-sync`: (for sync with TMDB) contains dto, scheduler, module, service  
- `docker-compose.yml`  
- `Dockerfile`  

## NOTE:  
This app is fully automated, you just need to run one of the following:

- `"docker-compose up --build"` (To run it in prod mode on Docker)  
- `"npm install --force"` then `"npm run start:dev"` (To run it locally in dev mode)
