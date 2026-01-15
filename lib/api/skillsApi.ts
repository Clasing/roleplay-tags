// API service para gestionar skills, subskills, grammar, etc.

import { Roleplay } from '@/types/roleplay';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090';

type WithOptionalId<T> = Omit<T, 'id'> & { id?: string; _id?: string };

// Normaliza respuestas que vienen con `_id` a un campo `id` consistente
const normalizeCollection = <T extends { id: string }>(data: unknown): T[] => {
  if (!Array.isArray(data)) return [];

  return (data as WithOptionalId<T>[]) 
    .map((item) => {
      const normalizedId = item.id || item._id;
      if (!normalizedId) return null;

      const { _id: _omit, ...rest } = item as Record<string, unknown>;
      return { ...rest, id: normalizedId } as T;
    })
    .filter(Boolean) as T[];
};

export interface Skill {
  id: string;
  value: string;
}

export interface SubSkill {
  id: string;
  value: string;
  skill: string;
  language?: string;
  languageId?: string;
}

export interface GrammarType {
  id: string;
  value: string;
  language: string;
}

export interface SubGrammarType {
  id: string;
  value: string;
  grammar: string;
  language: string;
  languageId?: string;
}

export interface Language {
  id: string;
  language: string;
}

export interface Vocabulary {
  id: string;
  value: string;
}

export interface SubVocabulary {
  id: string;
  value: string;
  vocabularyId: string;
  vocabulary?: string;
}

export interface RoleplayActivity {
  id: string;
  rolePlayId: string;
  textId: string | null;
  language: string;
  theme: string | string[];
  skillMain: string[];
  subSkill: string[];
  grammar: string[];
  subGrammar: string[];
  vocabularyI: string | null;
  durationAprox: number;
}

// Roleplays
export async function getRoleplayById(roleplayId: string): Promise<Roleplay | null> {
  try {
    if (!roleplayId || roleplayId === 'undefined' || roleplayId === 'null') {
      console.warn('Invalid roleplayId provided:', roleplayId);
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/v2/clasing-ai/roleplay-agents/public/${roleplayId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al obtener roleplay');
    }
    const data: Roleplay = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching roleplay:', error);
    return null;
  }
}

// Roleplay Activities
export async function getRoleplayActivity(roleplayId: string): Promise<RoleplayActivity | null> {
  try {
    // Validar que roleplayId no sea undefined, null o string vacío
    if (!roleplayId || roleplayId === 'undefined' || roleplayId === 'null') {
      console.warn('Invalid roleplayId provided:', roleplayId);
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/activities/roleplays/${roleplayId}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al obtener actividad del roleplay');
    }
    const data: RoleplayActivity = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching roleplay activity:', error);
    return null;
  }
}

// Languages
export async function getLanguages(): Promise<Language[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/languages`);
    if (!response.ok) throw new Error('Error al obtener languages');
    const data: unknown = await response.json();
    return normalizeCollection<Language>(data);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
}

export async function createLanguage(language: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/languages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating language:', error);
    return false;
  }
}

export async function updateLanguage(id: string, language: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/languages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating language:', error);
    return false;
  }
}

export async function deleteLanguage(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/languages/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting language:', error);
    return false;
  }
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/skills`);
    if (!response.ok) throw new Error('Error al obtener skills');
    const data: unknown = await response.json();
    return normalizeCollection<Skill>(data);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function createSkill(value: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating skill:', error);
    return false;
  }
}

export async function updateSkill(id: string, value: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/skills/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating skill:', error);
    return false;
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/skills/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting skill:', error);
    return false;
  }
}

// Sub-Skills
export async function getSubSkills(): Promise<SubSkill[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-skills`);
    if (!response.ok) throw new Error('Error al obtener sub-skills');
    const data: unknown = await response.json();
    return normalizeCollection<SubSkill>(data);
  } catch (error) {
    console.error('Error fetching sub-skills:', error);
    return [];
  }
}

export async function createSubSkill(value: string, skillId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, skillId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating sub-skill:', error);
    return false;
  }
}

export async function updateSubSkill(id: string, value: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-skills/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating sub-skill:', error);
    return false;
  }
}

export async function deleteSubSkill(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-skills/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting sub-skill:', error);
    return false;
  }
}

// Grammar Types
export async function getGrammarTypes(): Promise<GrammarType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/grammar-types`);
    if (!response.ok) throw new Error('Error al obtener grammar types');
    const data: unknown = await response.json();
    return normalizeCollection<GrammarType>(data);
  } catch (error) {
    console.error('Error fetching grammar types:', error);
    return [];
  }
}

export async function createGrammarType(value: string, languageId?: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/grammar-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, languageId: languageId || null }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating grammar type:', error);
    return false;
  }
}

export async function updateGrammarType(id: string, value: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/grammar-types/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating grammar type:', error);
    return false;
  }
}

export async function deleteGrammarType(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/grammar-types/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting grammar type:', error);
    return false;
  }
}

// Sub-Grammar Types
export async function getSubGrammarTypes(): Promise<SubGrammarType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-grammar-types`);
    if (!response.ok) throw new Error('Error al obtener sub-grammar types');
    const data: unknown = await response.json();
    return normalizeCollection<SubGrammarType>(data);
  } catch (error) {
    console.error('Error fetching sub-grammar types:', error);
    return [];
  }
}

export async function createSubGrammarType(value: string, grammarTypeId: string, languageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-grammar-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, grammarTypeId, languageId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating sub-grammar type:', error);
    return false;
  }
}

export async function updateSubGrammarType(id: string, value: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-grammar-types/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating sub-grammar type:', error);
    return false;
  }
}

export async function deleteSubGrammarType(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-grammar-types/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting sub-grammar type:', error);
    return false;
  }
}

// Activity (guardar roleplay completo)
export interface ActivityPayload {
  rolePlayId: string;
  textId?: string | null;
  language: string;
  theme: string[];
  skillMain: string[];
  subSkill: string[];
  grammar: string[];
  subGrammar: string[];
  vocabulary: string[];
  subVocabulary: string[];
  durationAprox: number;
}

export async function createActivity(payload: ActivityPayload): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating activity:', error);
    return false;
  }
}

export async function getVocabularies(): Promise<Vocabulary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/vocabularies`);
    if (!response.ok) throw new Error('Error al obtener vocabularios');
    const data: unknown = await response.json();
    return normalizeCollection<Vocabulary>(data);
  } catch (error) {
    console.error('Error fetching vocabularies:', error);
    return [];
  }
}

export async function getSubVocabularies(): Promise<SubVocabulary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-vocabularies`);
    if (!response.ok) throw new Error('Error al obtener sub-vocabularios');
    const data: unknown = await response.json();
    return normalizeCollection<SubVocabulary>(data);
  } catch (error) {
    console.error('Error fetching sub-vocabularies:', error);
    return [];
  }
}

export async function createVocabulary(value: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/vocabularies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating vocabulary:', error);
    return false;
  }
}

export async function updateVocabulary(id: string, value: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/vocabularies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating vocabulary:', error);
    return false;
  }
}

export async function deleteVocabulary(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/vocabularies/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting vocabulary:', error);
    return false;
  }
}

export async function createSubVocabulary(value: string, vocabularyId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-vocabularies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, vocabularyId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating sub-vocabulary:', error);
    return false;
  }
}

export async function updateSubVocabulary(id: string, value: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-vocabularies/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error updating sub-vocabulary:', error);
    return false;
  }
}

export async function deleteSubVocabulary(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-vocabularies/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting sub-vocabulary:', error);
    return false;
  }
}
