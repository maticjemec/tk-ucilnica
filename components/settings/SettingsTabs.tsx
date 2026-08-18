"use client";

import { cn } from "@/lib/cn";
import { settingsTabs } from "@/lib/content/settings";
import type { SettingsTabId } from "@/types/settings";

type SettingsTabsProps = {
  value: SettingsTabId;
  onChange: (value: SettingsTabId) => void;
};

export function SettingsTabs({ value, onChange }: SettingsTabsProps) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div
        role="tablist"
        aria-label="Nastavitve"
        className="flex min-w-full gap-6 border-b border-border sm:gap-7"
      >
        {settingsTabs.map((tab) => {
          const selected = value === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`settings-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="settings-panel"
              tabIndex={0}
              className={cn(
                "-mb-px shrink-0 border-b-2 pb-3 text-sm whitespace-nowrap transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                selected
                  ? "border-accent font-medium text-foreground"
                  : "border-transparent text-foreground/70 hover:text-foreground",
              )}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
