'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Chrome, Link2, Shield, Zap } from 'lucide-react';

const LoginPage: React.FC = () => {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: `${window.location.origin}/dashboard` });
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <Link2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            URL Shortener
          </h1>
          <p className="text-gray-400 text-body">
            Create short, memorable links in seconds
          </p>
        </div>

        {/* Login Card */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Welcome Back
            </CardTitle>
            <p className="text-center text-gray-400 text-sm">
              Sign in to manage your shortened URLs
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3"
              size="lg"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </Button>

            {/* Features */}
            <div className="pt-6 border-t border-gray-700">
              <h3 className="text-sm font-medium text-gray-100 mb-4">
                Why choose our shortener?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/20 p-1.5 rounded">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-300">
                    Lightning fast redirects
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/20 p-1.5 rounded">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-300">
                    Secure and reliable
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/20 p-1.5 rounded">
                    <Link2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-300">
                    Custom short codes
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400">
          <p>© 2025 URL Shortener. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
