import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    const collection = db.collection(process.env.COLLECTION_NAME || 'roleplay_agents');
    
    const roleplays = await collection
      .find({})
      .toArray();

    return NextResponse.json(roleplays);
  } catch (error) {
    console.error('Error fetching roleplays:', error);
    return NextResponse.json(
      { error: 'Error al obtener los roleplays' },
      { status: 500 }
    );
  }
}
