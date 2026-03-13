/**
 * Cron: Send drip emails to FREE users after signup
 *
 * Schedule: daily at 09:00 UTC (configured in vercel.json)
 * Sequence:
 *   J+1  — Welcome / getting started
 *   J+3  — AI predictions push
 *   J+7  — 7-day summary + PRO trial CTA
 *   J+13 — Trial ending tomorrow / urgency
 *
 * Each email is only sent once (tracked in user.emailsSent[]).
 * Users who upgraded to PRO are skipped entirely.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { getDripTemplate, DRIP_EMAIL_IDS, type DripEmailId } from '@/lib/email-templates';

const FROM = 'FoodTracks <no-reply@foodtracks.io>';

// Day offsets mapped to email IDs
const DRIP_SCHEDULE: { dayOffset: number; emailId: DripEmailId }[] = [
  { dayOffset: 1, emailId: DRIP_EMAIL_IDS.DAY_1 },
  { dayOffset: 3, emailId: DRIP_EMAIL_IDS.DAY_3 },
  { dayOffset: 7, emailId: DRIP_EMAIL_IDS.DAY_7 },
  { dayOffset: 13, emailId: DRIP_EMAIL_IDS.DAY_13 },
];

export async function GET(request: Request) {
  // ── Auth: Vercel cron secret ────────────────────────────────────────
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const now = new Date();
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const { dayOffset, emailId } of DRIP_SCHEDULE) {
    // Find users who signed up exactly `dayOffset` days ago (within that day)
    const targetDate = new Date(now);
    targetDate.setUTCDate(targetDate.getUTCDate() - dayOffset);
    const dayStart = new Date(targetDate);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setUTCHours(23, 59, 59, 999);

    // Find FREE users who registered on that day and haven't received this email
    const users = await prisma.user.findMany({
      where: {
        createdAt: { gte: dayStart, lte: dayEnd },
        NOT: { emailsSent: { has: emailId } },
        business: {
          subscriptionTier: 'FREE',
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        locale: true,
      },
    });

    for (const user of users) {
      const firstName = user.name?.split(' ')[0] || '';
      const locale = (user.locale === 'en' ? 'en' : 'fr') as 'fr' | 'en';
      const template = getDripTemplate(emailId, firstName, locale, user.id);

      try {
        const { error } = await resend.emails.send({
          from: FROM,
          to: user.email,
          subject: template.subject,
          html: template.html,
        });

        if (error) {
          console.error(`[drip] Failed ${emailId} -> ${user.email}:`, error);
          errors++;
          continue;
        }

        // Mark email as sent
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailsSent: { push: emailId },
          },
        });

        sent++;
        console.log(`[drip] Sent ${emailId} -> ${user.email}`);
      } catch (err) {
        console.error(`[drip] Error ${emailId} -> ${user.email}:`, err);
        errors++;
      }
    }

    skipped += 0; // users already filtered by query
  }

  return NextResponse.json({
    ok: true,
    sent,
    skipped,
    errors,
    timestamp: now.toISOString(),
  });
}
