'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Roleplay, RoleplayLanguage } from '@/types/roleplay';
import Tabs from '@/components/ui/Tabs';
import TagsForm from './TagsForm';
import { getLanguages, Language } from '@/lib/api/skillsApi';

interface RoleplayDetailsProps {
  roleplay: Roleplay;
}

export default function RoleplayDetails({ roleplay }: RoleplayDetailsProps) {
  const [activeTab, setActiveTab] = useState('prompt');
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(roleplay.language || '');
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [roleplayLanguage, setRoleplayLanguage] = useState<RoleplayLanguage | null>(null);
  const [isLoadingRoleplayLanguage, setIsLoadingRoleplayLanguage] = useState(false);

  useEffect(() => {
    const loadLanguages = async () => {
      setIsLoadingLanguages(true);
      const languages = await getLanguages();
      setAvailableLanguages(languages);
      if (!roleplay.language && languages.length > 0) {
        setSelectedLanguage(languages[0].language);
      }
      setIsLoadingLanguages(false);
    };
    loadLanguages();
  }, [roleplay.language]);

  useEffect(() => {
    const loadRoleplayLanguage = async () => {
      if (!selectedLanguage) return;
      
      const roleId = roleplay.id || roleplay._id;
      
      setIsLoadingRoleplayLanguage(true);
      try {
        const response = await fetch(
          `/api/roleplay-languages?roleId=${roleId}&language=${selectedLanguage}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setRoleplayLanguage(data);
        } else {
          setRoleplayLanguage(null);
        }
      } catch (error) {
        console.error('Error loading roleplay language:', error);
        setRoleplayLanguage(null);
      } finally {
        setIsLoadingRoleplayLanguage(false);
      }
    };
    
    loadRoleplayLanguage();
  }, [selectedLanguage, roleplay._id, roleplay.id]);

  const handleSaveTags = (data: {
    vocabularyTags: string[];
    skillMain: string[];
    subSkill: string[];
    grammar: string[];
    subgrammar: string[];
    language: string;
  }) => {
    console.log('Guardar tags:', data);
  };

  const tabs = [
    { id: 'prompt', label: 'Prompt' },
    { id: 'context', label: 'Context' },
    { id: 'tags', label: 'Tags' },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <div className="flex flex-col gap-6">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl border-2 border-gray-200 shadow-lg dark:border-zinc-800">
          <Image
            src={roleplay.image}
            alt={roleplay.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Información General
          </h3>

          <div className="flex flex-col gap-2 border-b border-gray-100 pb-3 dark:border-zinc-800">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Idioma
            </span>
            {isLoadingLanguages ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-zinc-700 dark:border-t-white"></div>
                <span className="text-sm text-gray-500">Cargando...</span>
              </div>
            ) : (
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 transition-colors focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-600"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang.id} value={lang.language}>
                    {lang.language}
                  </option>
                ))}
              </select>
            )}
          </div>

          {roleplay.languageLevel && (
            <InfoItem label="Nivel" value={roleplay.languageLevel} />
          )}

          {roleplay.isMale !== undefined && (
            <InfoItem label="Género" value={roleplay.isMale ? 'Masculino' : 'Femenino'} />
          )}
        </div>

        {roleplay.description && (
          <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Descripción
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {roleplay.description}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'prompt' && (
          <div className="space-y-6">
            {roleplay.systemPrompt && (
              <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gray-100 p-2 dark:bg-zinc-900">
                    <svg
                      className="h-5 w-5 text-gray-600 dark:text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    System Prompt
                  </h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-black">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {roleplay.systemPrompt}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'context' && (
          <div className="space-y-6">
            {isLoadingRoleplayLanguage ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-zinc-700 dark:border-t-white"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cargando información del idioma...</span>
                </div>
              </div>
            ) : roleplayLanguage ? (
              <>
                {roleplayLanguage.description && (
                  <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-gray-100 p-2 dark:bg-zinc-900">
                        <svg
                          className="h-5 w-5 text-gray-600 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h7"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        Descripción ({selectedLanguage})
                      </h3>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-black">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {roleplayLanguage.description}
                      </pre>
                    </div>
                  </div>
                )}

                {roleplayLanguage.studentContext && (
                  <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-gray-100 p-2 dark:bg-zinc-900">
                        <svg
                          className="h-5 w-5 text-gray-600 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        Contexto del Estudiante ({selectedLanguage})
                      </h3>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-black">
                      <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {roleplayLanguage.studentContext}
                      </pre>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-900">
                  <svg
                    className="h-8 w-8 text-gray-400 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  No hay información disponible
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No se encontró información para el idioma {selectedLanguage}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tags' && (
          <TagsForm 
            roleplay={roleplay} 
            onSave={handleSaveTags}
            selectedLanguage={selectedLanguage}
          />
        )}
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-zinc-800">
      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span className="text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
