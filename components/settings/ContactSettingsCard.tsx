"use client";

import { useState } from "react";
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
  const [form, setForm] = useState(contact);

  function update<K extends keyof ContactSettings>(
    key: K,
    value: ContactSettings[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <SettingsCard title="Kontaktne nastavitve">
      <div className="grid grid-cols-1 items-end gap-x-4 gap-y-4 md:grid-cols-3">
        <SelectField
          id="language"
          label="Jezik"
          value={form.language}
          options={options.language}
          onChange={(value) => update("language", value)}
        />
        <SelectField
          id="timeUnit"
          label="Enote časa"
          value={form.timeUnit}
          options={options.timeUnit}
          onChange={(value) => update("timeUnit", value)}
        />
        <SelectField
          id="timeFormat"
          label="Oblika časa"
          value={form.timeFormat}
          options={options.timeFormat}
          onChange={(value) => update("timeFormat", value)}
        />
      </div>

      <div className="mt-4 max-w-xl">
        <CheckboxField
          id="newsletterOptIn"
          label="Rad/a prejemam e-novice, nasvete in posebne ponudbe."
          description="Svoje soglasje lahko kadarkoli prekličem."
          checked={form.newsletterOptIn}
          onChange={(checked) => update("newsletterOptIn", checked)}
        />
      </div>
    </SettingsCard>
  );
}
