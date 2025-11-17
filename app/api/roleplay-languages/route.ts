import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { UUID } from 'mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('roleId');
    const language = searchParams.get('language');

    if (!roleId || !language) {
      return NextResponse.json(
        { error: 'roleId y language son requeridos' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const collection = db.collection('role_play_languages');
    
    // Convertir roleId a UUID de BSON
    let roleIdUUID;
    try {
      roleIdUUID = new UUID(roleId);
    } catch (e) {
      return NextResponse.json(
        { error: 'roleId debe ser un UUID válido' },
        { status: 400 }
      );
    }
    
    // Buscar el documento que coincida con roleId y language (case-insensitive)
    const roleplayLanguage = await collection.findOne({
      roleId: roleIdUUID,
      language: { $regex: new RegExp(`^${language}$`, 'i') }
    });

    if (!roleplayLanguage) {
      return NextResponse.json(
        { error: 'No se encontró información para este roleplay e idioma' },
        { status: 404 }
      );
    }

    return NextResponse.json(roleplayLanguage);
  } catch (error) {
    console.error('Error fetching roleplay language:', error);
    return NextResponse.json(
      { error: 'Error al obtener la información del idioma' },
      { status: 500 }
    );
  }
}
