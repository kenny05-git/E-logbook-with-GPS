# E-Logbook with GPS Tracking

A web-based electronic logbook system that lets students document their daily placement activities, complete with real-time GPS location tracking to verify where each entry was made.

## Features

- Student log entry creation with date, description, and automatic GPS location capture
- Supervisor review and approval workflow for submitted entries
- Industrial supervisor confirmation and rating system
- Real-time notifications for entry status updates
- Role-based dashboards for students, supervisors, and industrial supervisors

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Appwrite (database, authentication-ready)
- **Deployment:** Vercel

## Live Demo

[https://e-logbook-with-gps.vercel.app](https://e-logbook-with-gps.vercel.app)

## Getting Started

1. Clone the repository
   \`\`\`
   git clone https://github.com/kenny05-git/E-logbook-with-GPS.git
   \`\`\`
2. Install dependencies
   \`\`\`
   npm install
   \`\`\`
3. Run the development server
   \`\`\`
   npm run dev
   \`\`\`

## What I Learned

Building this project involved connecting a React frontend to a real Appwrite backend, handling GPS geolocation in the browser, debugging live permission and API errors, and deploying a full-stack application to production.