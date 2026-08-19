"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "next/navigation";
import { getOwnedProgramBySlug } from "@/lib/content/owned-program";
import { getLocalProgressPercent } from "@/lib/owned-program/access";

type OwnedProgressContextValue = {
  completedIds: ReadonlySet<string>;
  progressPercent: number;
  markComplete: (lessonId: string) => void;
  isComplete: (lessonId: string) => boolean;
};

const OwnedProgressContext = createContext<OwnedProgressContextValue | null>(
  null,
);

type OwnedProgressProviderProps = {
  children: ReactNode;
};

export function OwnedProgressProvider({
  children,
}: OwnedProgressProviderProps) {
  const params = useParams<{ slug: string }>();
  const program = getOwnedProgramBySlug(String(params.slug ?? ""));
  const [completedIds, setCompletedIds] = useState<string[]>(
    () => program?.initialCompletedLessonIds ?? [],
  );

  const markComplete = useCallback((lessonId: string) => {
    setCompletedIds((current) =>
      current.includes(lessonId) ? current : [...current, lessonId],
    );
  }, []);

  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);

  const progressPercent = getLocalProgressPercent({
    completedCount: completedIds.length,
    initialCompletedCount: program?.initialCompletedLessonIds.length ?? 0,
    totalDays: program?.totalDays ?? 1,
    seedPercent: program?.progress ?? 0,
  });

  const value = useMemo<OwnedProgressContextValue>(
    () => ({
      completedIds: completedSet,
      progressPercent,
      markComplete,
      isComplete: (lessonId: string) => completedSet.has(lessonId),
    }),
    [completedSet, markComplete, progressPercent],
  );

  return (
    <OwnedProgressContext.Provider value={value}>
      {children}
    </OwnedProgressContext.Provider>
  );
}

export function useOwnedProgress() {
  const context = useContext(OwnedProgressContext);

  if (!context) {
    throw new Error("useOwnedProgress must be used within OwnedProgressProvider");
  }

  return context;
}
