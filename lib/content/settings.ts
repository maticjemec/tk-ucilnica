import type { SettingsContent, SettingsTab } from "@/types/settings";

export const settingsTabs: SettingsTab[] = [
  { id: "profile", label: "Moj profil" },
  { id: "learning", label: "Nastavitve učenja" },
  { id: "notifications", label: "Obvestila" },
  { id: "security", label: "Varnost" },
  { id: "billing", label: "Plačila in naročnine" },
];

export const settingsContent: SettingsContent = {
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    gender: "female",
    birthDate: "2001-02-08",
    country: "SI",
    timezone: "Europe/Ljubljana",
    initials: "",
  },
  contact: {
    language: "sl",
    timeUnit: "minutes",
    timeFormat: "24h",
    newsletterOptIn: true,
  },
  account: {
    name: "Premium članstvo",
    badge: "Premium članstvo",
    statusLabel: "Premium članstvo",
    activeUntilLabel: "Aktivno do 18. 09. 2025",
    benefits: [
      {
        id: "unlimited-access",
        label: "Neomejen dostop do vseh kupljenih programov",
        icon: "shield",
      },
      {
        id: "worksheets",
        label: "Prenos delovnih listov in zvezkov",
        icon: "document",
      },
      {
        id: "priority-support",
        label: "Prednostna podpora",
        icon: "support",
      },
    ],
  },
  security: [
    {
      id: "password",
      label: "Geslo",
      value: "••••••••••••",
      valueTone: "muted",
      actionLabel: "Spremeni",
    },
    {
      id: "twoFactor",
      label: "Dvofaktorska avtentikacija",
      value: "Vključeno",
      valueTone: "success",
      actionLabel: "Upravljaj",
    },
    {
      id: "sessions",
      label: "Seje in naprave",
      actionLabel: "Preglej",
    },
  ],
  learning: {
    autoplay: true,
    playbackSpeed: "1",
    dailyReminder: false,
  },
  notifications: {
    programNews: true,
    lessonReminders: true,
    progressUpdates: true,
    supportMessages: true,
  },
  privacy: {
    showProfileInClassroom: false,
  },
  options: {
    gender: [
      { value: "female", label: "Ženska" },
      { value: "male", label: "Moški" },
      { value: "other", label: "Drugo" },
      { value: "unspecified", label: "Ne želim povedati" },
    ],
    country: [
      { value: "SI", label: "Slovenija" },
      { value: "AT", label: "Avstrija" },
      { value: "HR", label: "Hrvaška" },
      { value: "DE", label: "Nemčija" },
      { value: "IT", label: "Italija" },
    ],
    timezone: [
      { value: "Europe/Ljubljana", label: "(UTC+01:00) Ljubljana" },
      { value: "Europe/Berlin", label: "(UTC+01:00) Berlin" },
      { value: "Europe/London", label: "(UTC+00:00) London" },
    ],
    language: [
      { value: "sl", label: "Slovenščina" },
      { value: "en", label: "English" },
    ],
    timeUnit: [
      { value: "minutes", label: "Minute" },
      { value: "hours", label: "Ure" },
    ],
    timeFormat: [
      { value: "24h", label: "24-urna (14:30)" },
      { value: "12h", label: "12-urna (2:30 PM)" },
    ],
    playbackSpeed: [
      { value: "0.75", label: "0,75×" },
      { value: "1", label: "1×" },
      { value: "1.25", label: "1,25×" },
      { value: "1.5", label: "1,5×" },
    ],
  },
};
