import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Url from '@/models/Url';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    await connectDB();

    const url = await Url.findOne({
      shortCode: shortCode,
      isActive: true,
    });

    if (!url) {
      return NextResponse.redirect(new URL('/?error=not-found', request.url));
    }

    // Check if URL has expired
    if (url.expiresAt && new Date() > url.expiresAt) {
      return NextResponse.redirect(new URL('/?error=expired', request.url));
    }

    // Increment click count
    await Url.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });

    // Redirect to original URL
    return NextResponse.redirect(url.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.redirect(new URL('/?error=server-error', request.url));
  }
}
