import { NextResponse, type NextRequest } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { hasValidOrigin } from "@/lib/origin";
import { detectImageType, MAX_UPLOAD_BYTES, saveUpload } from "@/lib/uploads";
import { logActivity } from "@/lib/admin-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: NextRequest) {
  // This lives under /api, outside the /admin middleware matcher, so it
  // enforces its own origin check and authentication.
  if (!hasValidOrigin(request.method, request.headers)) return fail("Invalid request origin.", 403);

  const email = await getAdminEmail();
  if (!email) return fail("Please log in again.", 401);

  if (!isDatabaseConfigured()) {
    return fail("Uploads need DATABASE_URL to be configured.", 503);
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_UPLOAD_BYTES + 100_000) return fail("Image is too large (max 2 MB).", 413);

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return fail("Couldn't read the upload.", 400);
  }
  if (!(file instanceof File)) return fail("No file was provided.", 400);
  if (file.size === 0) return fail("That file is empty.", 400);
  if (file.size > MAX_UPLOAD_BYTES) return fail("Image is too large (max 2 MB).", 413);

  const data = Buffer.from(await file.arrayBuffer());
  const detected = detectImageType(data);
  if (!detected) return fail("Only PNG, JPEG, GIF, or WebP images are allowed.", 415);

  const saved = await saveUpload({
    data,
    contentType: detected.contentType,
    filename: file.name,
    uploadedBy: email,
  });
  if (!saved.ok) return fail(saved.error, 500);

  await logActivity(email, "image_uploaded", `${detected.ext.toUpperCase()}, ${Math.round(data.length / 1024)} KB`);
  return NextResponse.json({ ok: true, url: `/api/uploads/${saved.id}` });
}
