/**
 * Resend email client + email templates
 *
 * Required env vars:
 *   RESEND_API_KEY   — from resend.com dashboard
 *   RESEND_FROM      — verified sender address (e.g. "FoodTracks <no-reply@foodtracks.io>")
 */

import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY environment variable is not set.');
  }
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = process.env.RESEND_FROM ?? 'FoodTracks <no-reply@send.foodtracks.io>';

// ─── Email Templates ──────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FoodTracks</title>
</head>
<body style="margin:0;padding:0;background-color:#f9f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Logo / Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <div style="display:inline-flex;align-items:center;gap:8px;">
                <div style="background:#f97316;border-radius:10px;width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;font-size:20px;line-height:36px;text-align:center;">🍽️</div>
                <span style="font-size:22px;font-weight:700;color:#1a1a1a;vertical-align:middle;margin-left:8px;">FoodTracks</span>
              </div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px;border:1px solid #e5e7eb;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                FoodTracks — Smart inventory for food trucks &amp; restaurants<br />
                <a href="https://foodtracks.io" style="color:#f97316;text-decoration:none;">foodtracks.io</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Send Verification Email ──────────────────────────────────────────────────

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: {
  to: string;
  name: string;
  verificationUrl: string;
}): Promise<void> {
  const firstName = name.split(' ')[0];

  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">
      Welcome to FoodTracks, ${firstName}! 🎉
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
      You're one step away from getting started. Please verify your email address to activate your account and access your 14-day free trial.
    </p>

    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:8px 0 32px;">
          <a href="${verificationUrl}"
             style="display:inline-block;background:#f97316;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;padding:14px 36px;">
            Verify my email
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
      This link expires in <strong>24 hours</strong>. If you didn't create a FoodTracks account, you can safely ignore this email.
    </p>
    <p style="margin:0;font-size:13px;color:#d1d5db;word-break:break-all;">
      Or copy this URL: ${verificationUrl}
    </p>
  `);

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Verify your email — FoodTracks`,
    html,
  });
}

// ─── Send Welcome Email (after verification) ──────────────────────────────────

export async function sendWelcomeEmail({
  to,
  name,
  dashboardUrl,
}: {
  to: string;
  name: string;
  dashboardUrl: string;
}): Promise<void> {
  const firstName = name.split(' ')[0];

  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">
      Your account is verified ✅
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
      Welcome to FoodTracks, ${firstName}! Your 14-day free Pro trial is now active.
      Start tracking your stock, sales, and margins right away.
    </p>

    <!-- Feature highlights -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      ${[
        ['📦', 'Smart stock tracking', 'Real-time inventory with expiry alerts'],
        ['🤖', 'AI sales scanner', 'Scan receipts to auto-update stock'],
        ['📈', 'Sales predictions', 'AI-powered demand forecasts'],
      ].map(([icon, title, desc]) => `
      <tr>
        <td style="padding:8px 0;vertical-align:top;width:36px;font-size:20px;">${icon}</td>
        <td style="padding:8px 12px 8px 0;vertical-align:top;">
          <strong style="display:block;font-size:14px;color:#1a1a1a;">${title}</strong>
          <span style="font-size:13px;color:#9ca3af;">${desc}</span>
        </td>
      </tr>`).join('')}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${dashboardUrl}"
             style="display:inline-block;background:#f97316;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;padding:14px 36px;">
            Go to my dashboard
          </a>
        </td>
      </tr>
    </table>
  `);

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Welcome to FoodTracks, ${firstName}! Your account is ready 🚀`,
    html,
  });
}
