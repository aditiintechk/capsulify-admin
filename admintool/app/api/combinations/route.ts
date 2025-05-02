import { NextResponse } from 'next/server';
import { calculateClothingCombinations } from '@/src/engine/engine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId')) || 1;

    const result = await calculateClothingCombinations(userId);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in combinations API:', error);
    return NextResponse.json(
      { error: 'Failed to calculate combinations' },
      { status: 500 }
    );
  }
} 