'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getSkills, 
  getSubSkills, 
  getGrammarTypes, 
  getSubGrammarTypes,
  getLanguages,
  createLanguage,
  createSkill,
  createSubSkill,
  createGrammarType,
  createSubGrammarType,
  getVocabularies,
  getSubVocabularies,
  createVocabulary,
  createSubVocabulary,
  updateSkill,
  updateSubSkill,
  updateGrammarType,
  updateSubGrammarType,
  updateVocabulary,
  updateSubVocabulary,
  updateLanguage,
  deleteSkill,
  deleteSubSkill,
  deleteGrammarType,
  deleteSubGrammarType,
  deleteVocabulary,
  deleteSubVocabulary,
  deleteLanguage,
  type Skill,
  type SubSkill,
  type GrammarType,
  type SubGrammarType,
  type Language,
  type Vocabulary,
  type SubVocabulary
} from '@/lib/api/skillsApi';
import { useToast } from '@/hooks/useToast';
import ToastStack from '@/components/ui/Toast';

const sortByValue = <T extends { value: string }>(items: T[]) =>
  [...items].sort((a, b) => a.value.localeCompare(b.value, 'es', { sensitivity: 'base' }));

const sortByLanguage = (items: Language[]) =>
  [...items].sort((a, b) => a.language.localeCompare(b.language, 'es', { sensitivity: 'base' }));

interface TagAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'skills' | 'grammar' | 'vocabularies';

type ConfirmState = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void>;
};

