import {
  Bell,
  CalendarDays,
  Clock,
  FileText,
  Infinity as InfinityIcon,
  Lock,
  Monitor,
  Play,
  RefreshCcw,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import type { ProgramDetailIcon } from "@/types/program-detail";

export const programDetailIcons: Record<ProgramDetailIcon, LucideIcon> = {
  bell: Bell,
  calendar: CalendarDays,
  clock: Clock,
  file: FileText,
  infinity: InfinityIcon,
  lock: Lock,
  loop: RefreshCcw,
  monitor: Monitor,
  play: Play,
  refresh: RefreshCw,
};
