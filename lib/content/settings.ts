import type { SettingsContent, SettingsTab } from "@/types/settings";

export const settingsTabs: SettingsTab[] = [
  { id: "profile", label: "Moj profil" },
  { id: "learning", label: "Nastavitve učenja" },
  { id: "notifications", label: "Obvestila" },
  { id: "security", label: "Varnost" },
  { id: "billing", label: "Plačila" },
];

export const settingsContent: SettingsContent = {
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    gender: "unspecified",
    birthDate: "",
    country: "SI",
    timezone: "Europe/Ljubljana",
    initials: "",
  },
  contact: {
    language: "sl",
    timeUnit: "minutes",
    timeFormat: "24h",
    newsletterOptIn: false,
  },
  account: {
    name: "Račun",
    badge: "Račun",
    statusLabel: "Enkratni nakupi programov",
    activeUntilLabel: "Naročnine trenutno niso na voljo.",
    benefits: [
      {
        id: "purchased-access",
        label: "Dostop do programov, ki jih kupiš",
        icon: "shield",
      },
      {
        id: "worksheets",
        label: "Delovni listi, ko so del programa",
        icon: "document",
      },
      {
        id: "classroom",
        label: "Učilnica z napredkom in lekcijami",
        icon: "support",
      },
    ],
  },
  security: [
    {
      id: "password",
      label: "Geslo",
      value: "Sprememba gesla pride kasneje.",
      valueTone: "muted",
      actionLabel: "Kmalu",
    },
    {
      id: "twoFactor",
      label: "Dvofaktorska avtentikacija",
      value: "Ni vklopljena",
      valueTone: "muted",
      actionLabel: "Kmalu",
    },
    {
      id: "sessions",
      label: "Seje in naprave",
      value: "Pregled naprav pride kasneje.",
      valueTone: "muted",
      actionLabel: "Kmalu",
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
