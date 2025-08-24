import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test save - received body:', JSON.stringify(body, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      received: body,
      message: 'Data received successfully' 
    });
  } catch (error) {
    console.error('Test save error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}