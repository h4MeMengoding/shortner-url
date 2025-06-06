import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Url from '@/models/Url';
import { generateShortCode, isValidUrl, normalizeUrl, validateCustomCode } from '@/lib/utils';
import { CreateUrlRequest, UrlResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateUrlRequest = await request.json();
    const { originalUrl, shortLink, description, expiresAt } = body;

    // Validate original URL
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Validate short link if provided (this will be the custom part of the URL)
    let customCode: string | undefined;
    if (shortLink) {
      // Extract the short code from the full URL if provided, or use as-is
      const shortCodeMatch = shortLink.match(/\/([^\/]+)$/);
      customCode = shortCodeMatch ? shortCodeMatch[1] : shortLink;
      
      if (!validateCustomCode(customCode)) {
        return NextResponse.json(
          { success: false, error: 'Short link must be 3-50 characters and contain only letters, numbers, hyphens, and underscores' },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Check if custom code already exists
    if (customCode) {
      const existingUrl = await Url.findOne({ 
        $or: [{ shortCode: customCode }, { customCode }] 
      });
      
      if (existingUrl) {
        return NextResponse.json(
          { success: false, error: 'Custom code already exists' },
          { status: 409 }
        );
      }
    }

    // Generate unique short code
    let shortCode = customCode || generateShortCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const existingUrl = await Url.findOne({ shortCode });
      if (!existingUrl) {
        isUnique = true;
      } else {
        shortCode = generateShortCode();
        attempts++;
      }
    }

    if (!isUnique) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique short code' },
        { status: 500 }
      );
    }

    // Create new URL
    const newUrl = new Url({
      originalUrl: normalizeUrl(originalUrl),
      shortCode,
      customCode: customCode || undefined,
      userId: session.user.id,
      description,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });

    await newUrl.save();

    const response: UrlResponse = {
      id: newUrl._id.toString(),
      originalUrl: newUrl.originalUrl,
      shortCode: newUrl.shortCode,
      customCode: newUrl.customCode,
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
      description: newUrl.description,
      clicks: newUrl.clicks,
      createdAt: newUrl.createdAt.toISOString(),
      expiresAt: newUrl.expiresAt?.toISOString(),
      isActive: newUrl.isActive,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error creating URL:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    await connectDB();

    const urls = await Url.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Url.countDocuments({ userId: session.user.id });

    const response = urls.map(url => ({
      id: (url._id as string).toString(),
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      customCode: url.customCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      description: url.description,
      clicks: url.clicks,
      createdAt: url.createdAt.toISOString(),
      expiresAt: url.expiresAt?.toISOString(),
      isActive: url.isActive,
    }));

    return NextResponse.json({
      success: true,
      data: {
        urls: response,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
