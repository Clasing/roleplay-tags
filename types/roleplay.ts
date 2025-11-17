export interface Roleplay {
  _id: string;
  id?: string;
  name: string;
  description: string;
  image: string;
  status?: string;
  rating?: number;
  retries?: number;
  language?: string;
  languageLevel?: string;
  systemPrompt?: string;
  studentContext?: string;
  imageUrl?: string;
  s3Key?: string;
  createdAt?: string;
  updatedAt?: string;
  isMale?: boolean;
  tags?: string[];
  vocabularyTags?: string[];
  skillMain?: string[];
  subSkill?: string[];
  grammar?: string[];
  subgrammar?: string[];
}

export interface RoleplayLanguage {
  _id: string;
  roleId: string;
  language: string;
  description?: string;
  studentContext?: string;
}

export interface RoleplayFilters {
  searchQuery?: string;
  category?: string;
  tags?: string[];
}
