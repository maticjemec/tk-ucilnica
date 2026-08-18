"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Camera } from "lucide-react";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { DateField, SelectField, TextField } from "@/components/settings/fields";
import { Button } from "@/components/ui/Button";
import type { SettingsFieldOptions, UserProfile } from "@/types/settings";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

type PersonalDataCardProps = {
  profile: UserProfile;
  options: SettingsFieldOptions;
};

export function PersonalDataCard({ profile, options }: PersonalDataCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [form, setForm] = useState(profile);
  const [previewUrl, setPreviewUrl] = useState(profile.avatarSrc);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError("Slika sme biti največ 2 MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("Dovoljeni so samo JPG, PNG ali WEBP.");
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const nextUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextUrl;
    setPreviewUrl(nextUrl);
    setAvatarError(null);
    setSaved(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <SettingsCard title="Osebni podatki">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          <div className="flex w-[5.75rem] shrink-0 flex-col items-start gap-2">
            <div className="relative size-[5.75rem]">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a remote asset
                <img
                  src={previewUrl}
                  alt={`Profilna slika: ${form.firstName} ${form.lastName}`}
                  className="size-full rounded-full object-cover ring-1 ring-accent/15"
                />
              ) : (
                <span
                  className="flex size-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_36%_30%,var(--canvas),var(--warning-soft)_52%,color-mix(in_srgb,var(--accent-soft)_42%,white))] text-[1.2rem] font-medium tracking-[0.06em] text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-accent/20"
                  aria-label={`Profilna slika ni nastavljena. Začetnici ${form.initials}.`}
                  role="img"
                >
                  {form.initials}
                </span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                aria-label="Naloži profilno sliko"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                aria-label="Spremeni profilno sliko"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-0 bottom-0 flex size-7 translate-x-[18%] translate-y-[10%] items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm ring-2 ring-surface transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <Camera className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden />
              </button>
            </div>
            <p className="text-[0.6875rem] leading-snug text-muted">
              JPG, PNG ali WEBP.
              <br />
              Največ 2 MB.
            </p>
            {avatarError ? (
              <p className="text-[0.6875rem] text-danger">{avatarError}</p>
            ) : null}
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 md:pt-0.5">
            <TextField
              id="firstName"
              label="Ime"
              value={form.firstName}
              autoComplete="given-name"
              onChange={(value) => update("firstName", value)}
            />
            <TextField
              id="lastName"
              label="Priimek"
              value={form.lastName}
              autoComplete="family-name"
              onChange={(value) => update("lastName", value)}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
          <TextField
            id="email"
            label="E-pošta"
            type="email"
            value={form.email}
            autoComplete="email"
            className="md:col-span-2"
            onChange={(value) => update("email", value)}
          />
          <TextField
            id="username"
            label="Uporabniško ime"
            value={form.username}
            autoComplete="username"
            className="md:col-span-2"
            onChange={(value) => update("username", value)}
          />
          <SelectField
            id="gender"
            label="Spol"
            value={form.gender}
            options={options.gender}
            autoComplete="sex"
            onChange={(value) => update("gender", value)}
          />
          <DateField
            id="birthDate"
            label="Datum rojstva (neobvezno)"
            value={form.birthDate}
            autoComplete="bday"
            onChange={(value) => update("birthDate", value)}
          />
          <SelectField
            id="country"
            label="Država"
            value={form.country}
            options={options.country}
            autoComplete="country-name"
            onChange={(value) => update("country", value)}
          />
          <SelectField
            id="timezone"
            label="Časovni pas"
            value={form.timezone}
            options={options.timezone}
            onChange={(value) => update("timezone", value)}
          />
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" className="w-full sm:w-auto">
            Shrani spremembe
          </Button>
          <p className="text-sm text-success" aria-live="polite">
            {saved ? "Spremembe so shranjene." : ""}
          </p>
        </div>
      </form>
    </SettingsCard>
  );
}
