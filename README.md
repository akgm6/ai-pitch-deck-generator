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
git clone https://github.com/akgm6/ai-pitch-deck-generator/frontend.git

cd frontend

npm install


### Backend
git clone https://github.com/akgm6/ai-pitch-deck-generator/backend.git

cd -backend

npm install


## 2. Configure Environment Variables (optional)
You can add your own Gemini API key in .env files for both the frontend and backend.

Example for the backend:

GEMINI_API_KEY=your-api-key

*I'm currently mocking the Gemini API since quota or access issues arise.*


## 3. Run Locally
### Frontend
npm run dev

### Backend
npm run start:dev


## Known Issues
- Backend cold start delays may affect reliability
- Gemini API quotas or key issues may block live slide generation
- Fallback to local server testing is advised in cases of deployment failure
- Export features may occasionally fail due to browser compatibility or size limitations


## Project Status
This submission reflects the current completed version of SlideGenius. While deployment challenges remain unresolved, the core functionality, design system, and export capabilities are fully implemented and available in both development and hosted environments.


## Author
Alexis Gordon-Martin — Full-stack Developer

