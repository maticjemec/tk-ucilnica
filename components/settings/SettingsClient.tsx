"use client";

import { useState } from "react";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import {
  BillingSettings,
  LearningSettings,
  NotificationSettings,
  SecuritySettings,
} from "@/components/settings/SettingsOtherTabs";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import type { SettingsContent, SettingsTabId } from "@/types/settings";

type SettingsClientProps = {
  content: SettingsContent;
};

export function SettingsClient({ content }: SettingsClientProps) {
  const [tab, setTab] = useState<SettingsTabId>("profile");

  return (
    <section>
      <SettingsTabs value={tab} onChange={setTab} />

      <div
        id="settings-panel"
        role="tabpanel"
        aria-labelledby={`settings-tab-${tab}`}
        className="mt-6"
      >
        {tab === "profile" ? (
          <ProfileSettings content={content} onNavigateTab={setTab} />
        ) : null}
        {tab === "learning" ? <LearningSettings content={content} /> : null}
        {tab === "notifications" ? (
          <NotificationSettings content={content} />
        ) : null}
        {tab === "security" ? <SecuritySettings content={content} /> : null}
        {tab === "billing" ? <BillingSettings content={content} /> : null}
      </div>
    </section>
  );
}
