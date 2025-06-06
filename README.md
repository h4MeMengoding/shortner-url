# URL Shortener

A modern, professional URL shortener built with Next.js, MongoDB, and Google OAuth authentication.

## Features

- 🔗 **URL Shortening**: Create short, memorable links for long URLs
- 🎨 **Modern Dark UI**: Professional dark theme with navy blue background and blue accents
- 🔐 **Google OAuth**: Secure authentication with Google accounts
- 📊 **Analytics Dashboard**: Track clicks, view statistics, and monitor performance
- 📱 **QR Code Generation**: Generate and download QR codes for shortened URLs
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🗄️ **MongoDB Database**: Reliable data storage with Mongoose ODM
- ⚡ **Next.js 15**: Built with the latest Next.js App Router

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **QR Codes**: QRCode library for code generation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Google OAuth credentials

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and update the values:
   ```bash
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/urlshortener
   # or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/urlshortener

   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

   # Google OAuth Configuration (from Google Cloud Console)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # Application Configuration
   BASE_URL=http://localhost:3000
   ```

3. **Set up Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
   - Copy Client ID and Client Secret to your `.env.local`

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Visit [http://localhost:3000](http://localhost:3000)

## Usage

1. **Login**: Sign in with your Google account
2. **Create Short URLs**: Enter a long URL to generate a short link
3. **Manage URLs**: View, edit, or delete your shortened URLs
4. **Generate QR Codes**: Create QR codes for easy sharing
5. **View Analytics**: Track clicks and performance metrics

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── [shortCode]/       # Dynamic route for URL redirects
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
├── models/               # MongoDB models
└── types/                # TypeScript definitions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Your app's URL | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes |
| `BASE_URL` | Base URL for short links | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

1. Build the application: `npm run build`
2. Set environment variables
3. Start the server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
