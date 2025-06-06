'use client';

import React from 'react';
import StatsCards from '@/components/dashboard/StatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart3, TrendingUp, Clock, Globe } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Analytics</h1>
        <p className="text-gray-400">
          Track the performance of your shortened URLs
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing URLs */}
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Top Performing URLs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  Detailed analytics coming soon
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Track clicks, referrers, and geographic data
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  Activity tracking coming soon
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  See real-time clicks and user interactions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Data */}
        <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              Geographic Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  Geographic analytics coming soon
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  See where your clicks are coming from
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Click Timeline */}
        <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              Click Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">
                  Timeline charts coming soon
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Visualize clicks over time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Notice */}
      <Card className="border-blue-700 bg-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 mb-2">
                Advanced Analytics Coming Soon
              </h3>
              <p className="text-gray-300 text-sm">
                We&apos;re working on advanced analytics features including detailed click tracking, 
                referrer analysis, geographic data, device information, and custom date ranges. 
                Stay tuned for these exciting updates!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
