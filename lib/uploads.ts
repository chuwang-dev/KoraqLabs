import "server-only";
import { mutate, safeQuery } from "@/lib/db";

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024; // 2 MB

export type DetectedImage = { contentType: "image/png" | "image/jpeg" | "image/gif" | "image/webp"; ext: string };

/**
 * Identify an image from its actual bytes ("magic numbers"), never from the
 * filename or the browser-supplied Content-Type — both are attacker
 * controlled. SVG is deliberately NOT accepted: it can carry scripts.
 */
export function detectImageType(buf: Buffer): DetectedImage | null {
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { contentType: "image/png", ext: "png" };
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { contentType: "image/jpeg", ext: "jpg" };
  }
  if (buf.length >= 6 && ["GIF87a", "GIF89a"].includes(buf.subarray(0, 6).toString("ascii"))) {
    return { contentType: "image/gif", ext: "gif" };
  }
  if (buf.length >= 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return { contentType: "image/webp", ext: "webp" };
  }
  return null;
}

export async function saveUpload(input: {
  data: Buffer;
  contentType: string;
  filename: string | null;
  uploadedBy: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const result = await mutate<{ id: string }>(
    `insert into uploads (filename, content_type, size_bytes, data, uploaded_by)
     values ($1,$2,$3,$4,$5) returning id`,
    [input.filename?.slice(0, 200) ?? null, input.contentType, input.data.length, input.data, input.uploadedBy]
  );
  if (!result.ok) return { ok: false, error: result.error };
  const id = result.rows[0]?.id;
  return id ? { ok: true, id } : { ok: false, error: "Upload could not be saved." };
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getUpload(id: string): Promise<{ contentType: string; data: Buffer } | null> {
  if (!UUID_RE.test(id)) return null;
  const rows = await safeQuery<{ content_type: string; data: Buffer }>(
    `select content_type, data from uploads where id = $1`,
    [id]
  );
  return rows[0] ? { contentType: rows[0].content_type, data: rows[0].data } : null;
}
