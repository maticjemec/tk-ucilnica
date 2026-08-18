import type { DashboardProgram } from "@/types/dashboard";

export type ProgramStatus = "in-progress" | "completed";

export type ProgramFilter = "all" | ProgramStatus;

export type PurchasedProgram = DashboardProgram & {
  status: ProgramStatus;
  lessons: string;
  duration: string;
};
