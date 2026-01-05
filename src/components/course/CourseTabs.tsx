import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface CourseTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function CourseTabs({ tabs, activeTab, onTabChange }: CourseTabsProps) {
  return (
    <nav className="border-b border-border/50 bg-card/50 sticky top-14 z-40 backdrop-blur-sm">
      <div className="container px-4 md:px-6">
        <div className="flex overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
