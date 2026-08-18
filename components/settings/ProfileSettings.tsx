import { AccountCard } from "@/components/settings/AccountCard";
import { ContactSettingsCard } from "@/components/settings/ContactSettingsCard";
import { DeleteAccountCard } from "@/components/settings/DeleteAccountCard";
import { PersonalDataCard } from "@/components/settings/PersonalDataCard";
import { SecurityCard } from "@/components/settings/SecurityCard";
import type { SettingsContent, SettingsTabId } from "@/types/settings";

type ProfileSettingsProps = {
  content: SettingsContent;
  onNavigateTab: (tab: SettingsTabId) => void;
};

export function ProfileSettings({
  content,
  onNavigateTab,
}: ProfileSettingsProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_21.25rem] xl:gap-6">
      <div className="flex min-w-0 flex-col gap-5">
        <PersonalDataCard profile={content.profile} options={content.options} />
        <ContactSettingsCard
          contact={content.contact}
          options={content.options}
        />
      </div>

      <aside className="flex min-w-0 flex-col gap-4">
        <AccountCard
          account={content.account}
          onManageSubscription={() => onNavigateTab("billing")}
        />
        <SecurityCard
          settings={content.security}
          onAction={() => onNavigateTab("security")}
        />
        <DeleteAccountCard />
      </aside>
    </div>
  );
}
