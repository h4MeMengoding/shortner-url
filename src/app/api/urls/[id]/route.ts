import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Url from '@/models/Url';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const url = await Url.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, isActive } = body;

    await connectDB();

    const url = await Url.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { 
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true }
    );

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL not found' },
        { status: 404 }
      );
    }

    const response = {
      id: url._id.toString(),
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
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error updating URL:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
