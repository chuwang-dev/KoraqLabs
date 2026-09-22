import nodemailer from "nodemailer";

// Sends contact form submissions through Gmail's SMTP server using an
// account App Password (not the account's normal login password).
//
// Required env vars:
//   GMAIL_USER          the Gmail address that sends the mail, e.g. koraqlabs@gmail.com
//   GMAIL_APP_PASSWORD   a 16-character App Password generated for that account
//   EMAIL_TO             (optional) inbox that receives submissions, defaults to GMAIL_USER
//
// See README.md for how to generate an App Password.

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return transporter;
}

export type ContactEmailPayload = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  need: string;
  currentWebsite: string;
  budget: string;
  description: string;
};

export async function sendContactEmail(payload: ContactEmailPayload) {
  const client = getTransporter();
  const gmailUser = process.env.GMAIL_USER;
  const to = process.env.EMAIL_TO || gmailUser;

  if (!client || !gmailUser || !to) {
    // No Gmail credentials configured yet — log server-side so submissions
    // are not silently lost during setup, rather than throwing.
    console.warn(
      "GMAIL_USER / GMAIL_APP_PASSWORD is not set. Contact form submission was not emailed:",
      payload
    );
    return { sent: false as const };
  }

  const subject = `New project inquiry — ${payload.businessName}`;
  const text = [
    `Name: ${payload.name}`,
    `Business: ${payload.businessName}`,
    `Email: ${payload.email}`,
    `Phone/WhatsApp: ${payload.phone}`,
    `Business type: ${payload.businessType}`,
    `What they need: ${payload.need}`,
    `Current website: ${payload.currentWebsite || "None"}`,
    `Budget: ${payload.budget}`,
    "",
    "Project description:",
    payload.description,
  ].join("\n");

  await client.sendMail({
    from: `Koraq Labs Website <${gmailUser}>`,
    to,
    replyTo: payload.email,
    subject,
    text,
  });

  return { sent: true as const };
}
