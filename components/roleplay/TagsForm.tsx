'use client';

import { useState, useEffect, useCallback } from 'react';
import { Roleplay } from '@/types/roleplay';
import MultiSelect from '@/components/roleplay/MultiSelect';
import {
  getSkills,
  getSubSkills,
  getGrammarTypes,
  getSubGrammarTypes,
  createSkill,
  createSubSkill,
  createGrammarType,
  createSubGrammarType,
  getLanguages,
  createActivity,
  Skill,
  SubSkill,
  GrammarType,
  SubGrammarType,
  Language,
  ActivityPayload,
} from '@/lib/api/skillsApi';

interface TagsFormData {
  vocabularyTags: string[];
  skillMain: string[];
  subSkill: string[];
  grammar: string[];
  subgrammar: string[];
  language: string;
}

interface TagsFormProps {
  roleplay: Roleplay;
  onSave: (data: TagsFormData) => void;
  selectedLanguage: string;
}

export default function TagsForm({ roleplay, onSave, selectedLanguage }: TagsFormProps) {
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableSubSkills, setAvailableSubSkills] = useState<SubSkill[]>([]);
  const [allSubSkills, setAllSubSkills] = useState<SubSkill[]>([]);
  const [availableGrammar, setAvailableGrammar] = useState<GrammarType[]>([]);
  const [availableSubgrammar, setAvailableSubgrammar] = useState<SubGrammarType[]>([]);
  const [allSubgrammar, setAllSubgrammar] = useState<SubGrammarType[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<string>(roleplay.name || '');
  const [duration, setDuration] = useState<number>(30);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(roleplay.skillMain || []);
  const [selectedSubSkills, setSelectedSubSkills] = useState<string[]>(roleplay.subSkill || []);
  const [selectedGrammar, setSelectedGrammar] = useState<string[]>(roleplay.grammar || []);
  const [selectedSubgrammar, setSelectedSubgrammar] = useState<string[]>(roleplay.subgrammar || []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [skills, subSkills, grammar, subgrammar, languages] = await Promise.all([
        getSkills(),
        getSubSkills(),
        getGrammarTypes(),
        getSubGrammarTypes(),
        getLanguages(),
      ]);
      setAvailableSkills(skills);
      setAllSubSkills(subSkills);
      setAvailableGrammar(grammar);
      setAllSubgrammar(subgrammar);
      setAvailableLanguages(languages);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const getSelectedLanguageId = useCallback(() => {
    if (!selectedLanguage) return undefined;
    const normalized = selectedLanguage.toUpperCase();
    return availableLanguages.find(l => l.language.toUpperCase() === normalized)?.id;
  }, [selectedLanguage, availableLanguages]);

  const applyLanguageFilters = useCallback(() => {
    const languageId = getSelectedLanguageId();

    if (languageId) {
      const filteredSubSkills = allSubSkills.filter(subSkill => {
        const subSkillLanguage = (subSkill as unknown as { language?: string; languageId?: string }).language ?? (subSkill as unknown as { languageId?: string }).languageId;
        return !subSkillLanguage || subSkillLanguage === languageId;
      });

      const filteredSubgrammar = allSubgrammar.filter(subGrammar => {
        const subGrammarLanguage = (subGrammar as unknown as { language?: string; languageId?: string }).language ?? (subGrammar as unknown as { languageId?: string }).languageId;
        return !subGrammarLanguage || subGrammarLanguage === languageId;
      });

      setAvailableSubSkills(filteredSubSkills);
      setAvailableSubgrammar(filteredSubgrammar);

      setSelectedSubSkills(prev => prev.filter(value => filteredSubSkills.some(item => item.value === value)));
      setSelectedSubgrammar(prev => prev.filter(value => filteredSubgrammar.some(item => item.value === value)));
    } else {
      setAvailableSubSkills(allSubSkills);
      setAvailableSubgrammar(allSubgrammar);
    }
  }, [getSelectedLanguageId, allSubSkills, allSubgrammar]);

  useEffect(() => {
    applyLanguageFilters();
  }, [applyLanguageFilters]);

  const handleAddSkill = async (value: string) => {
    const success = await createSkill(value);
    if (success) {
      const updatedSkills = await getSkills();
      setAvailableSkills(updatedSkills);
    }
    return success;
  };

  const handleAddSubSkill = async (value: string) => {
    const skillId = selectedSkills.length > 0 
      ? availableSkills.find(s => s.value === selectedSkills[0])?.id 
      : availableSkills[0]?.id;
    const languageId = getSelectedLanguageId();
    
    if (!skillId || !languageId) {
      console.error('No skill or language available to associate sub-skill');
      return false;
    }
    
    const success = await createSubSkill(value, skillId, languageId);
    if (success) {
      const updatedSubSkills = await getSubSkills();
      setAllSubSkills(updatedSubSkills);
    }
    return success;
  };

  const handleAddGrammar = async (value: string) => {
    const languageId = getSelectedLanguageId();
    
    if (!languageId) {
      console.error('No language selected');
      return false;
    }
    
    const success = await createGrammarType(value, languageId);
    if (success) {
      const updatedGrammar = await getGrammarTypes();
      setAvailableGrammar(updatedGrammar);
    }
    return success;
  };

  const handleAddSubgrammar = async (value: string) => {
    const grammarId = selectedGrammar.length > 0
      ? availableGrammar.find(g => g.value === selectedGrammar[0])?.id
      : availableGrammar[0]?.id;
    
    const languageId = getSelectedLanguageId();
    
    if (!grammarId || !languageId) {
      console.error('No grammar or language available to associate sub-grammar');
      return false;
    }
    
    const success = await createSubGrammarType(value, grammarId, languageId);
    if (success) {
      const updatedSubgrammar = await getSubGrammarTypes();
      setAllSubgrammar(updatedSubgrammar);
    }
    return success;
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const languageId = getSelectedLanguageId() || '';
      
      const skillIds = selectedSkills
        .map(skillName => availableSkills.find(s => s.value === skillName)?.id)
        .filter(id => id) as string[];
      
      const subSkillIds = selectedSubSkills
        .map(subSkillName => availableSubSkills.find(s => s.value === subSkillName)?.id)
        .filter(id => id) as string[];
      
      const grammarIds = selectedGrammar
        .map(grammarName => availableGrammar.find(g => g.value === grammarName)?.id)
        .filter(id => id) as string[];
      
      const subGrammarIds = selectedSubgrammar
        .map(subGrammarName => availableSubgrammar.find(sg => sg.value === subGrammarName)?.id)
        .filter(id => id) as string[];
      
      if (!languageId) {
        alert('Por favor selecciona un idioma');
        setIsSaving(false);
        return;
      }
      
      const payload: ActivityPayload = {
        rolePlayId: roleplay._id,
        language: languageId,
        theme: theme,
        skillMain: skillIds,
        subSkill: subSkillIds,
        grammar: grammarIds,
        subGrammar: subGrammarIds,
        durationAprox: duration,
      };
      
      const success = await createActivity(payload);
      
      if (success) {
        alert('Actividad guardada exitosamente');
        onSave({
          vocabularyTags: [],
          skillMain: selectedSkills,
          subSkill: selectedSubSkills,
          grammar: selectedGrammar,
          subgrammar: selectedSubgrammar,
          language: selectedLanguage,
        });
      } else {
        alert('Error al guardar la actividad');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Error al guardar la actividad');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Theme (Tema)
          </h3>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ej: Daily Routines"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-600"
          />
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Duration Aproximada (minutos)
          </h3>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            placeholder="30"
            min="1"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-600"
          />
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-zinc-700 dark:border-t-white"></div>
          </div>
        ) : (
          <>
            <MultiSelect
              label="skillMain"
              options={availableSkills.map(s => s.value)}
              selected={selectedSkills}
              onChange={setSelectedSkills}
              onAddNew={handleAddSkill}
            />

            <MultiSelect
              label="subSkill"
              options={availableSubSkills.map(s => s.value)}
              selected={selectedSubSkills}
              onChange={setSelectedSubSkills}
              onAddNew={handleAddSubSkill}
            />

            <MultiSelect
              label="grammar"
              options={availableGrammar.map(g => g.value)}
              selected={selectedGrammar}
              onChange={setSelectedGrammar}
              onAddNew={handleAddGrammar}
            />

            <MultiSelect
              label="subgrammar"
              options={availableSubgrammar.map(sg => sg.value)}
              selected={selectedSubgrammar}
              onChange={setSelectedSubgrammar}
              onAddNew={handleAddSubgrammar}
            />
          </>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full rounded-lg bg-pink-300 py-3 text-sm font-semibold text-pink-900 transition-all hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-pink-800 dark:text-pink-100 dark:hover:bg-pink-700"
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-pink-900 border-t-transparent dark:border-pink-100 dark:border-t-transparent"></div>
              Guardando...
            </span>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </div>
  );
}
