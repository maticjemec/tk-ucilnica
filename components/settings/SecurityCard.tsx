import type { ComponentType } from "react";
import { LockKeyhole, Shield, Smartphone } from "lucide-react";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { cn } from "@/lib/cn";
import type { SecuritySetting, SecuritySettingId } from "@/types/settings";

const rowIcons: Record<
  SecuritySettingId,
  ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>
> = {
  password: LockKeyhole,
  twoFactor: Shield,
  sessions: Smartphone,
};

type SecurityCardProps = {
  settings: SecuritySetting[];
};

export function SecurityCard({ settings }: SecurityCardProps) {
  return (
    <SettingsCard title="Varnost" compact>
      <ul className="-mt-0.5 flex flex-col">
        {settings.map((setting, index) => {
          const Icon = rowIcons[setting.id];

          return (
            <li
              key={setting.id}
              className={cn(
                "flex items-center gap-2.5 py-2.5",
                index > 0 && "border-t border-border",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-canvas text-accent">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                {setting.value ? (
                  <p
                    className={cn(
                      "mt-0.5 text-sm",
                      setting.valueTone === "success"
                        ? "text-success-foreground"
                        : "text-muted",
                    )}
                  >
                    {setting.value}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                disabled
                className="shrink-0 text-sm font-medium text-muted"
              >
                {setting.actionLabel}
              </button>
            </li>
          );
        })}
      </ul>
    </SettingsCard>
  );
}
