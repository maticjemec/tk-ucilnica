"use client";

import { SettingsCard } from "@/components/settings/SettingsCard";
import { CheckboxField, SelectField } from "@/components/settings/fields";
import type { ContactSettings, SettingsFieldOptions } from "@/types/settings";

type ContactSettingsCardProps = {
  contact: ContactSettings;
  options: SettingsFieldOptions;
};

export function ContactSettingsCard({
  contact,
  options,
}: ContactSettingsCardProps) {
  return (
    <SettingsCard title="Kontaktne nastavitve">
      <div className="grid grid-cols-1 items-end gap-x-4 gap-y-4 md:grid-cols-3">
        <SelectField
          id="language"
          label="Jezik"
          value={contact.language}
          options={options.language}
          disabled
          onChange={() => undefined}
        />
        <SelectField
          id="timeUnit"
          label="Enote časa"
          value={contact.timeUnit}
          options={options.timeUnit}
          disabled
          onChange={() => undefined}
        />
        <SelectField
          id="timeFormat"
          label="Oblika časa"
          value={contact.timeFormat}
          options={options.timeFormat}
          disabled
          onChange={() => undefined}
        />
      </div>

      <div className="mt-4 max-w-xl">
        <CheckboxField
          id="newsletterOptIn"
          label="Rad/a prejemam e-novice, nasvete in posebne ponudbe."
          description="E-novice še niso povezane."
          checked={contact.newsletterOptIn}
          disabled
          onChange={() => undefined}
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Te nastavitve se trenutno ne shranjujejo.
      </p>
    </SettingsCard>
  );
}
