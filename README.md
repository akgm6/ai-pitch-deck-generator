# SlideGenius

SlideGenius is an AI-powered pitch deck generator that transforms your ideas into professional presentations in seconds. Built for founders, marketers, and creators, it empowers users to craft compelling narratives with minimal effort.

---

## Live Demo

- **Frontend:** [https://slide-genius-eta.vercel.app](https://slide-genius-eta.vercel.app)  
- **Backend API:** [https://slide-genius-backend.onrender.com](https://slide-genius-backend.onrender.com)

---

## Overview

SlideGenius combines real-time AI generation with polished UI design and export-ready outputs. Users can customize slide tone, length, and messaging, then download decks in both PDF and PowerPoint formats.

---

## Features

- AI-driven slide generation using Gemini API  
- Material-UI-based interface with theme customization  
- PDF and PowerPoint export support via jsPDF and pptxgenjs  
- Speaker notes and regeneration controls for enhanced storytelling  
- Hosted frontend on Vercel and backend on Render

---

## Tech Stack

**Frontend:**

- React.js  
- Material-UI  
- jsPDF  
- pptxgenjs

**Backend:**

- Node.js  
- NestJS  
- Gemini AI integration

---

## Local Setup Instructions

### 1. Clone the Repositories

### Frontend
git clone https://github.com/your-username/slidegenius-frontend.git
cd slidegenius-frontend
npm install

### Backend
git clone https://github.com/your-username/slidegenius-backend.git
cd slidegenius-backend
npm install

## 2. Configure Environment Variables
Create .env files for both the frontend and backend.
Example for the backend:
GEMINI_API_KEY=your-api-key
PORT=4000
*Mocking the Gemini API for local testing is supported if quota or access issues arise.*

## 3. Run Locally
### Frontend
npm run dev

### Backend
npm run start:dev

Ensure both services are running concurrently and communicating via appropriate endpoints.

## Deployment Guide
*Note: Backend deployment on Render may be unstable due to cold starts or API limitations. Ongoing troubleshooting is in progress.*
### Frontend (Vercel)
Link your GitHub repository in the Vercel dashboard
Enable auto-deploy from the main branch
Set environment variables under Project → Settings → Environment
Push to main or click Redeploy to trigger new builds
Backend (Render)
Connect the backend repo to Render
Set required environment variables
Choose Node environment and specify build command:
npm run start:prod

## Known Issues
### Backend cold start delays may affect reliability
Gemini API quotas or key issues may block live slide generation
Fallback to local server testing is advised in cases of deployment failure
Export features may occasionally fail due to browser compatibility or size limitations

## Project Status
This submission reflects the current completed version of SlideGenius. While deployment challenges remain unresolved, the core functionality, design system, and export capabilities are fully implemented and available in both development and hosted environments.

## Author
Alexis Gordon-Martin — Full-stack Developer

