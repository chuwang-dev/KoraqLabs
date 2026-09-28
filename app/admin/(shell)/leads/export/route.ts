import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import { getAllLeadsForExport, logActivity } from "@/lib/admin-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Spreadsheet apps execute cells starting with = + - @ as formulas, so a
// lead who typed "=HYPERLINK(...)" into the message box could turn an
// exported CSV into an attack on whoever opens it. Prefixing a single quote
// forces those cells to be treated as plain text.
function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET() {
  const email = await getAdminEmail();
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await getAllLeadsForExport();

  const headers = [
    "Name", "Business", "Email", "Phone", "Business type", "Service requested",
    "Current website", "Budget", "Description", "Source", "Landing page",
    "Device", "Status", "Submitted at",
  ];

  const rows = leads.map((l) =>
    [
      l.name, l.business_name, l.email, l.phone, l.business_type, l.need,
      l.current_website, l.budget, l.description, l.source, l.landing_page,
      l.device, l.status, l.created_at,
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = [headers.map(csvCell).join(","), ...rows].join("\r\n");
  await logActivity(email, "leads_exported", `${leads.length} lead(s)`);

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="koraq-leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
