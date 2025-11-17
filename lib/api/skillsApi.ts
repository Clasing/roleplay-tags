// API service para gestionar skills, subskills, grammar, etc.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090';

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

// Languages
export async function getLanguages(): Promise<Language[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/languages`);
    if (!response.ok) throw new Error('Error al obtener languages');
    const data: Language[] = await response.json();
    return Array.isArray(data) ? data : [];
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

// Skills
export async function getSkills(): Promise<Skill[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/skills`);
    if (!response.ok) throw new Error('Error al obtener skills');
    const data: Skill[] = await response.json();
    return Array.isArray(data) ? data : [];
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

// Sub-Skills
export async function getSubSkills(): Promise<SubSkill[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-skills`);
    if (!response.ok) throw new Error('Error al obtener sub-skills');
    const data: SubSkill[] = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching sub-skills:', error);
    return [];
  }
}

export async function createSubSkill(value: string, skillId: string, languageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-skills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, skillId, languageId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating sub-skill:', error);
    return false;
  }
}

// Grammar Types
export async function getGrammarTypes(): Promise<GrammarType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/grammar-types`);
    if (!response.ok) throw new Error('Error al obtener grammar types');
    const data: GrammarType[] = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching grammar types:', error);
    return [];
  }
}

export async function createGrammarType(value: string, languageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/grammar-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, language: languageId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating grammar type:', error);
    return false;
  }
}

// Sub-Grammar Types
export async function getSubGrammarTypes(): Promise<SubGrammarType[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-grammar-types`);
    if (!response.ok) throw new Error('Error al obtener sub-grammar types');
    const data: SubGrammarType[] = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching sub-grammar types:', error);
    return [];
  }
}

export async function createSubGrammarType(value: string, grammarId: string, languageId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v2/whiteboard-activities/sub-grammar-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, grammar: grammarId, language: languageId }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error creating sub-grammar type:', error);
    return false;
  }
}

// Activity (guardar roleplay completo)
export interface ActivityPayload {
  rolePlayId: string;
  language: string;
  theme: string;
  skillMain: string[];
  subSkill: string[];
  grammar: string[];
  subGrammar: string[];
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
