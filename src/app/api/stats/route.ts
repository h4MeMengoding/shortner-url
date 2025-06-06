import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Url from '@/models/Url';
import { UserStats } from '@/types';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = session.user.id;

    // Get total URLs count
    const totalUrls = await Url.countDocuments({ userId });

    // Get total clicks
    const clicksResult = await Url.aggregate([
      { $match: { userId } },
      { $group: { _id: null, totalClicks: { $sum: '$clicks' } } }
    ]);
    const totalClicks = clicksResult[0]?.totalClicks || 0;

    // Get active URLs count
    const activeUrls = await Url.countDocuments({ userId, isActive: true });

    // Get recent URLs
    const recentUrlsData = await Url.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentUrls = recentUrlsData.map(url => ({
      id: (url._id as any).toString(),
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      customCode: url.customCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      title: url.title,
      description: url.description,
      clicks: url.clicks,
      createdAt: url.createdAt.toISOString(),
      expiresAt: url.expiresAt?.toISOString(),
      isActive: url.isActive,
    }));

    const stats: UserStats = {
      totalUrls,
      totalClicks,
      activeUrls,
      recentUrls,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
