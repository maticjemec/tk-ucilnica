import type { ProgramVisualId } from "@/types/dashboard";

/**
 * Local UI overlay for cover placeholders.
 * public.programs.cover_image_url is the image source when present;
 * these visuals are only used when that URL is null.
 */
const PROGRAM_VISUALS: Record<
  string,
  { visual: ProgramVisualId; imageAlt: string }
> = {
  "21-dni-do-manj-anksioznosti": {
    visual: "feather",
    imageAlt: "Mehko pero na mirnem, svetlem ozadju",
  },
  "21-dni-do-boljse-samozavesti": {
    visual: "silhouette",
    imageAlt: "Silhueta ob toplem sončnem vzhodu",
  },
  "najdi-sebe": {
    visual: "path",
    imageAlt: "Pot skozi gore ob sončnem vzhodu",
  },
  "samohipnoza-v-praksi": {
    visual: "ripple",
    imageAlt: "Krogi na mirni vodi",
  },
  "boljsi-spanec-boljse-jutri": {
    visual: "moon",
    imageAlt: "Mirna noč in mehka svetloba za boljši spanec",
  },
  "umiri-telo-umiri-um": {
    visual: "calm",
    imageAlt: "Mirna voda in mehka svetloba za sprostitev",
  },
  "zasij-v-21-dneh": {
    visual: "glow",
    imageAlt: "Topla svetloba ob sončnem vzhodu",
  },
  "21-dni-hvaleznosti": {
    visual: "journal",
    imageAlt: "Odprt dnevnik na svetlem, umirjenem ozadju",
  },
};

const DEFAULT_VISUAL: { visual: ProgramVisualId; imageAlt: string } = {
  visual: "path",
  imageAlt: "Naslovnica programa",
};

export function getProgramVisual(slug: string, title: string) {
  return PROGRAM_VISUALS[slug] ?? { ...DEFAULT_VISUAL, imageAlt: title };
}
