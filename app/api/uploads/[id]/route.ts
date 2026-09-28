import { NextResponse } from "next/server";
import { getUpload } from "@/lib/uploads";

export const runtime = "nodejs";

// Public on purpose: these are the images shown on the public website.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const upload = await getUpload(id);
  if (!upload) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(upload.data), {
    headers: {
      "Content-Type": upload.contentType,
      "Content-Length": String(upload.data.length),
      // Uploads are never edited in place (a new upload gets a new id), so
      // they can be cached hard.
      "Cache-Control": "public, max-age=31536000, immutable",
      // Stop browsers second-guessing the type, and lock down the response
      // so even a mislabeled file can't execute anything.
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
    },
  });
}
