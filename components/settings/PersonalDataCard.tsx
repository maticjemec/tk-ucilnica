"use client";

import { SettingsCard } from "@/components/settings/SettingsCard";
import { DateField, SelectField, TextField } from "@/components/settings/fields";
import type { SettingsFieldOptions, UserProfile } from "@/types/settings";

type PersonalDataCardProps = {
  profile: UserProfile;
  options: SettingsFieldOptions;
};

export function PersonalDataCard({ profile, options }: PersonalDataCardProps) {
  return (
    <SettingsCard title="Osebni podatki">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
        <div className="flex w-[5.75rem] shrink-0 flex-col items-start gap-2">
          <div className="relative size-[5.75rem]">
            <span
              className="flex size-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_36%_30%,var(--canvas),var(--warning-soft)_52%,color-mix(in_srgb,var(--accent-soft)_42%,white))] text-[1.2rem] font-medium tracking-[0.06em] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-accent/20"
              aria-label={`Profilna slika ni nastavljena. Začetnici ${profile.initials}.`}
              role="img"
            >
              {profile.initials}
            </span>
          </div>
          <p className="text-[0.6875rem] leading-snug text-muted">
            Nalaganje slike pride kasneje.
          </p>
        </div>

        <div className="grid min-w-0 flex-1 grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 md:pt-0.5">
          <TextField
            id="firstName"
            label="Ime"
            value={profile.firstName}
            autoComplete="given-name"
            readOnly
            onChange={() => undefined}
          />
          <TextField
            id="lastName"
            label="Priimek"
            value={profile.lastName}
            autoComplete="family-name"
            readOnly
            onChange={() => undefined}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
        <TextField
          id="email"
          label="E-pošta"
          type="email"
          value={profile.email}
          autoComplete="email"
          className="md:col-span-2"
          readOnly
          onChange={() => undefined}
        />
        <TextField
          id="username"
          label="Uporabniško ime"
          value={profile.username}
          autoComplete="username"
          className="md:col-span-2"
          disabled
          onChange={() => undefined}
        />
        <SelectField
          id="gender"
          label="Spol"
          value={profile.gender}
          options={options.gender}
          autoComplete="sex"
          disabled
          onChange={() => undefined}
        />
        <DateField
          id="birthDate"
          label="Datum rojstva (neobvezno)"
          value={profile.birthDate}
          autoComplete="bday"
          disabled
          onChange={() => undefined}
        />
        <SelectField
          id="country"
          label="Država"
          value={profile.country}
          options={options.country}
          autoComplete="country-name"
          disabled
          onChange={() => undefined}
        />
        <SelectField
          id="timezone"
          label="Časovni pas"
          value={profile.timezone}
          options={options.timezone}
          disabled
          onChange={() => undefined}
        />
      </div>

      <p className="mt-7 text-sm leading-relaxed text-muted">
        Ime in e-pošta prihajata iz tvojega računa. Dodatni podatki se trenutno
        ne shranjujejo.
      </p>
    </SettingsCard>
  );
}
