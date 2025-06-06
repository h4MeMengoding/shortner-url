'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import StatsCards from '@/components/dashboard/StatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">
            Welcome back, {session?.user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your shortened URLs and track their performance
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button size="lg" className="flex items-center gap-2">
            <Plus size={20} />
            Create Short URL
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Quick Actions</span>
              <ArrowRight size={20} className="text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <Link href="/dashboard/create">
                <Button variant="outline" className="w-full justify-start">
                  <Plus size={16} className="mr-2" />
                  Create New Short URL
                </Button>
              </Link>
              <Link href="/dashboard/urls">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight size={16} className="mr-2" />
                  View All URLs
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight size={16} className="mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                  1
                </div>
                <div>
                  <p className="text-gray-100 font-medium">Create your first short URL</p>
                  <p className="text-gray-400 text-sm">
                    Transform long URLs into short, memorable links
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                  2
                </div>
                <div>
                  <p className="text-gray-100 font-medium">Share and track</p>
                  <p className="text-gray-400 text-sm">
                    Share your links and monitor their performance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                  3
                </div>
                <div>
                  <p className="text-gray-100 font-medium">Generate QR codes</p>
                  <p className="text-gray-400 text-sm">
                    Create QR codes for easy mobile sharing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