export default function TagAdminModal({ isOpen, onClose }: TagAdminModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('skills');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [newLanguageValue, setNewLanguageValue] = useState('');
  
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
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [subVocabularies, setSubVocabularies] = useState<SubVocabulary[]>([]);
  const [selectedVocabulary, setSelectedVocabulary] = useState<string>('');
  const [isAddingVocabulary, setIsAddingVocabulary] = useState(false);
  const [isAddingSubVocabulary, setIsAddingSubVocabulary] = useState(false);
  const [newVocabularyValue, setNewVocabularyValue] = useState('');
  const [newSubVocabularyValue, setNewSubVocabularyValue] = useState('');
  const [searchVocabulary, setSearchVocabulary] = useState('');
  const [searchSubVocabulary, setSearchSubVocabulary] = useState('');
  
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

  // Edit states
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillValue, setEditingSkillValue] = useState('');
  const [editingSkillOriginalValue, setEditingSkillOriginalValue] = useState('');
  const [editingSubSkillId, setEditingSubSkillId] = useState<string | null>(null);
  const [editingSubSkillValue, setEditingSubSkillValue] = useState('');
  const [editingGrammarId, setEditingGrammarId] = useState<string | null>(null);
  const [editingGrammarValue, setEditingGrammarValue] = useState('');
  const [editingGrammarOriginalValue, setEditingGrammarOriginalValue] = useState('');
  const [editingSubGrammarId, setEditingSubGrammarId] = useState<string | null>(null);
  const [editingSubGrammarValue, setEditingSubGrammarValue] = useState('');
  const [editingVocabularyId, setEditingVocabularyId] = useState<string | null>(null);
  const [editingVocabularyValue, setEditingVocabularyValue] = useState('');
  const [editingVocabularyOriginalValue, setEditingVocabularyOriginalValue] = useState('');
  const [editingSubVocabularyId, setEditingSubVocabularyId] = useState<string | null>(null);
  const [editingSubVocabularyValue, setEditingSubVocabularyValue] = useState('');
  const [editingLanguageId, setEditingLanguageId] = useState<string | null>(null);
  const [editingLanguageValue, setEditingLanguageValue] = useState('');
  const [showLanguages, setShowLanguages] = useState(false);

  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const { toasts, pushToast, dismiss } = useToast();

  const loadData = useCallback(async () => {
    const [skillsData, subSkillsData, grammarData, subGrammarData, languagesData, vocabulariesData, subVocabulariesData] = await Promise.all([
      getSkills(),
      getSubSkills(),
      getGrammarTypes(),
      getSubGrammarTypes(),
      getLanguages(),
      getVocabularies(),
      getSubVocabularies()
    ]);
    
    setSkills(sortByValue(skillsData));
    setSubSkills(sortByValue(subSkillsData));
    setGrammarTypes(sortByValue(grammarData));
    setSubGrammarTypes(sortByValue(subGrammarData));
    setLanguages(sortByLanguage(languagesData));
    setVocabularies(sortByValue(vocabulariesData));
    setSubVocabularies(sortByValue(subVocabulariesData));
  }, []);

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

  const filteredSubVocabularies = subVocabularies.filter(sub => {
    const selectedVocabularyId = vocabularies.find(v => v.value === selectedVocabulary)?.id;
    const subVocabParent = (sub as unknown as { vocabulary?: string }).vocabulary ?? sub.vocabularyId;
    const matchesVocabulary = !selectedVocabularyId || subVocabParent === selectedVocabularyId;
    const matchesSearch = sub.value.toLowerCase().includes(searchSubVocabulary.toLowerCase());
    return matchesVocabulary && matchesSearch;
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
      pushToast('warning', 'Selecciona un idioma antes de crear grammar');
      return;
    }
    const success = await createGrammarType(newGrammarValue.trim(), selectedLanguageForGrammar);
    if (success) {
      setNewGrammarValue('');
      setIsAddingGrammar(false);
      await loadData();
    }
  };

  const handleAddLanguage = async () => {
    const value = newLanguageValue.trim();
    if (!value) {
      pushToast('warning', 'Ingresa un idioma');
      return;
    }
    const success = await createLanguage(value);
    if (success) {
      pushToast('success', 'Idioma creado');
      setNewLanguageValue('');
      setIsAddingLanguage(false);
      await loadData();
    } else {
      pushToast('error', 'No se pudo crear el idioma');
    }
  };

  const handleUpdateLanguage = async () => {
    if (!editingLanguageId || !editingLanguageValue.trim()) return;
    const trimmedValue = editingLanguageValue.trim();
    const success = await updateLanguage(editingLanguageId, trimmedValue);
    if (success) {
      setEditingLanguageId(null);
      setEditingLanguageValue('');
      pushToast('success', 'Idioma actualizado');
      await loadData();
    } else {
      pushToast('error', 'No se pudo actualizar el idioma');
    }
  };

  const handleAddSubGrammar = async () => {
    if (!newSubGrammarValue.trim() || !selectedGrammar) return;
    if (!selectedLanguageForGrammar) {
      pushToast('warning', 'Selecciona un idioma antes de crear sub grammar');
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
    if (!newVocabularyValue.trim()) return;
    const success = await createVocabulary(newVocabularyValue.trim());
    if (success) {
      setNewVocabularyValue('');
      setIsAddingVocabulary(false);
      await loadData();
    }
  };

  const handleAddSubVocabulary = async () => {
    if (!newSubVocabularyValue.trim() || !selectedVocabulary) return;
    const vocabularyId = vocabularies.find(v => v.value === selectedVocabulary)?.id;
    if (!vocabularyId) return;
    
    const success = await createSubVocabulary(newSubVocabularyValue.trim(), vocabularyId);
    if (success) {
      setNewSubVocabularyValue('');
      setIsAddingSubVocabulary(false);
      await loadData();
    }
  };

  const handleUpdateSkill = async () => {
    if (!editingSkillId || !editingSkillValue.trim()) return;
    const trimmedValue = editingSkillValue.trim();
    const success = await updateSkill(editingSkillId, trimmedValue);
    if (success) {
      if (selectedSkill === editingSkillOriginalValue) {
        setSelectedSkill(trimmedValue);
      }
      setEditingSkillId(null);
      setEditingSkillValue('');
      setEditingSkillOriginalValue('');
      await loadData();
    }
  };

  const handleUpdateSubSkill = async () => {
    if (!editingSubSkillId || !editingSubSkillValue.trim()) return;
    const trimmedValue = editingSubSkillValue.trim();
    const success = await updateSubSkill(editingSubSkillId, trimmedValue);
    if (success) {
      setEditingSubSkillId(null);
      setEditingSubSkillValue('');
      await loadData();
    }
  };

  const handleUpdateGrammar = async () => {
    if (!editingGrammarId || !editingGrammarValue.trim()) return;
    const trimmedValue = editingGrammarValue.trim();
    const success = await updateGrammarType(editingGrammarId, trimmedValue);
    if (success) {
      if (selectedGrammar === editingGrammarOriginalValue) {
        setSelectedGrammar(trimmedValue);
      }
      setEditingGrammarId(null);
      setEditingGrammarValue('');
      setEditingGrammarOriginalValue('');
      await loadData();
    }
  };

  const handleUpdateSubGrammar = async () => {
    if (!editingSubGrammarId || !editingSubGrammarValue.trim()) return;
    const trimmedValue = editingSubGrammarValue.trim();
    const success = await updateSubGrammarType(editingSubGrammarId, trimmedValue);
    if (success) {
      setEditingSubGrammarId(null);
      setEditingSubGrammarValue('');
      await loadData();
    }
  };

  const handleUpdateVocabulary = async () => {
    if (!editingVocabularyId || !editingVocabularyValue.trim()) return;
    const trimmedValue = editingVocabularyValue.trim();
    const success = await updateVocabulary(editingVocabularyId, trimmedValue);
    if (success) {
      if (selectedVocabulary === editingVocabularyOriginalValue) {
        setSelectedVocabulary(trimmedValue);
      }
      setEditingVocabularyId(null);
      setEditingVocabularyValue('');
      setEditingVocabularyOriginalValue('');
      await loadData();
    }
  };

  const handleUpdateSubVocabulary = async () => {
    if (!editingSubVocabularyId || !editingSubVocabularyValue.trim()) return;
    const trimmedValue = editingSubVocabularyValue.trim();
    const success = await updateSubVocabulary(editingSubVocabularyId, trimmedValue);
    if (success) {
      setEditingSubVocabularyId(null);
      setEditingSubVocabularyValue('');
      await loadData();
    }
  };

  const closeConfirm = useCallback(() => setConfirmState(null), []);

  const acceptConfirm = useCallback(async () => {
    if (!confirmState) return;
    await confirmState.onConfirm();
    closeConfirm();
  }, [confirmState, closeConfirm]);

  const handleDeleteSkill = async (id: string, value: string) => {
    setConfirmState({
      title: 'Eliminar skill',
      message: `¿Seguro que quieres eliminar "${value}"?`,
      onConfirm: async () => {
        const success = await deleteSkill(id);
        if (success) {
          if (selectedSkill === value) setSelectedSkill('');
          pushToast('success', 'Skill eliminada');
          await loadData();
        } else {
          pushToast('error', 'No se pudo eliminar el skill');
        }
      }
    });
  };

  const handleDeleteSubSkill = async (id: string, value: string) => {
    setConfirmState({
      title: 'Eliminar sub skill',
      message: `¿Seguro que quieres eliminar "${value}"?`,
      onConfirm: async () => {
        const success = await deleteSubSkill(id);
        if (success) {
          pushToast('success', 'Sub skill eliminada');
          await loadData();
        } else {
          pushToast('error', 'No se pudo eliminar el sub skill');
        }
      }
    });
  };

  const handleDeleteGrammar = async (id: string, value: string) => {
    setConfirmState({
      title: 'Eliminar grammar',
      message: `¿Seguro que quieres eliminar "${value}"?`,
      onConfirm: async () => {
        const success = await deleteGrammarType(id);
        if (success) {
          if (selectedGrammar === value) setSelectedGrammar('');
          pushToast('success', 'Grammar eliminada');
          await loadData();
        } else {
          pushToast('error', 'No se pudo eliminar la grammar');
        }
      }
    });
  };

  const handleDeleteSubGrammar = async (id: string, value: string) => {
    setConfirmState({
      title: 'Eliminar sub grammar',
      message: `¿Seguro que quieres eliminar "${value}"?`,
      onConfirm: async () => {
        const success = await deleteSubGrammarType(id);
        if (success) {
          pushToast('success', 'Sub grammar eliminada');
          await loadData();
        } else {
          pushToast('error', 'No se pudo eliminar la sub grammar');
        }
      }
    });
  };

  const handleDeleteVocabulary = async (id: string, value: string) => {
    setConfirmState({
      title: 'Eliminar vocabulary',
      message: `¿Seguro que quieres eliminar "${value}"?`,
      onConfirm: async () => {
        const success = await deleteVocabulary(id);
        if (success) {
          if (selectedVocabulary === value) setSelectedVocabulary('');
          pushToast('success', 'Vocabulary eliminado');
          await loadData();
        } else {
          pushToast('error', 'No se pudo eliminar el vocabulary');
        }
      }
    });
  };

  const handleDeleteLanguage = async (id: string, value: string) => {
    setConfirmState({
      title: 'Eliminar idioma',
      message: `¿Seguro que quieres eliminar "${value}"?`,
      onConfirm: async () => {
        const success = await deleteLanguage(id);
        if (success) {
          if (selectedLanguageForGrammar === id) setSelectedLanguageForGrammar('');
          pushToast('success', 'Idioma eliminado');
          await loadData();
        } else {
          pushToast('error', 'No se pudo eliminar el idioma');
        }
      }
    });
  };

  const handleDeleteSubVocabulary = async (id: string, value: string) => {
    setConfirmState({
      title: 'Eliminar sub vocabulary',
      message: `¿Seguro que quieres eliminar "${value}"?`,
      onConfirm: async () => {
        const success = await deleteSubVocabulary(id);
        if (success) {
          pushToast('success', 'Sub vocabulary eliminado');
          await loadData();
        } else {
          pushToast('error', 'No se pudo eliminar el sub vocabulary');
        }
      }
    });
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'unset';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }

    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loadData]);

  if (!isOpen) return null;

  return (
    <>
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
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Left: Vocabulary Main */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-black dark:text-white">Vocabulary Main</h3>
                  <button
                    onClick={() => setIsAddingVocabulary(true)}
                    className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo</span>
                  </button>
                </div>

                {/* Add new vocabulary form */}
                {isAddingVocabulary && (
                  <div className="rounded-2xl border-2 border-black bg-white p-5 dark:border-white dark:bg-black">
                    <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                      Nuevo Vocabulary Main
                    </label>
                    <input
                      type="text"
                      value={newVocabularyValue}
                      onChange={(e) => setNewVocabularyValue(e.target.value)}
                      placeholder="Ej: Business Meeting, Daily Routines..."
                      className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddVocabulary()}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddVocabulary}
                        className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingVocabulary(false);
                          setNewVocabularyValue('');
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Search vocabularies */}
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
                    value={searchVocabulary}
                    onChange={(e) => setSearchVocabulary(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>

                {/* Vocabularies list */}
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  {vocabularies
                    .filter(vocab => vocab.value.toLowerCase().includes(searchVocabulary.toLowerCase()))
                    .map(vocab => {
                      const isSelected = selectedVocabulary === vocab.value;
                      const isEditing = editingVocabularyId === vocab.id;

                      if (isEditing) {
                        return (
                          <div
                            key={vocab.id}
                            className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black"
                          >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Editar Vocabulary
                            </label>
                            <input
                              type="text"
                              value={editingVocabularyValue}
                              onChange={(e) => setEditingVocabularyValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateVocabulary()}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                              autoFocus
                            />
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={handleUpdateVocabulary}
                                className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => {
                                  setEditingVocabularyId(null);
                                  setEditingVocabularyValue('');
                                  setEditingVocabularyOriginalValue('');
                                }}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-800"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={vocab.id} className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedVocabulary(vocab.value)}
                            className={`group w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{vocab.value}</span>
                              {isSelected && (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setEditingVocabularyId(vocab.id);
                              setEditingVocabularyValue(vocab.value);
                              setEditingVocabularyOriginalValue(vocab.value);
                            }}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteVocabulary(vocab.id, vocab.value)}
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition-all hover:border-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-zinc-900 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-950"
                          >
                            Eliminar
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Right: Sub Vocabularies */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold tracking-tight text-black dark:text-white">Sub Vocabularies</h3>
                  <button
                    onClick={() => setIsAddingSubVocabulary(true)}
                    disabled={!selectedVocabulary}
                    className="group flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-black transition-all hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo</span>
                  </button>
                </div>

                {/* Add new sub vocabulary form */}
                {isAddingSubVocabulary && (
                  <div className="rounded-2xl border-2 border-black bg-white p-5 dark:border-white dark:bg-black">
                    <label className="mb-3 block text-sm font-semibold text-black dark:text-white">
                      Nuevo Sub Vocabulary para: <span className="underline decoration-2 underline-offset-2">{selectedVocabulary}</span>
                    </label>
                    <input
                      type="text"
                      value={newSubVocabularyValue}
                      onChange={(e) => setNewSubVocabularyValue(e.target.value)}
                      placeholder="Ej: Icebreaker, Agenda review..."
                      className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubVocabulary()}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddSubVocabulary}
                        className="flex-1 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingSubVocabulary(false);
                          setNewSubVocabularyValue('');
                        }}
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-900"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Search sub vocabularies */}
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
                    value={searchSubVocabulary}
                    onChange={(e) => setSearchSubVocabulary(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-black placeholder:text-gray-400 transition-all focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                  />
                </div>

                {/* Sub vocabularies list */}
                <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  {filteredSubVocabularies.length > 0 ? (
                    filteredSubVocabularies.map(subVocab => {
                      const isEditing = editingSubVocabularyId === subVocab.id;

                      if (isEditing) {
                        return (
                          <div
                            key={subVocab.id}
                            className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black"
                          >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Editar Sub Vocabulary
                            </label>
                            <input
                              type="text"
                              value={editingSubVocabularyValue}
                              onChange={(e) => setEditingSubVocabularyValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateSubVocabulary()}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                              autoFocus
                            />
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={handleUpdateSubVocabulary}
                                className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSubVocabularyId(null);
                                  setEditingSubVocabularyValue('');
                                }}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-800"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={subVocab.id}
                          className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        >
                          <span className="text-sm font-medium text-black dark:text-white">
                            {subVocab.value}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingSubVocabularyId(subVocab.id);
                                setEditingSubVocabularyValue(subVocab.value);
                              }}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteSubVocabulary(subVocab.id, subVocab.value)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition-all hover:border-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-zinc-900 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-950"
                            >
                              Eliminar
                            </button>
                          </div>
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        {selectedVocabulary ? 'No hay sub vocabularies para este filtro' : 'Selecciona un vocabulary main'}
                      </p>
                    </div>
                  )}
                </div>
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
                    .map(skill => {
                      const isSelected = selectedSkill === skill.value;
                      const isEditing = editingSkillId === skill.id;

                      if (isEditing) {
                        return (
                          <div
                            key={skill.id}
                            className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black"
                          >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Editar Skill
                            </label>
                            <input
                              type="text"
                              value={editingSkillValue}
                              onChange={(e) => setEditingSkillValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateSkill()}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                              autoFocus
                            />
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={handleUpdateSkill}
                                className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSkillId(null);
                                  setEditingSkillValue('');
                                  setEditingSkillOriginalValue('');
                                }}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-800"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={skill.id} className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSkill(skill.value)}
                            className={`group w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{skill.value}</span>
                              {isSelected && (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setEditingSkillId(skill.id);
                              setEditingSkillValue(skill.value);
                              setEditingSkillOriginalValue(skill.value);
                            }}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id, skill.value)}
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition-all hover:border-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-zinc-900 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-950"
                          >
                            Eliminar
                          </button>
                        </div>
                      );
                    })}
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
                    filteredSubSkills.map(subSkill => {
                      const isEditing = editingSubSkillId === subSkill.id;

                      if (isEditing) {
                        return (
                          <div
                            key={subSkill.id}
                            className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black"
                          >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Editar Sub Skill
                            </label>
                            <input
                              type="text"
                              value={editingSubSkillValue}
                              onChange={(e) => setEditingSubSkillValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateSubSkill()}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                              autoFocus
                            />
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={handleUpdateSubSkill}
                                className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSubSkillId(null);
                                  setEditingSubSkillValue('');
                                }}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-800"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={subSkill.id}
                          className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        >
                          <span className="text-sm font-medium text-black dark:text-white">
                            {subSkill.value}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingSubSkillId(subSkill.id);
                                setEditingSubSkillValue(subSkill.value);
                              }}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteSubSkill(subSkill.id, subSkill.value)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition-all hover:border-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-zinc-900 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-950"
                            >
                              Eliminar
                            </button>
                          </div>
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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

                  <button
                    onClick={() => setIsAddingLanguage((prev) => !prev)}
                    className="whitespace-nowrap rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-black dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                  >
                    {isAddingLanguage ? 'Cerrar' : 'Nuevo idioma'}
                  </button>
                </div>

                {isAddingLanguage && (
                  <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
                    <input
                      type="text"
                      value={newLanguageValue}
                      onChange={(e) => setNewLanguageValue(e.target.value)}
                      placeholder="Ej: English, Español"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage()}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-white dark:focus:ring-white/10"
                    />
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        onClick={handleAddLanguage}
                        className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99] dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      >
                        Guardar idioma
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingLanguage(false);
                          setNewLanguageValue('');
                        }}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:border-white dark:hover:bg-zinc-800"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2 rounded-2xl border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-black/50">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-black dark:text-white">Idiomas disponibles</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{languages.length} idiomas</span>
                    </div>
                    <button
                      onClick={() => setShowLanguages((prev) => !prev)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-black dark:text-gray-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                    >
                      {showLanguages ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>

                  {showLanguages && (
                    <>
                      {languages.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">Aún no tienes idiomas creados.</p>
                      )}

                      {languages.map((lang) => {
                        const isEditing = editingLanguageId === lang.id;
                        const isSelected = selectedLanguageForGrammar === lang.id;

                        if (isEditing) {
                          return (
                            <div
                              key={lang.id}
                              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                            >
                              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                Editar idioma
                              </label>
                              <input
                                type="text"
                                value={editingLanguageValue}
                                onChange={(e) => setEditingLanguageValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateLanguage()}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-black dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                                autoFocus
                              />
                              <div className="mt-3 flex gap-2">
                                <button
                                  onClick={handleUpdateLanguage}
                                  className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingLanguageId(null);
                                    setEditingLanguageValue('');
                                  }}
                                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-900"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={lang.id}
                            className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
                          >
                            <button
                              onClick={() => setSelectedLanguageForGrammar(lang.id)}
                              className={`flex-1 text-left font-medium transition ${
                                isSelected
                                  ? 'text-black underline decoration-2 underline-offset-4 dark:text-white'
                                  : 'text-gray-800 hover:text-black dark:text-gray-200 dark:hover:text-white'
                              }`}
                            >
                              {lang.language}
                              {isSelected && <span className="ml-2 inline-flex rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase text-white dark:bg-white dark:text-black">Seleccionado</span>}
                            </button>
                            <button
                              onClick={() => {
                                setEditingLanguageId(lang.id);
                                setEditingLanguageValue(lang.language);
                              }}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-600 transition hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-black dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteLanguage(lang.id, lang.language)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:border-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-zinc-900 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-950"
                            >
                              Eliminar
                            </button>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
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
                    .map(grammar => {
                      const isSelected = selectedGrammar === grammar.value;
                      const isEditing = editingGrammarId === grammar.id;

                      if (isEditing) {
                        return (
                          <div
                            key={grammar.id}
                            className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black"
                          >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Editar Grammar
                            </label>
                            <input
                              type="text"
                              value={editingGrammarValue}
                              onChange={(e) => setEditingGrammarValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateGrammar()}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                              autoFocus
                            />
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={handleUpdateGrammar}
                                className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => {
                                  setEditingGrammarId(null);
                                  setEditingGrammarValue('');
                                  setEditingGrammarOriginalValue('');
                                }}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-800"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={grammar.id} className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedGrammar(grammar.value)}
                            className={`group w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                              isSelected
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100 dark:bg-zinc-900 dark:text-gray-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{grammar.value}</span>
                              {isSelected && (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setEditingGrammarId(grammar.id);
                              setEditingGrammarValue(grammar.value);
                              setEditingGrammarOriginalValue(grammar.value);
                            }}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteGrammar(grammar.id, grammar.value)}
                            className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition-all hover:border-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-zinc-900 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-950"
                          >
                            Eliminar
                          </button>
                        </div>
                      );
                    })}
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
                      const isEditing = editingSubGrammarId === subGrammar.id;

                      if (isEditing) {
                        return (
                          <div
                            key={subGrammar.id}
                            className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black"
                          >
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                              Editar Sub Grammar
                            </label>
                            <input
                              type="text"
                              value={editingSubGrammarValue}
                              onChange={(e) => setEditingSubGrammarValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUpdateSubGrammar()}
                              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white/10"
                              autoFocus
                            />
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={handleUpdateSubGrammar}
                                className="flex-1 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSubGrammarId(null);
                                  setEditingSubGrammarValue('');
                                }}
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-black hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-zinc-800"
                              >
                                Cancelar
                              </button>
                            </div>
                            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                              Idioma actual: <span className="font-semibold text-gray-700 dark:text-gray-200">{language?.language || 'Sin idioma'}</span>
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={subGrammar.id}
                          className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-4 py-3 transition-colors hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-black dark:text-white">{subGrammar.value}</span>
                            <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300">
                              {language?.language || 'Sin idioma'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingSubGrammarId(subGrammar.id);
                                setEditingSubGrammarValue(subGrammar.value);
                              }}
                              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600 transition-all hover:border-black hover:bg-black hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteSubGrammar(subGrammar.id, subGrammar.value)}
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition-all hover:border-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:bg-zinc-900 dark:text-red-300 dark:hover:border-red-500 dark:hover:bg-red-950"
                            >
                              Eliminar
                            </button>
                          </div>
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

    <ToastStack toasts={toasts} onDismiss={dismiss} />

    {confirmState && (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-lg font-semibold text-black dark:text-white">{confirmState.title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{confirmState.message}</p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={closeConfirm}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200 dark:hover:border-white dark:hover:bg-zinc-800"
            >
              {confirmState.cancelLabel || 'Cancelar'}
            </button>
            <button
              onClick={acceptConfirm}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.99]"
            >
              {confirmState.confirmLabel || 'Eliminar'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
