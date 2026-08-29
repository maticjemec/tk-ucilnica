export const GENERIC_SIGN_IN_ERROR =
  "Prijava trenutno ni uspela. Poskusi znova.";
export const GENERIC_SIGN_UP_ERROR =
  "Računa ni bilo mogoče ustvariti. Poskusi znova.";
export const UNEXPECTED_SIGN_UP_ERROR =
  "Prišlo je do nepričakovane napake pri registraciji. Poskusi znova.";
export const GENERIC_PASSWORD_RESET_ERROR =
  "Ponastavitve gesla trenutno ni mogoče začeti. Poskusi znova.";
export const GENERIC_PASSWORD_UPDATE_ERROR =
  "Gesla ni bilo mogoče posodobiti. Poskusi znova.";
export const PASSWORD_RESET_SENT_MESSAGE =
  "Če račun s tem e-poštnim naslovom obstaja, smo ti poslali povezavo za ponastavitev gesla.";

function errorCode(error: { code?: string; message?: string }) {
  return (error.code ?? "").toLowerCase();
}

function errorMessage(error: { code?: string; message?: string }) {
  return (error.message ?? "").toLowerCase();
}

export function mapSignInError(error: {
  code?: string;
  message?: string;
}): string {
  const code = errorCode(error);
  const message = errorMessage(error);

  if (
    code === "email_not_confirmed" ||
    message.includes("email not confirmed")
  ) {
    return "Potrdi e-poštni naslov, preden se prijaviš.";
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
    message.includes("invalid credentials")
  ) {
    return "Neveljavna e-pošta ali geslo.";
  }

  return GENERIC_SIGN_IN_ERROR;
}

export function mapSignUpError(error: {
  code?: string;
  message?: string;
}): string {
  const code = errorCode(error);
  const message = errorMessage(error);

  if (
    code === "user_already_exists" ||
    code === "email_exists" ||
    message.includes("already registered") ||
    message.includes("user already registered")
  ) {
    return "Ta e-poštni naslov je že v uporabi.";
  }

  if (
    code === "weak_password" ||
    message.includes("password should be") ||
    message.includes("weak password")
  ) {
    return "Geslo ni dovolj močno. Uporabi vsaj 8 znakov.";
  }

  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  ) {
    return "Preveč poskusov. Počakaj trenutek in poskusi znova.";
  }

  if (
    code === "signup_disabled" ||
    message.includes("signups not allowed") ||
    message.includes("signup is disabled")
  ) {
    return "Registracija trenutno ni na voljo.";
  }

  if (
    code === "validation_failed" ||
    message.includes("invalid email") ||
    message.includes("unable to validate")
  ) {
    return "Podatki niso veljavni. Preveri e-pošto in poskusi znova.";
  }

  return UNEXPECTED_SIGN_UP_ERROR;
}

export function mapPasswordResetError(error: {
  code?: string;
  message?: string;
}): string {
  const code = errorCode(error);
  const message = errorMessage(error);

  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    message.includes("rate limit") ||
    message.includes("too many requests")
  ) {
    return "Preveč poskusov. Počakaj trenutek in poskusi znova.";
  }

  return GENERIC_PASSWORD_RESET_ERROR;
}

export function mapPasswordUpdateError(error: {
  code?: string;
  message?: string;
}): string {
  const code = errorCode(error);
  const message = errorMessage(error);

  if (
    code === "weak_password" ||
    message.includes("password should be") ||
    message.includes("weak password")
  ) {
    return "Geslo ni dovolj močno. Uporabi vsaj 8 znakov.";
  }

  if (
    code === "same_password" ||
    message.includes("should be different from the old password")
  ) {
    return "Novo geslo mora biti drugačno od trenutnega.";
  }

  if (
    code === "session_not_found" ||
    (message.includes("session") && message.includes("not found"))
  ) {
    return "Seja za ponastavitev je potekla. Zahtevaj novo povezavo.";
  }

  return GENERIC_PASSWORD_UPDATE_ERROR;
}
