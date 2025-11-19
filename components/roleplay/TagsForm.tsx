'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Roleplay } from '@/types/roleplay';
import MultiSelect from '@/components/roleplay/MultiSelect';
import {
  getSkills,
  getSubSkills,
  getGrammarTypes,
  getSubGrammarTypes,
  getLanguages,
  createActivity,
  getRoleplayActivity,
  Skill,
  SubSkill,
  GrammarType,
  SubGrammarType,
  Language,
  ActivityPayload,
  getVocabularies,
  getSubVocabularies,
  Vocabulary,
  SubVocabulary,
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
  const [allGrammar, setAllGrammar] = useState<GrammarType[]>([]);
  const [availableSubgrammar, setAvailableSubgrammar] = useState<SubGrammarType[]>([]);
  const [allSubgrammar, setAllSubgrammar] = useState<SubGrammarType[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [availableVocabularies, setAvailableVocabularies] = useState<Vocabulary[]>([]);
  const [availableSubVocabularies, setAvailableSubVocabularies] = useState<SubVocabulary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [themes, setThemes] = useState<string[]>(roleplay.name ? [roleplay.name] : []);
  const [newThemeInput, setNewThemeInput] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedSubSkills, setSelectedSubSkills] = useState<string[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<string[]>([]);
  const [selectedSubgrammar, setSelectedSubgrammar] = useState<string[]>([]);
  const [selectedVocabularyId, setSelectedVocabularyId] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Resetear todos los estados cuando cambia el roleplay
      setSelectedSkills([]);
      setSelectedSubSkills([]);
      setSelectedGrammar([]);
      setSelectedSubgrammar([]);
      setThemes(roleplay.name ? [roleplay.name] : []);
      setNewThemeInput('');
      setSelectedVocabularyId('');
      setDuration(30);
      
      // Cargar datos básicos
      const [skills, subSkills, grammar, subgrammar, languages, vocabularies, subVocabularies] = await Promise.all([
        getSkills(),
        getSubSkills(),
        getGrammarTypes(),
        getSubGrammarTypes(),
        getLanguages(),
        getVocabularies(),
        getSubVocabularies(),
      ]);

      // Cargar actividad solo si existe un roleplayId válido
      let activity = null;
      const roleplayId = roleplay._id || roleplay.id;
      if (roleplayId) {
        activity = await getRoleplayActivity(roleplayId);
      }
      
      setAvailableSkills(skills);
      setAllSubSkills(subSkills);
      setAvailableGrammar(grammar);
      setAllGrammar(grammar);
      setAllSubgrammar(subgrammar);
      setAvailableLanguages(languages);
      setAvailableVocabularies(vocabularies);
      setAvailableSubVocabularies(subVocabularies);

      // Si existe actividad, cargar los tags existentes
      if (activity) {
        // Mapear IDs a valores (names)
        const skillValues = activity.skillMain
          .map(id => skills.find(s => s.id === id)?.value)
          .filter(Boolean) as string[];
        
        const subSkillValues = activity.subSkill
          .map(id => subSkills.find(s => s.id === id)?.value)
          .filter(Boolean) as string[];
        
        const grammarValues = activity.grammar
          .map(id => grammar.find(g => g.id === id)?.value)
          .filter(Boolean) as string[];
        
        const subGrammarValues = activity.subGrammar
          .map(id => subgrammar.find(sg => sg.id === id)?.value)
          .filter(Boolean) as string[];

        setSelectedSkills(skillValues);
        setSelectedSubSkills(subSkillValues);
        setSelectedGrammar(grammarValues);
        setSelectedSubgrammar(subGrammarValues);
        
        if (activity.theme) {
          const incomingThemes = Array.isArray(activity.theme)
            ? activity.theme.filter(Boolean)
            : [activity.theme].filter(Boolean);
          if (incomingThemes.length > 0) {
            setThemes(incomingThemes);
          }
        }
        if (activity.vocabularyI) {
          setSelectedVocabularyId(activity.vocabularyI);
        }
        if (activity.durationAprox) setDuration(activity.durationAprox);
      }

      setIsLoading(false);
    };
    loadData();
  }, [roleplay._id, roleplay.id, roleplay.name]);

  const defaultLanguage = useMemo(
    () => availableLanguages.find((lang) => lang.language?.toUpperCase() === 'DEFAULT'),
    [availableLanguages]
  );

  const getSelectedLanguageId = useCallback(() => {
    if (!selectedLanguage) return undefined;
    const normalized = selectedLanguage.toUpperCase();
    return availableLanguages.find(l => l.language.toUpperCase() === normalized)?.id;
  }, [selectedLanguage, availableLanguages]);

  const applyLanguageFilters = useCallback(() => {
    const languageId = getSelectedLanguageId();
    const defaultLangId = defaultLanguage?.id;
    const selectedSkillIds = selectedSkills.map(skillValue => availableSkills.find(s => s.value === skillValue)?.id).filter(Boolean) as string[];
    const selectedGrammarIds = selectedGrammar.map(grammarValue => availableGrammar.find(g => g.value === grammarValue)?.id).filter(Boolean) as string[];

    if (languageId) {
      const filteredSubSkills = allSubSkills.filter(subSkill => {
        const subSkillLanguage = (subSkill as unknown as { language?: string; languageId?: string }).language ?? (subSkill as unknown as { languageId?: string }).languageId;
        const subSkillParent = (subSkill as unknown as { skill?: string }).skill;
        
        // Filter by language
        const languageMatch = !subSkillLanguage || subSkillLanguage === defaultLangId || subSkillLanguage === languageId;
        // Filter by parent skills if any are selected
        const skillMatch = selectedSkillIds.length === 0 || selectedSkillIds.includes(subSkillParent || '');
        
        return languageMatch && skillMatch;
      });

      const filteredGrammar = allGrammar.filter(grammar => {
        const grammarLanguage = grammar.language;
        // Filter by language
        const languageMatch = !grammarLanguage || grammarLanguage === defaultLangId || grammarLanguage === languageId;
        return languageMatch;
      });

      const filteredSubgrammar = allSubgrammar.filter(subGrammar => {
        const subGrammarLanguage = (subGrammar as unknown as { language?: string; languageId?: string }).language ?? (subGrammar as unknown as { languageId?: string }).languageId;
        const subGrammarParent = (subGrammar as unknown as { grammar?: string }).grammar;
        
        // Filter by language
        const languageMatch = !subGrammarLanguage || subGrammarLanguage === defaultLangId || subGrammarLanguage === languageId;
        // Filter by parent grammar if any are selected
        const grammarMatch = selectedGrammarIds.length === 0 || selectedGrammarIds.includes(subGrammarParent || '');
        
        return languageMatch && grammarMatch;
      });

      setAvailableSubSkills(filteredSubSkills);
      setAvailableGrammar(filteredGrammar);
      setAvailableSubgrammar(filteredSubgrammar);

      setSelectedSubSkills(prev => prev.filter(value => filteredSubSkills.some(item => item.value === value)));
      setSelectedGrammar(prev => prev.filter(value => filteredGrammar.some(item => item.value === value)));
      setSelectedSubgrammar(prev => prev.filter(value => filteredSubgrammar.some(item => item.value === value)));
    } else {
      setAvailableSubSkills(allSubSkills);
      setAvailableGrammar(allGrammar);
      setAvailableSubgrammar(allSubgrammar);
    }
  }, [getSelectedLanguageId, allSubSkills, allGrammar, allSubgrammar, defaultLanguage, selectedSkills, selectedGrammar, availableSkills, availableGrammar]);

  useEffect(() => {
    applyLanguageFilters();
  }, [applyLanguageFilters]);

  const handleAddTheme = () => {
    const value = newThemeInput.trim();
    if (!value) return;
    setThemes((prev) => (prev.includes(value) ? prev : [...prev, value]));
    setNewThemeInput('');
  };

  const handleRemoveTheme = (themeValue: string) => {
    setThemes((prev) => prev.filter((item) => item !== themeValue));
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

      if (themes.length === 0) {
        alert('Por favor agrega al menos un tema para la actividad');
        setIsSaving(false);
        return;
      }

      if (availableVocabularies.length > 0 && !selectedVocabularyId) {
        alert('Por favor selecciona un set de vocabulario');
        setIsSaving(false);
        return;
      }

      const roleplayIdForSave = roleplay._id || roleplay.id;
      if (!roleplayIdForSave) {
        alert('Error: No se encontró el ID del roleplay');
        setIsSaving(false);
        return;
      }
      
      const payload: ActivityPayload = {
        rolePlayId: roleplayIdForSave,
        textId: null,
        language: languageId,
        theme: themes,
        skillMain: skillIds,
        subSkill: subSkillIds,
        grammar: grammarIds,
        subGrammar: subGrammarIds,
        vocabularyI: selectedVocabularyId || null,
        durationAprox: duration,
      };

      console.log('Payload a enviar:', payload);
      
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
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Themes (puedes agregar varios)
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Escribe un tema y presiona Enter o haz clic en &quot;Agregar tema&quot;.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newThemeInput}
              onChange={(e) => setNewThemeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTheme();
                }
              }}
              placeholder="Ej: Daily Routines"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:border-zinc-600"
            />
            <button
              type="button"
              onClick={handleAddTheme}
              className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Agregar tema
            </button>
          </div>
          {themes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {themes.map((themeValue) => (
                <span
                  key={themeValue}
                  className="group inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 dark:bg-zinc-900 dark:text-white"
                >
                  {themeValue}
                  <button
                    type="button"
                    onClick={() => handleRemoveTheme(themeValue)}
                    className="text-gray-500 transition-colors hover:text-red-500"
                    aria-label={`Eliminar tema ${themeValue}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No has agregado temas todavía.
            </p>
          )}
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MultiSelect
              label="skillMain"
              options={availableSkills.map(s => s.value)}
              selected={selectedSkills}
              onChange={setSelectedSkills}
            />

            <MultiSelect
              label="subSkill"
              options={availableSubSkills.map(s => s.value)}
              selected={selectedSubSkills}
              onChange={setSelectedSubSkills}
            />

            <MultiSelect
              label="grammar"
              options={availableGrammar.map(g => g.value)}
              selected={selectedGrammar}
              onChange={setSelectedGrammar}
            />

            <MultiSelect
              label="subgrammar"
              options={availableSubgrammar.map(sg => sg.value)}
              selected={selectedSubgrammar}
              onChange={setSelectedSubgrammar}
            />
          </div>
        )}

        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Vocabulario
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selecciona el set de vocabulario que mejor se adapte a tu actividad.
            </p>
          </div>

          {availableVocabularies.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-zinc-700 dark:text-gray-400">
              No hay vocabularios disponibles.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {availableVocabularies.map((vocab) => {
                const isSelected = selectedVocabularyId === vocab.id;
                const subVocabs = availableSubVocabularies.filter(sv => sv.vocabularyId === vocab.id);
                return (
                  <button
                    type="button"
                    key={vocab.id}
                    onClick={() => setSelectedVocabularyId(vocab.id)}
                    className={`text-left rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-gray-300 dark:border-zinc-800 dark:bg-black dark:text-white'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-sm font-semibold uppercase tracking-wide">
                        {vocab.value}
                      </div>
                      {subVocabs.length > 0 && (
                        <>
                          <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                            Sub-Vocabularios
                          </div>
                          <ul className={`space-y-1 text-sm ${isSelected ? 'text-white/90 dark:text-black/90' : 'text-gray-700 dark:text-gray-300'}`}>
                            {subVocabs.map((subVocab) => (
                              <li key={subVocab.id}>• {subVocab.value}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

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
