export type ProgramVisualId = "feather" | "silhouette" | "path" | "ripple";

export type DashboardProgram = {
  slug: string;
  title: string;
  label: string;
  description: string;
  progress: number;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt?: string;
};

export type DashboardProgress = {
  percent: number;
  headline: string;
  supporting: string;
};

export type ContinueLesson = {
  title: string;
  program: string;
  duration: string;
  href: string;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt?: string;
};

export type UpcomingLesson = {
  id: string;
  title: string;
  program: string;
  schedule: string;
};

export type DashboardHeroContent = {
  headingLines: [string, string];
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc?: string;
  imageAlt: string;
};
