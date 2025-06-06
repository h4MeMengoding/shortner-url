'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { BarChart3, Link, MousePointer, TrendingUp } from 'lucide-react';
import { UserStats } from '@/types';

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse w-full">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-12"></div>
                </div>
                <div className="h-8 w-8 bg-gray-700 rounded flex-shrink-0"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total URLs',
      value: stats?.totalUrls || 0,
      icon: Link,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
    },
    {
      title: 'Total Clicks',
      value: stats?.totalClicks || 0,
      icon: MousePointer,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
    },
    {
      title: 'Active URLs',
      value: stats?.activeUrls || 0,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
    },
    {
      title: 'Click Rate',
      value: stats?.totalUrls ? Math.round((stats.totalClicks / stats.totalUrls) * 100) / 100 : 0,
      icon: BarChart3,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/20',
      suffix: ' avg',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {statsData.map((stat, index) => (
        <Card key={index} className="animate-slide-up w-full" style={{ animationDelay: `${index * 100}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-2">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-100">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
