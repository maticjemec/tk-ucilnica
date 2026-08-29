import { type EmailOtpType } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import {
  getForgotPasswordPath,
  getResetPasswordPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      revalidatePath("/", "layout");

      if (type === "recovery") {
        redirect(getResetPasswordPath());
      }

      redirect(next);
    }
  }

  if (type === "recovery") {
    redirect(`${getForgotPasswordPath()}?napaka=povezava`);
  }

  redirect("/prijava?napaka=potrditev");
}
