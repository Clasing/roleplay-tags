'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Roleplay } from '@/types/roleplay';
import Tabs from '@/components/ui/Tabs';
import TagsForm from './TagsForm';
import { getLanguages, getRoleplayActivity, getRoleplayActivityByLanguage, Language, RoleplayActivity } from '@/lib/api/skillsApi';

interface RoleplayDetailsProps {
  roleplay: Roleplay;
}

export default function RoleplayDetails({ roleplay }: RoleplayDetailsProps) {
  const [activeTab, setActiveTab] = useState('prompt');
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(roleplay.language || '');
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [roleplayActivity, setRoleplayActivity] = useState<RoleplayActivity | null>(null);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

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
    const loadRoleplayActivity = async () => {
      const roleplayId = roleplay._id || roleplay.id;
      if (!roleplayId) return;

      setIsLoadingActivity(true);
      setActivityError(null);

      try {
        const activityData = selectedLanguage
          ? await getRoleplayActivityByLanguage(roleplayId, selectedLanguage)
          : await getRoleplayActivity(roleplayId);

        if (!activityData) {
          setRoleplayActivity(null);
          setActivityError('No se encontraron etiquetas para este roleplay.');
          return;
        }

        setRoleplayActivity(activityData);
      } catch (error) {
        console.error('Error loading roleplay activity:', error);
        setRoleplayActivity(null);
        setActivityError('Error al cargar la información de contexto.');
      } finally {
        setIsLoadingActivity(false);
      }
    };

    loadRoleplayActivity();
  }, [roleplay._id, roleplay.id, selectedLanguage]);

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

  const resolveLanguageLabel = (languageId?: string) => {
    if (!languageId) {
      if (roleplayActivity?.languageDetail?.name) {
        return roleplayActivity.languageDetail.name;
      }
      if (roleplayActivity?.language) return roleplayActivity.language;
      return 'General';
    }

    const matchById = availableLanguages.find((lang) => lang.id === languageId);
    if (matchById) return matchById.language;

    const matchByName = availableLanguages.find((lang) => lang.language === languageId);
    if (matchByName) return matchByName.language;

    if (roleplayActivity?.languageDetail && roleplayActivity.languageDetail.id === languageId) {
      return roleplayActivity.languageDetail.name;
    }

    return languageId;
  };

  const mapTagDetails = (
    details?: Array<{ id: string; value: string; language?: string; languageId?: string }>,
    fallbackIds: string[] = [],
    defaultLanguageId?: string
  ): TagDisplayItem[] => {
    if (details && details.length > 0) {
      return details.map((item) => ({
        id: item.id,
        value: item.value,
        languageId: item.language ?? item.languageId ?? defaultLanguageId,
      }));
    }

    if (fallbackIds.length > 0) {
      return fallbackIds.map((value) => ({
        id: value,
        value,
        languageId: defaultLanguageId,
      }));
    }

    return [];
  };

  const normalizeThemeTags = (theme: string | string[] | undefined, defaultLanguageId?: string): TagDisplayItem[] => {
    if (!theme) return [];
    const values = Array.isArray(theme) ? theme : [theme];

    return values.map((value) => ({
      id: value,
      value,
      languageId: defaultLanguageId,
    }));
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
                {availableLanguages
                  .filter((lang) => lang.language?.toUpperCase() !== 'DEFAULT')
                  .map((lang) => (
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
            {isLoadingActivity ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black dark:border-zinc-700 dark:border-t-white"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cargando etiquetas del roleplay...</span>
                </div>
              </div>
            ) : roleplayActivity ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Idioma interno
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {resolveLanguageLabel(roleplayActivity.languageDetail?.id ?? roleplayActivity.language)}
                    </p>
                    {roleplayActivity.languageDetail?.name && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Alias: {roleplayActivity.languageDetail.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 rounded-2xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Duración aproximada
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {roleplayActivity.durationAprox ? `${roleplayActivity.durationAprox} min` : 'No especificada'}
                    </p>
                  </div>
                </div>

                <TagListSection
                  title="Temas"
                  description="Temáticas configuradas para este roleplay."
                  items={normalizeThemeTags(
                    roleplayActivity.theme,
                    roleplayActivity.languageDetail?.id ?? roleplayActivity.language
                  )}
                  resolveLanguageLabel={resolveLanguageLabel}
                />

                <TagListSection
                  title="Habilidades principales"
                  description="Skills principales asociadas a la actividad."
                  items={mapTagDetails(
                    roleplayActivity.skillMainDetail,
                    roleplayActivity.skillMain,
                    roleplayActivity.languageDetail?.id ?? roleplayActivity.language
                  )}
                  resolveLanguageLabel={resolveLanguageLabel}
                />

                <TagListSection
                  title="Sub-habilidades"
                  description="Sub-skills detalladas por idioma."
                  items={mapTagDetails(
                    roleplayActivity.subSkillDetail,
                    roleplayActivity.subSkill,
                    roleplayActivity.languageDetail?.id ?? roleplayActivity.language
                  )}
                  resolveLanguageLabel={resolveLanguageLabel}
                />

                <TagListSection
                  title="Gramática"
                  description="Etiquetas de gramática aplicadas."
                  items={mapTagDetails(
                    roleplayActivity.grammarDetail,
                    roleplayActivity.grammar,
                    roleplayActivity.languageDetail?.id ?? roleplayActivity.language
                  )}
                  resolveLanguageLabel={resolveLanguageLabel}
                />

                <TagListSection
                  title="Sub-gramática"
                  description="Etiquetas de sub-gramática asociadas."
                  items={mapTagDetails(
                    roleplayActivity.subGrammarDetail,
                    roleplayActivity.subGrammar,
                    roleplayActivity.languageDetail?.id ?? roleplayActivity.language
                  )}
                  resolveLanguageLabel={resolveLanguageLabel}
                />
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
                  {activityError || 'No se encontró información para este roleplay.'}
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

interface TagDisplayItem {
  id: string;
  value: string;
  languageId?: string;
}

interface TagListSectionProps {
  title: string;
  description?: string;
  items: TagDisplayItem[];
  resolveLanguageLabel: (languageId?: string) => string;
}

function TagListSection({ title, description, items, resolveLanguageLabel }: TagListSectionProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>

      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={`${title}-${item.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
            >
              {item.value}
              <span className="rounded-full bg-gray-900/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                {resolveLanguageLabel(item.languageId)}
              </span>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No hay etiquetas registradas.</p>
      )}
    </div>
  );
}
