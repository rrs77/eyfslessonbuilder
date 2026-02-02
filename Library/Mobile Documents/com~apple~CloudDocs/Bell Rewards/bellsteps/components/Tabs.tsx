'use client';

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  children: (activeTab: string) => React.ReactNode;
}

export function Tabs({ tabs, defaultTab, onTabChange, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-6 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div>{children(activeTab)}</div>
    </div>
  );
}
