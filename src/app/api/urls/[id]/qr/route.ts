import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Url from '@/models/Url';
import { generateQRCode } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const params = await context.params;
    await connectDB();

    const url = await Url.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL not found' },
        { status: 404 }
      );
    }

    const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;
    const qrCode = await generateQRCode(shortUrl);

    return NextResponse.json({
      success: true,
      data: { qrCode, shortUrl },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
