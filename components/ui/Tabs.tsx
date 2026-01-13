'use client';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`rounded-lg px-6 py-2 text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-black text-white dark:bg-white dark:text-black'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-900 dark:text-gray-400 dark:hover:bg-zinc-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
