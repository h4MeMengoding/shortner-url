<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# URL Shortener Project Instructions

This is a Next.js URL shortener application with the following specifications:

## Tech Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS with dark professional theme
- **UI Components**: Custom components with Lucide React icons

## Design System
- **Primary Colors**: Dark navy blue (#0E182D) background, bright blue (#3B82F6) accent
- **Card Design**: Slate dark (#1e293b) background, gray (#334155) borders
- **Typography**: Inter font, 14px body text, white (#f1f5f9) text
- **Components**: 12px rounded corners, 24px padding, responsive design
- **Theme**: Dark-first approach with professional aesthetics

## Project Structure
- `/src/app` - App Router pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions, database connections, configurations
- `/src/models` - MongoDB/Mongoose models
- `/src/types` - TypeScript type definitions

## Key Features
- Google OAuth authentication only (landing page is login page)
- URL shortening with custom short codes
- QR code generation for shortened URLs
- Modern dark professional UI
- Mobile-first responsive design
- Dashboard for managing shortened URLs

## Environment Variables
All credentials must be stored in `.env.local`:
- MONGODB_URI
- NEXTAUTH_URL, NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- BASE_URL

When generating code, follow these conventions:
- Use TypeScript strict mode
- Implement proper error handling
- Follow React best practices
- Use Tailwind utility classes consistently
- Maintain the dark professional theme
- Ensure mobile responsiveness
