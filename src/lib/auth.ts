import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  pages: {
    signIn: '/',
    error: '/',
  },
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        if (user) {
          session.user.id = user.id;
        } else if (token) {
          session.user.id = token.sub as string;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // If the URL starts with the base URL, it's safe to return
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default redirect to dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  session: {
    strategy: 'jwt', // Change to JWT strategy for better client-side session handling
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
