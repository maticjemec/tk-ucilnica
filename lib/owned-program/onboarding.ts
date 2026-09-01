import type { ProgramUnlockMode } from "@/types/owned-program";

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
};

function sloveneCount(
  count: number,
  forms: readonly [string, string, string, string],
) {
  if (count === 1) {
    return `1 ${forms[0]}`;
  }

  if (count === 2) {
    return `2 ${forms[1]}`;
  }

  if (count === 3 || count === 4) {
    return `${count} ${forms[2]}`;
  }

  return `${count} ${forms[3]}`;
}

export function formatOnboardingLessonCount(count: number) {
  return sloveneCount(count, ["lekcija", "lekciji", "lekcije", "lekcij"]);
}

export function formatOnboardingSectionCount(count: number) {
  return sloveneCount(count, ["sklop", "sklopa", "sklopi", "sklopov"]);
}

export function getHowItWorksSteps(
  unlockMode: ProgramUnlockMode,
): HowItWorksStep[] {
  const continueStep: HowItWorksStep =
    unlockMode === "drip"
      ? {
          id: "continue",
          title: "Nadaljuj, ko je lekcija na voljo",
          description:
            "Naslednja lekcija se odpre po predvidenem času in ko zaključiš prejšnjo.",
        }
      : unlockMode === "sequential"
        ? {
            id: "continue",
            title: "Nadaljuj z naslednjo lekcijo",
            description:
              "Naslednja lekcija se odpre, ko zaključiš prejšnjo.",
          }
        : {
            id: "continue",
            title: "Nadaljuj z naslednjo lekcijo",
            description:
              "Naslednjo lekcijo lahko odpreš, ko si pripravljen/a.",
          };

  return [
    {
      id: "open",
      title: "Odpri lekcijo",
      description: "Izberi razpoložljivo lekcijo in začni.",
    },
    {
      id: "learn",
      title: "Oglej si vsebino",
      description:
        "Oglej si ali poslušaj lekcijo in opravi nalogo, če je del lekcije.",
    },
    {
      id: "complete",
      title: "Označi lekcijo kot opravljeno",
      description: "Ko zaključiš, označi lekcijo kot opravljeno.",
    },
    continueStep,
  ];
}

export function getHowItWorksHint(unlockMode: ProgramUnlockMode) {
  if (unlockMode === "drip") {
    return "Naslednja lekcija se odpre po predvidenem času in ko zaključiš prejšnjo.";
  }

  if (unlockMode === "sequential") {
    return "Lekcije se odpirajo po vrsti. Napredek se shranjuje samodejno.";
  }

  return "Napredek se shranjuje samodejno. Lekcije lahko odpiraš v svojem tempu.";
}

export const FIRST_TIME_GUIDANCE = [
  "Program lahko opravljaš v svojem tempu.",
  "Napredek se samodejno shranjuje.",
  "Ko zaključiš lekcijo, bo tvoj napredek posodobljen.",
] as const;
