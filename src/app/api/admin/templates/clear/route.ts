import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/turso';

// POST - Clear all templates (for development only)
export async function POST(req: NextRequest) {
  try {
    console.log('Clearing all templates...');
    
    const result = await client.execute('DELETE FROM templates');
    
    console.log(`Cleared ${result.rowsAffected} templates`);
    
    return NextResponse.json({
      message: `Successfully cleared ${result.rowsAffected} templates`
    });

  } catch (error) {
    console.error('Clear templates error:', error);
    return NextResponse.json(
      { error: 'Failed to clear templates' },
      { status: 500 }
    );
  }
}

// GET - Clear all templates (for easy testing)
export async function GET(req: NextRequest) {
  return POST(req);
}