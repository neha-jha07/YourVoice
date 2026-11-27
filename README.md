# YourVoice

A multilingual AI-assisted civic complaint app for India, built with React, TypeScript, Vite, and Spring Boot Java.

## Features

- English, Hindi, and Hinglish interface
- Wispr Flow-ready dictation in the complaint text area, plus browser speech fallback
- Complaint category and authority suggestions
- Location, duration, and evidence review
- Review and confirm flow before official portal submission
- Demo reference number and status screen
- Docker Compose startup on port 3000
- No API key required to start

## Run locally

Frontend:

```bash
cd frontend
npm install
npm run dev -- --port 3000
```

Backend:

```bash
cd backend
mvn spring-boot:run
```

Backend API: `http://localhost:8080`.

## Run with Docker Compose

```bash
docker compose up --build
```

Open `http://localhost:3000`.

## Speech with Wispr Flow

Wispr Flow is a desktop dictation app rather than a website API. Install Flow, focus the complaint box, and use your configured Flow shortcut. Flow inserts cleaned, punctuated speech directly in the field. The app also provides a browser speech-recognition fallback where supported.

## Configuration

Copy `.env.example` to `.env` if provider configuration is added later. The app remains fully usable without an `.env` file.
