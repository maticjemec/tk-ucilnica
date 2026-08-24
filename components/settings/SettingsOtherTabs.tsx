"use client";

import { useState } from "react";
import { CreditCard, Receipt } from "lucide-react";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { SelectField, ToggleField } from "@/components/settings/fields";
import { Button } from "@/components/ui/Button";
import type { SettingsContent } from "@/types/settings";

type PlaceholderNoteProps = {
  children: string;
};

function PlaceholderNote({ children }: PlaceholderNoteProps) {
  return (
    <p className="mt-3.5 text-sm leading-relaxed text-muted">{children}</p>
  );
}

type LearningSettingsProps = {
  content: SettingsContent;
};

export function LearningSettings({ content }: LearningSettingsProps) {
  const [autoplay, setAutoplay] = useState(content.learning.autoplay);
  const [playbackSpeed, setPlaybackSpeed] = useState(
    content.learning.playbackSpeed,
  );
  const [dailyReminder, setDailyReminder] = useState(
    content.learning.dailyReminder,
  );

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
          Nastavitve učenja
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Prilagodi tempo, predvajanje lekcij in opomnike. Spremembe ostanejo
          lokalne, dokler ne povežemo uporabniškega sistema.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SettingsCard title="Predvajanje">
          <div className="flex flex-col gap-4">
            <ToggleField
              id="autoplay"
              label="Samodejno predvajanje naslednje lekcije"
              description="Ko se lekcija konča, se začne naslednja."
              checked={autoplay}
              onChange={setAutoplay}
            />
            <SelectField
              id="playbackSpeed"
              label="Hitrost predvajanja"
              value={playbackSpeed}
              options={content.options.playbackSpeed}
              onChange={setPlaybackSpeed}
            />
          </div>
        </SettingsCard>

        <SettingsCard title="Opomniki">
          <ToggleField
            id="dailyReminder"
            label="Dnevni opomnik za učenje"
            description="Kratek spomin, da nadaljuješ svojo pot."
            checked={dailyReminder}
            onChange={setDailyReminder}
          />
          <PlaceholderNote>
            Opomniki bodo na voljo po povezavi obvestil.
          </PlaceholderNote>
        </SettingsCard>
      </div>
    </div>
  );
}

type NotificationSettingsProps = {
  content: SettingsContent;
};

export function NotificationSettings({ content }: NotificationSettingsProps) {
  const [prefs, setPrefs] = useState(content.notifications);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
          Obvestila
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Izberi, katera obvestila želiš prejemati. Nastavitve so trenutno
          samo lokalni predogled.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SettingsCard title="E-poštna obvestila">
          <div className="flex flex-col gap-4">
            <ToggleField
              id="programNews"
              label="Novosti o programih"
              description="Obvestila o novih programih in vsebinah."
              checked={prefs.programNews}
              onChange={(checked) =>
                setPrefs((current) => ({ ...current, programNews: checked }))
              }
            />
            <ToggleField
              id="lessonReminders"
              label="Opomniki za lekcije"
              description="E-pošta, ko je čas za naslednjo lekcijo."
              checked={prefs.lessonReminders}
              onChange={(checked) =>
                setPrefs((current) => ({
                  ...current,
                  lessonReminders: checked,
                }))
              }
            />
          </div>
        </SettingsCard>

        <SettingsCard title="V učilnici">
          <div className="flex flex-col gap-4">
            <ToggleField
              id="progressUpdates"
              label="Napredek in dosežki"
              description="Kratka sporočila ob zaključku lekcij in programov."
              checked={prefs.progressUpdates}
              onChange={(checked) =>
                setPrefs((current) => ({
                  ...current,
                  progressUpdates: checked,
                }))
              }
            />
            <ToggleField
              id="supportMessages"
              label="Sporočila podpore"
              description="Odgovori ekipe, ko potrebuješ pomoč."
              checked={prefs.supportMessages}
              onChange={(checked) =>
                setPrefs((current) => ({
                  ...current,
                  supportMessages: checked,
                }))
              }
            />
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}

type SecuritySettingsProps = {
  content: SettingsContent;
};

export function SecuritySettings({ content }: SecuritySettingsProps) {
  const [showProfile, setShowProfile] = useState(
    content.privacy.showProfileInClassroom,
  );

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
          Varnost
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Geslo, dvofaktorska avtentikacija in seje bodo na voljo po povezavi
          uporabniškega sistema.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SettingsCard title="Prijava">
          <ul className="flex flex-col gap-3.5 text-sm">
            {content.security.map((setting) => (
              <li
                key={setting.id}
                className="flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{setting.label}</p>
                  {setting.value ? (
                    <p className="mt-0.5 text-muted">{setting.value}</p>
                  ) : (
                    <p className="mt-0.5 text-muted">
                      Pregled aktivnih naprav pride kasneje.
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-sm text-muted">
                  {setting.actionLabel}
                </span>
              </li>
            ))}
          </ul>
          <PlaceholderNote>
            Dejanja so trenutno samo prikaz. Spremembe gesla in 2FA še niso
            povezane.
          </PlaceholderNote>
        </SettingsCard>

        <SettingsCard title="Zasebnost">
          <ToggleField
            id="showProfileInClassroom"
            label="Prikaz profila v učilnici"
            description="Ime in začetnice so vidni samo tebi, dokler tega ne spremeniš."
            checked={showProfile}
            onChange={setShowProfile}
          />
        </SettingsCard>
      </div>
    </div>
  );
}

type BillingSettingsProps = {
  content: SettingsContent;
};

export function BillingSettings({ content }: BillingSettingsProps) {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <h2 className="text-[1.0625rem] font-semibold tracking-tight text-foreground">
          Plačila
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          Programi se kupijo enkrat. Naročnine in vračila trenutno niso na
          voljo.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <SettingsCard title="Nakupi">
          <p className="font-medium text-foreground">{content.account.statusLabel}</p>
          <p className="mt-0.5 text-sm text-muted">
            {content.account.activeUntilLabel}
          </p>
          <Button variant="outline" size="sm" className="mt-3.5 h-9" disabled>
            Naročnine niso na voljo
          </Button>
          <PlaceholderNote>
            Naročnin ni. Kupljeni programi se odprejo po uspešnem plačilu.
          </PlaceholderNote>
        </SettingsCard>

        <SettingsCard title="Plačilno sredstvo">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-canvas text-accent">
              <CreditCard className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                Kartica ni povezana
              </p>
              <p className="mt-0.5 text-sm text-muted">
                Plačilna sredstva bodo na voljo v naslednji fazi.
              </p>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard title="Računi">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-canvas text-accent">
              <Receipt className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Računov še ni</p>
              <p className="mt-0.5 text-sm text-muted">
                Tukaj se bodo prikazali računi za tvoje nakupe.
              </p>
            </div>
          </div>
        </SettingsCard>
      </div>
    </div>
  );
}
