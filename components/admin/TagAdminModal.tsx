'use client';

import { useState, useEffect } from 'react';
import { 
  getSkills, 
  getSubSkills, 
  getGrammarTypes, 
  getSubGrammarTypes,
  getLanguages,
  createSkill,
  createSubSkill,
  createGrammarType,
  createSubGrammarType,
  getVocabularies,
  createVocabulary,
  type Skill,
  type SubSkill,
  type GrammarType,
  type SubGrammarType,
  type Language,
  type VocabularySet
} from '@/lib/api/skillsApi';

interface TagAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'skills' | 'grammar' | 'vocabularies';

export default function TagAdminModal({ isOpen, onClose }: TagAdminModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('skills');
  const [languages, setLanguages] = useState<Language[]>([]);
  
  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [subSkills, setSubSkills] = useState<SubSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  
  // Grammar state
  const [grammarTypes, setGrammarTypes] = useState<GrammarType[]>([]);
  const [subGrammarTypes, setSubGrammarTypes] = useState<SubGrammarType[]>([]);
  const [selectedGrammar, setSelectedGrammar] = useState<string>('');
  const [selectedLanguageForGrammar, setSelectedLanguageForGrammar] = useState<string>('');
  
  // Vocabulary state
  const [vocabularies, setVocabularies] = useState<VocabularySet[]>([]);
  const [isAddingVocabulary, setIsAddingVocabulary] = useState(false);
  const [newVocabularyItems, setNewVocabularyItems] = useState<string[]>(['']);
  const [newSubVocabularyItems, setNewSubVocabularyItems] = useState<string[]>(['']);
  
  // Add new states
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isAddingSubSkill, setIsAddingSubSkill] = useState(false);
  const [isAddingGrammar, setIsAddingGrammar] = useState(false);
  const [isAddingSubGrammar, setIsAddingSubGrammar] = useState(false);
  
  const [newSkillValue, setNewSkillValue] = useState('');
  const [newSubSkillValue, setNewSubSkillValue] = useState('');
  const [newGrammarValue, setNewGrammarValue] = useState('');
  const [newSubGrammarValue, setNewSubGrammarValue] = useState('');
  
  const [searchSkill, setSearchSkill] = useState('');
  const [searchSubSkill, setSearchSubSkill] = useState('');
  const [searchGrammar, setSearchGrammar] = useState('');
  const [searchSubGrammar, setSearchSubGrammar] = useState('');

  const loadData = async () => {
    const [skillsData, subSkillsData, grammarData, subGrammarData, languagesData, vocabulariesData] = await Promise.all([
      getSkills(),
      getSubSkills(),
      getGrammarTypes(),
      getSubGrammarTypes(),
      getLanguages(),
      getVocabularies()
    ]);
    
    setSkills(skillsData);
    setSubSkills(subSkillsData);
    setGrammarTypes(grammarData);
    setSubGrammarTypes(subGrammarData);
    setLanguages(languagesData);
    setVocabularies(vocabulariesData);
  };

  useEffect(() => {
    if (isOpen) {
      // Load data when modal opens
      (async () => {
        await loadData();
      })();
    }
  }, [isOpen]);

  const filteredSubSkills = subSkills.filter(sub => {
    const selectedSkillId = skills.find(s => s.value === selectedSkill)?.id;
    const matchesSkill = !selectedSkillId || sub.skill === selectedSkillId;
    const matchesSearch = sub.value.toLowerCase().includes(searchSubSkill.toLowerCase());
    return matchesSkill && matchesSearch;
  });

  const filteredSubGrammar = subGrammarTypes.filter(sub => {
    const selectedGrammarId = grammarTypes.find(g => g.value === selectedGrammar)?.id;
    const matchesGrammar = !selectedGrammarId || sub.grammar === selectedGrammarId;
    const matchesLanguage = !selectedLanguageForGrammar || 
      sub.languageId === selectedLanguageForGrammar || 
      sub.language === selectedLanguageForGrammar;
    const matchesSearch = sub.value.toLowerCase().includes(searchSubGrammar.toLowerCase());
    return matchesGrammar && matchesLanguage && matchesSearch;
  });

  const handleAddSkill = async () => {
    if (!newSkillValue.trim()) return;
    const success = await createSkill(newSkillValue.trim());
    if (success) {
      setNewSkillValue('');
      setIsAddingSkill(false);
      await loadData();
    }
  };

  const handleAddSubSkill = async () => {
    if (!newSubSkillValue.trim() || !selectedSkill) return;
    const skillId = skills.find(s => s.value === selectedSkill)?.id;
    if (!skillId) return;
    
    const success = await createSubSkill(newSubSkillValue.trim(), skillId);
    if (success) {
      setNewSubSkillValue('');
      setIsAddingSubSkill(false);
      await loadData();
    }
  };

  const handleAddGrammar = async () => {
    if (!newGrammarValue.trim()) return;
    if (!selectedLanguageForGrammar) {
      alert('Por favor selecciona un idioma');
      return;
    }
    const success = await createGrammarType(newGrammarValue.trim(), selectedLanguageForGrammar);
    if (success) {
      setNewGrammarValue('');
      setIsAddingGrammar(false);
      await loadData();
    }
  };

  const handleAddSubGrammar = async () => {
    if (!newSubGrammarValue.trim() || !selectedGrammar) return;
    if (!selectedLanguageForGrammar) {
      alert('Por favor selecciona un idioma');
      return;
    }
    const grammarId = grammarTypes.find(g => g.value === selectedGrammar)?.id;
    if (!grammarId) return;
    
    const success = await createSubGrammarType(newSubGrammarValue.trim(), grammarId, selectedLanguageForGrammar);
    if (success) {
      setNewSubGrammarValue('');
      setIsAddingSubGrammar(false);
      await loadData();
    }
  };

  const handleAddVocabulary = async () => {
    const vocabulary = newVocabularyItems.filter(item => item.trim() !== '');
    const subVocabulary = newSubVocabularyItems.filter(item => item.trim() !== '');
    
    if (vocabulary.length === 0) {
      alert('Debes agregar al menos un término de vocabulario');
      return;
    }
    
    const result = await createVocabulary({ vocabulary, subVocabulary });
    if (result) {
      setNewVocabularyItems(['']);
      setNewSubVocabularyItems(['']);
      setIsAddingVocabulary(false);
      await loadData();
      alert('Vocabulario creado exitosamente');
    } else {
      alert('Error al crear el vocabulario');
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Bloquear scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop con blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container - mismo tamaño que Modal.tsx */}
      <div className="relative z-10 flex h-[92vh] w-full max-w-[95vw] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 dark:border-zinc-800 dark:bg-black lg:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-zinc-800 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 p-2 dark:from-purple-950 dark:to-blue-950 sm:rounded-xl sm:p-2.5">
              <svg
                className="h-5 w-5 text-purple-600 dark:text-purple-400 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-black dark:text-white sm:text-xl lg:text-2xl">
              Administrar Tags
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-all hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-zinc-800 dark:bg-black dark:text-gray-400 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
            aria-label="Cerrar modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white px-4 dark:border-zinc-800 dark:bg-black sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('skills')}
              className={`group relative px-4 py-3 text-sm font-semibold transition-all sm:px-6 sm:py-3.5 ${
                activeTab === 'skills'
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <span className="relative z-10">Skills</span>
              {activeTab === 'skills' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('grammar')}
              className={`group relative px-4 py-3 text-sm font-semibold transition-all sm:px-6 sm:py-3.5 ${
                activeTab === 'grammar'
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <span className="relative z-10">Grammar</span>
              {activeTab === 'grammar' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('vocabularies')}
              className={`group relative px-4 py-3 text-sm font-semibold transition-all sm:px-6 sm:py-3.5 ${
                activeTab === 'vocabularies'
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <span className="relative z-10">Vocabularios</span>
              {activeTab === 'vocabularies' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50 p-4 pb-16 dark:from-black dark:to-zinc-950 sm:p-6 lg:p-8">
          {activeTab === 'vocabularies' ? (
            /* Vocabularies Tab */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold tracking-tight text-black dark:text-white">Vocabularios</h3>
                <button
                  onClick={() => setIsAddingVocabulary(true)}
                  className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Nuevo Vocabulario</span>
                </button>
              </div>

              {/* Add new vocabulary form */}
              {isAddingVocabulary && (
                <div className="rounded-2xl border-2 border-black bg-white p-5 dark:border-white dark:bg-black">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                        Términos de Vocabulario <span className="text-red-500">*</span>
                      </label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        Agrega los términos principales del vocabulario (ej: book, pen, desk)
                      </p>
                      {newVocabularyItems.map((item, index) => (
                        <div key={index} className="mb-2 flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...newVocabularyItems];
                              updated[index] = e.target.value;
                              setNewVocabularyItems(updated);
                            }}
                            placeholder="Término de vocabulario"
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                          />
                          {newVocabularyItems.length > 1 && (
                            <button
                              onClick={() => {
                                const updated = newVocabularyItems.filter((_, i) => i !== index);
                                setNewVocabularyItems(updated);
                              }}
                              className="rounded-lg border border-gray-300 bg-white px-3 text-gray-500 transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-500 dark:border-zinc-700 dark:bg-black dark:hover:border-red-500 dark:hover:bg-red-950"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setNewVocabularyItems([...newVocabularyItems, ''])}
                        className="mt-2 text-sm text-black underline hover:no-underline dark:text-white"
                      >
                        + Agregar término
                      </button>
                    </div>

                    <div>
                      <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                        Ejemplos / Frases
                      </label>
                      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        Agrega frases de ejemplo (ej: &quot;I have a book&quot;, &quot;Where is my pen?&quot;)
                      </p>
                      {newSubVocabularyItems.map((item, index) => (
                        <div key={index} className="mb-2 flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...newSubVocabularyItems];
                              updated[index] = e.target.value;
                              setNewSubVocabularyItems(updated);
                            }}
                            placeholder="Frase de ejemplo"
                            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                          />
                          {newSubVocabularyItems.length > 1 && (
                            <button
                              onClick={() => {
                                const updated = newSubVocabularyItems.filter((_, i) => i !== index);
                                setNewSubVocabularyItems(updated);
                              }}
                              className="rounded-lg border border-gray-300 bg-white px-3 text-gray-500 transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-500 dark:border-zinc-700 dark:bg-black dark:hover:border-red-500 dark:hover:bg-red-950"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => setNewSubVocabularyItems([...newSubVocabularyItems, ''])}
                        className="mt-2 text-sm text-black underline hover:no-underline dark:text-white"
                      >
                        + Agregar frase
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddVocabulary}
                        className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Guardar Vocabulario
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingVocabulary(false);
                          setNewVocabularyItems(['']);
                          setNewSubVocabularyItems(['']);
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Vocabularies list */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {vocabularies.length === 0 ? (
                  <div className="col-span-full py-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300 dark:text-zinc-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      No hay vocabularios creados. Crea uno nuevo para comenzar.
                    </p>
                  </div>
                ) : (
                  vocabularies.map((vocab) => (
                    <div
                      key={vocab.id}
                      className="rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-black dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-white"
                    >
                      <div className="space-y-3">
                        <div>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Vocabulario
                          </div>
                          <ul className="space-y-1">
                            {vocab.vocabulary.map((item, idx) => (
                              <li key={idx} className="text-sm text-black dark:text-white">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {vocab.subVocabulary.length > 0 && (
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Ejemplos
                            </div>
                            <ul className="space-y-1">
                              {vocab.subVocabulary.map((item, idx) => (
                                <li key={idx} className="text-sm italic text-gray-600 dark:text-gray-300">
                                  &ldquo;{item}&rdquo;
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === 'skills' ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left: Skill Main */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-black dark:text-white">Skill Main</h3>
                  <button
                    onClick={() => setIsAddingSkill(true)}
                    className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo</span>
                  </button>
                </div>

                {/* Add new skill form */}
                {isAddingSkill && (
                  <div className="rounded-2xl border-2 border-black bg-white p-5 dark:border-white dark:bg-black">
                    <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                      Nuevo Skill Main
                    </label>
                    <input
                      type="text"
                      value={newSkillValue}
                      onChange={(e) => setNewSkillValue(e.target.value)}
                      placeholder="Ej: speaking, writing..."
                      className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddSkill}
                        className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingSkill(false);
                          setNewSkillValue('');
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Search skills */}
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchSkill}
                    onChange={(e) => setSearchSkill(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>

                {/* Skills list */}
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  {skills
                    .filter(skill => skill.value.toLowerCase().includes(searchSkill.toLowerCase()))
                    .map(skill => (
                      <button
                        key={skill.id}
                        onClick={() => setSelectedSkill(skill.value)}
                        className={`group w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                          selectedSkill === skill.value
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{skill.value}</span>
                          {selectedSkill === skill.value && (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Right: Sub Skills */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-black dark:text-white">Sub Skills</h3>
                  <button
                    onClick={() => setIsAddingSubSkill(true)}
                    disabled={!selectedSkill}
                    className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo</span>
                  </button>
                </div>

                {/* Add new sub skill form */}
                {isAddingSubSkill && (
                  <div className="rounded-2xl border-2 border-black bg-white p-5 dark:border-white dark:bg-black">
                    <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                      Nuevo Sub Skill para: <span className="underline decoration-2 underline-offset-2">{selectedSkill}</span>
                    </label>
                    <input
                      type="text"
                      value={newSubSkillValue}
                      onChange={(e) => setNewSubSkillValue(e.target.value)}
                      placeholder="Ej: pronunciation, fluency..."
                      className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubSkill()}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddSubSkill}
                        className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingSubSkill(false);
                          setNewSubSkillValue('');
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Search sub skills */}
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchSubSkill}
                    onChange={(e) => setSearchSubSkill(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>

                {/* Sub skills list */}
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  {filteredSubSkills.length > 0 ? (
                    filteredSubSkills.map(subSkill => (
                      <div
                        key={subSkill.id}
                        className="rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                      >
                        <span className="text-sm font-medium text-black dark:text-white">
                          {subSkill.value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300 dark:text-zinc-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {selectedSkill ? 'No hay sub skills para este filtro' : 'Selecciona un skill main'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* General Language Selector */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                  Seleccionar Idioma <span className="text-red-500">*</span>
                </label>
                <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                  Este idioma se aplicará tanto a las Grammar principales como a las Sub Grammar que crees.
                </p>
                <select
                  value={selectedLanguageForGrammar}
                  onChange={(e) => setSelectedLanguageForGrammar(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                >
                  <option value="">Seleccionar idioma</option>
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>
                      {lang.language}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left: Grammar Main */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-black dark:text-white">Grammar Main</h3>
                  <button
                    onClick={() => setIsAddingGrammar(true)}
                    className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo</span>
                  </button>
                </div>

                {/* Add new grammar form */}
                {isAddingGrammar && (
                  <div className="rounded-2xl border-2 border-black bg-white p-5 dark:border-white dark:bg-black">
                    <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                      Nuevo Grammar Main
                    </label>
                    <input
                      type="text"
                      value={newGrammarValue}
                      onChange={(e) => setNewGrammarValue(e.target.value)}
                      placeholder="Ej: present, past..."
                      className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddGrammar()}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddGrammar}
                        className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingGrammar(false);
                          setNewGrammarValue('');
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Search grammar */}
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchGrammar}
                    onChange={(e) => setSearchGrammar(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>

                {/* Grammar list */}
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  {grammarTypes
                    .filter(grammar => grammar.value.toLowerCase().includes(searchGrammar.toLowerCase()))
                    .map(grammar => (
                      <button
                        key={grammar.id}
                        onClick={() => setSelectedGrammar(grammar.value)}
                        className={`group w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                          selectedGrammar === grammar.value
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{grammar.value}</span>
                          {selectedGrammar === grammar.value && (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              {/* Right: Sub Grammar */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-black dark:text-white">Sub Grammar</h3>
                  <button
                    onClick={() => setIsAddingSubGrammar(true)}
                    disabled={!selectedGrammar}
                    className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo</span>
                  </button>
                </div>

                {/* Add new sub grammar form */}
                {isAddingSubGrammar && (
                  <div className="rounded-2xl border-2 border-black bg-white p-5 dark:border-white dark:bg-black">
                    <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                      Nuevo Sub Grammar para: <span className="underline decoration-2 underline-offset-2">{selectedGrammar}</span>
                    </label>
                    <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                      Se usará el idioma seleccionado arriba: <strong>{languages.find(l => l.id === selectedLanguageForGrammar)?.language || 'Ninguno'}</strong>
                    </p>
                    <input
                      type="text"
                      value={newSubGrammarValue}
                      onChange={(e) => setNewSubGrammarValue(e.target.value)}
                      placeholder="Ej: simple, continuous..."
                      className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubGrammar()}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddSubGrammar}
                        className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingSubGrammar(false);
                          setNewSubGrammarValue('');
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Search sub grammar */}
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchSubGrammar}
                    onChange={(e) => setSearchSubGrammar(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>

                {/* Sub grammar list */}
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  {filteredSubGrammar.length > 0 ? (
                    filteredSubGrammar.map(subGrammar => {
                      const language = languages.find(l => l.id === subGrammar.languageId || l.id === subGrammar.language);
                      return (
                        <div
                          key={subGrammar.id}
                          className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        >
                          <span className="text-sm font-medium text-black dark:text-white">
                            {subGrammar.value}
                          </span>
                          <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300">
                            {language?.language || 'Sin idioma'}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-300 dark:text-zinc-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {selectedGrammar ? 'No hay sub grammar para este filtro' : 'Selecciona un grammar main'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
