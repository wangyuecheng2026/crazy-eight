# Tina Crazy 8s

A fun and interactive Crazy Eights card game built with React, Tailwind CSS, and Framer Motion.

## Features

- **Smooth Animations**: Powered by `motion`.
- **Responsive Design**: Play on mobile or desktop.
- **AI Opponent**: Intelligent move selection.
- **Wild Cards**: Play an 8 to change the suit.

## Deployment to Vercel

This project is ready to be deployed to Vercel as a Single Page Application (SPA).

### Steps to Deploy:

1. **Push to GitHub**:
   - Create a new repository on GitHub.
   - Initialize git in this folder: `git init`.
   - Add files: `git add .`.
   - Commit: `git commit -m "Initial commit"`.
   - Link to GitHub: `git remote add origin <your-github-repo-url>`.
   - Push: `git push -u origin main`.

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com).
   - Click **"New Project"**.
   - Import your GitHub repository.
   - Vercel will automatically detect the Vite configuration.
   - Click **"Deploy"**.

### Environment Variables

If you use features requiring the Gemini API, make sure to add `GEMINI_API_KEY` to your Vercel project settings under **Environment Variables**.
