import type { ComponentType } from "react";
import { Crown, FileText, Headphones, ShieldCheck } from "lucide-react";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { Button } from "@/components/ui/Button";
import type { AccountBenefitIcon, AccountPlan } from "@/types/settings";

const benefitIcons: Record<
  AccountBenefitIcon,
  ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }>
> = {
  shield: ShieldCheck,
  document: FileText,
  support: Headphones,
};

type AccountCardProps = {
  account: AccountPlan;
  onManageSubscription: () => void;
};

export function AccountCard({ account, onManageSubscription }: AccountCardProps) {
  return (
    <SettingsCard
      title="Tvoj račun"
      compact
      action={
        <span className="inline-flex items-center gap-1 rounded-sm border border-accent/30 bg-warning-soft px-1.5 py-px text-[0.65rem] font-medium text-warning-foreground">
          <Crown className="h-3 w-3" strokeWidth={1.8} aria-hidden />
          {account.badge}
        </span>
      }
    >
      <p className="text-[0.9375rem] font-medium text-foreground">{account.statusLabel}</p>
      <p className="mt-0.5 text-sm text-muted">{account.activeUntilLabel}</p>

      <Button
        variant="outline"
        size="sm"
        className="mt-3.5 h-9 w-full"
        onClick={onManageSubscription}
      >
        Upravljaj naročnino
      </Button>

      <ul className="mt-4 flex flex-col gap-2.5">
        {account.benefits.map((benefit) => {
          const Icon = benefitIcons[benefit.icon];

          return (
            <li
              key={benefit.id}
              className="flex items-start gap-2.5 text-sm leading-snug text-foreground"
            >
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                strokeWidth={1.7}
                aria-hidden
              />
              {benefit.label}
            </li>
          );
        })}
      </ul>
    </SettingsCard>
  );
}
