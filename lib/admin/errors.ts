export const ADMIN_ERRORS = {
  unauthenticated: "Za dostop se prijavi.",
  forbidden: "Nimate dostopa.",
  notFound: "Vsebina ne obstaja.",
  saveProgram: "Programa ni bilo mogoče shraniti.",
  saveSection: "Razdelka ni bilo mogoče shraniti.",
  saveLesson: "Lekcije ni bilo mogoče shraniti.",
  uploadVideo: "Nalaganje videa ni uspelo.",
  uploadAudio: "Nalaganje zvoka ni uspelo.",
  uploadWorksheet: "Nalaganje PDF ni uspelo.",
  uploadFailed: "Nalaganje ni uspelo.",
  uploadCover: "Nalaganje slike ni uspelo.",
  removeCover: "Naslovne slike ni bilo mogoče odstraniti.",
  coverType: "Podprte so samo JPG, PNG in WebP slike.",
  coverSize: "Slika je lahko velika največ 5 MB.",
  removeVideo: "Videoposnetka ni bilo mogoče odstraniti.",
  removeAudio: "Zvočne datoteke ni bilo mogoče odstraniti.",
  removeWorksheet: "PDF datoteke ni bilo mogoče odstraniti.",
  refreshVideo: "Status videa ni bilo mogoče osvežiti.",
  invalidInput: "Preveri vnesene podatke.",
  slugTaken: "Ta slug je že zaseden.",
  orderTaken: "Ta vrstni red je že zaseden.",
} as const;

export type AdminActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function adminOk(): AdminActionResult<undefined>;
export function adminOk<T>(data: T): AdminActionResult<T>;
export function adminOk<T>(data?: T): AdminActionResult<T | undefined> {
  return { ok: true, data };
}

export function adminFail(error: string): AdminActionResult<never> {
  return { ok: false, error };
}
