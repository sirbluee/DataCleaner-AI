import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // @ts-ignore - In a real app, use proper temporary storage
    const sessionData = global.uploadedData?.[params.id];

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Data not found' },
        { status: 404 }
      );
    }

    // Check if the data has expired (30 minutes)
    const now = Date.now();
    const thirtyMinutesInMs = 30 * 60 * 1000;
    
    if (now - sessionData.timestamp > thirtyMinutesInMs) {
      // @ts-ignore
      delete global.uploadedData[params.id];
      return NextResponse.json(
        { error: 'Data session expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({ 
      data: sessionData.data,
      timestamp: sessionData.timestamp 
    });
  } catch (error) {
    console.error('Data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}