export type SettingsTabId =
  | "profile"
  | "learning"
  | "notifications"
  | "security"
  | "billing";

export type SettingsTab = {
  id: SettingsTabId;
  label: string;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender: string;
  /** ISO 8601 date (`YYYY-MM-DD`), or empty when unset. */
  birthDate: string;
  country: string;
  timezone: string;
  initials: string;
  avatarSrc?: string;
};

export type ContactSettings = {
  language: string;
  timeUnit: string;
  timeFormat: string;
  newsletterOptIn: boolean;
};

export type AccountBenefitIcon = "shield" | "document" | "support";

export type AccountBenefit = {
  id: string;
  label: string;
  icon: AccountBenefitIcon;
};

export type AccountPlan = {
  name: string;
  badge: string;
  statusLabel: string;
  activeUntilLabel: string;
  benefits: AccountBenefit[];
};

export type SecuritySettingId = "password" | "twoFactor" | "sessions";

export type SecuritySetting = {
  id: SecuritySettingId;
  label: string;
  value?: string;
  valueTone?: "muted" | "success";
  actionLabel: string;
};

export type LearningPreferences = {
  autoplay: boolean;
  playbackSpeed: string;
  dailyReminder: boolean;
};

export type NotificationPreferences = {
  programNews: boolean;
  lessonReminders: boolean;
  progressUpdates: boolean;
  supportMessages: boolean;
};

export type PrivacyPreferences = {
  showProfileInClassroom: boolean;
};

export type SettingsFieldOptions = {
  gender: SelectOption[];
  country: SelectOption[];
  timezone: SelectOption[];
  language: SelectOption[];
  timeUnit: SelectOption[];
  timeFormat: SelectOption[];
  playbackSpeed: SelectOption[];
};

export type SettingsContent = {
  profile: UserProfile;
  contact: ContactSettings;
  account: AccountPlan;
  security: SecuritySetting[];
  learning: LearningPreferences;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  options: SettingsFieldOptions;
};
