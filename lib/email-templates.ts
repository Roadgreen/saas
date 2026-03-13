/**
 * Drip email templates for post-signup sequence (Phase F4)
 *
 * 4 emails sent at J+1, J+3, J+7, J+13 after registration.
 * Dark theme (#0D0905), orange CTA (#E8590C), responsive.
 */

type Locale = 'fr' | 'en';

interface DripEmailTemplate {
  subject: string;
  html: string;
}

// ─── Shared layout wrapper ────────────────────────────────────────────────────

function dripBaseTemplate(content: string, unsubscribeUrl: string, locale: Locale): string {
  const footerText = locale === 'fr'
    ? 'Gestion intelligente pour food trucks & restaurants'
    : 'Smart management for food trucks & restaurants';
  const unsubText = locale === 'fr' ? 'Se d\u00e9sinscrire des emails' : 'Unsubscribe from emails';

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FoodTracks</title>
</head>
<body style="margin:0;padding:0;background-color:#0D0905;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0905;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="background:#E8590C;border-radius:10px;width:36px;height:36px;text-align:center;font-size:20px;line-height:36px;">&#127869;</td>
                <td style="padding-left:10px;font-size:22px;font-weight:700;color:#ffffff;">FoodTracks</td>
              </tr></table>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#1A1714;border-radius:16px;padding:40px;border:1px solid #2A2520;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#6B6560;">
                FoodTracks &mdash; ${footerText}<br />
                <a href="https://foodtracks.io" style="color:#E8590C;text-decoration:none;">foodtracks.io</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;">
                <a href="${unsubscribeUrl}" style="color:#6B6560;text-decoration:underline;">${unsubText}</a>
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

function ctaButton(label: string, url: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:24px 0 8px;">
      <a href="${url}" style="display:inline-block;background:#E8590C;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:10px;padding:14px 36px;">${label}</a>
    </td>
  </tr>
</table>`;
}

function stepRow(icon: string, title: string, desc: string): string {
  return `<tr>
  <td style="padding:8px 0;vertical-align:top;width:36px;font-size:20px;">${icon}</td>
  <td style="padding:8px 0 8px 12px;vertical-align:top;">
    <strong style="display:block;font-size:14px;color:#F5F0EB;">${title}</strong>
    <span style="font-size:13px;color:#9B9590;">${desc}</span>
  </td>
</tr>`;
}

// ─── Email ID constants ───────────────────────────────────────────────────────

export const DRIP_EMAIL_IDS = {
  DAY_1: 'drip_day1_welcome',
  DAY_3: 'drip_day3_ai',
  DAY_7: 'drip_day7_summary',
  DAY_13: 'drip_day13_trial_end',
} as const;

export type DripEmailId = typeof DRIP_EMAIL_IDS[keyof typeof DRIP_EMAIL_IDS];

// ─── Template generators ──────────────────────────────────────────────────────

const DASHBOARD_URL = 'https://foodtracks.io/fr/dashboard';
const UPGRADE_URL = 'https://foodtracks.io/fr/dashboard/settings/billing';

function getUnsubscribeUrl(userId: string): string {
  return `https://foodtracks.io/api/unsubscribe?uid=${userId}`;
}

export function getDripTemplate(
  emailId: DripEmailId,
  firstName: string,
  locale: Locale,
  userId: string,
): DripEmailTemplate {
  const unsub = getUnsubscribeUrl(userId);

  switch (emailId) {
    // ── J+1: Welcome & Getting Started ──────────────────────────────────
    case DRIP_EMAIL_IDS.DAY_1: {
      const subject = locale === 'fr'
        ? `Bienvenue sur FoodTracks, ${firstName} ! Voici comment bien d\u00e9marrer`
        : `Welcome to FoodTracks, ${firstName}! Here\u2019s how to get started`;

      const heading = locale === 'fr'
        ? `Bienvenue, ${firstName} !`
        : `Welcome, ${firstName}!`;

      const intro = locale === 'fr'
        ? `Vous avez cr\u00e9\u00e9 votre compte FoodTracks \u2014 excellent choix ! Voici les 3 \u00e9tapes cl\u00e9s pour tirer le maximum de votre outil :`
        : `You\u2019ve created your FoodTracks account \u2014 great choice! Here are the 3 key steps to get the most out of your tool:`;

      const steps = locale === 'fr'
        ? [
            ['&#128230;', 'Ajoutez vos produits', 'R\u00e9f\u00e9rencez votre stock avec les dates de p\u00e9remption et les co\u00fbts.'],
            ['&#127859;', 'Cr\u00e9ez vos recettes', 'Associez vos ingr\u00e9dients pour calculer automatiquement les marges.'],
            ['&#128200;', 'Enregistrez vos ventes', 'Chaque vente met \u00e0 jour votre stock en temps r\u00e9el.'],
          ]
        : [
            ['&#128230;', 'Add your products', 'List your stock with expiry dates and costs.'],
            ['&#127859;', 'Create your recipes', 'Link ingredients to auto-calculate margins.'],
            ['&#128200;', 'Record your sales', 'Every sale updates your stock in real time.'],
          ];

      const ctaLabel = locale === 'fr' ? 'Acc\u00e9der au tableau de bord' : 'Go to dashboard';

      const content = `
        <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#F5F0EB;">${heading}</h1>
        <p style="margin:0 0 24px;font-size:15px;color:#9B9590;line-height:1.6;">${intro}</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          ${steps.map(([icon, title, desc]) => stepRow(icon, title, desc)).join('')}
        </table>
        ${ctaButton(ctaLabel, DASHBOARD_URL)}`;

      return { subject, html: dripBaseTemplate(content, unsub, locale) };
    }

    // ── J+3: AI Predictions ─────────────────────────────────────────────
    case DRIP_EMAIL_IDS.DAY_3: {
      const subject = locale === 'fr'
        ? `${firstName}, avez-vous test\u00e9 les pr\u00e9dictions IA ?`
        : `${firstName}, have you tried AI predictions?`;

      const heading = locale === 'fr'
        ? `Les pr\u00e9dictions IA, votre arme secr\u00e8te`
        : `AI predictions: your secret weapon`;

      const body = locale === 'fr'
        ? `<p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            Notre moteur d\u2019intelligence artificielle analyse vos ventes pass\u00e9es, la m\u00e9t\u00e9o et le jour de la semaine pour pr\u00e9dire exactement combien de plats pr\u00e9parer demain.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            R\u00e9sultat ? Moins de gaspillage, moins de ruptures, et des marges optimis\u00e9es.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#9B9590;line-height:1.6;">
            Cette fonctionnalit\u00e9 est disponible dans le plan <strong style="color:#E8590C;">PRO</strong> avec un essai gratuit de 14 jours.
          </p>`
        : `<p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            Our AI engine analyzes your past sales, weather, and day of week to predict exactly how many dishes to prepare tomorrow.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            The result? Less waste, fewer stockouts, and optimized margins.
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#9B9590;line-height:1.6;">
            This feature is available in the <strong style="color:#E8590C;">PRO</strong> plan with a free 14-day trial.
          </p>`;

      const ctaLabel = locale === 'fr' ? 'Essayer PRO gratuitement' : 'Try PRO for free';

      const content = `
        <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#F5F0EB;">${heading}</h1>
        ${body}
        ${ctaButton(ctaLabel, UPGRADE_URL)}`;

      return { subject, html: dripBaseTemplate(content, unsub, locale) };
    }

    // ── J+7: 7-day summary ──────────────────────────────────────────────
    case DRIP_EMAIL_IDS.DAY_7: {
      const subject = locale === 'fr'
        ? `${firstName}, 7 jours sur FoodTracks !`
        : `${firstName}, 7 days on FoodTracks!`;

      const heading = locale === 'fr'
        ? `D\u00e9j\u00e0 7 jours ensemble !`
        : `Already 7 days together!`;

      const body = locale === 'fr'
        ? `<p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            Vous utilisez FoodTracks depuis une semaine. Nous esp\u00e9rons que l\u2019outil vous aide d\u00e9j\u00e0 \u00e0 mieux g\u00e9rer votre stock et vos ventes.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            Saviez-vous que les utilisateurs PRO r\u00e9duisent en moyenne leur gaspillage de <strong style="color:#E8590C;">30%</strong> gr\u00e2ce aux pr\u00e9dictions IA ?
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#9B9590;line-height:1.6;">
            Passez au plan PRO avec <strong style="color:#E8590C;">14 jours d\u2019essai gratuit</strong> et d\u00e9bloquez toutes les fonctionnalit\u00e9s avanc\u00e9es.
          </p>`
        : `<p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            You\u2019ve been using FoodTracks for a week now. We hope it\u2019s already helping you manage your stock and sales more effectively.
          </p>
          <p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            Did you know that PRO users reduce waste by an average of <strong style="color:#E8590C;">30%</strong> thanks to AI predictions?
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#9B9590;line-height:1.6;">
            Upgrade to PRO with a <strong style="color:#E8590C;">free 14-day trial</strong> and unlock all advanced features.
          </p>`;

      const features = locale === 'fr'
        ? [
            ['&#129302;', 'Pr\u00e9dictions IA', 'Anticipez la demande gr\u00e2ce \u00e0 la m\u00e9t\u00e9o et l\u2019historique.'],
            ['&#128274;', 'Scanner de ventes', 'Scannez les tickets pour mettre \u00e0 jour le stock automatiquement.'],
            ['&#128202;', 'Analytics avanc\u00e9s', 'Tableaux de bord d\u00e9taill\u00e9s et exports.'],
          ]
        : [
            ['&#129302;', 'AI Predictions', 'Anticipate demand using weather & history.'],
            ['&#128274;', 'Sales Scanner', 'Scan receipts to auto-update stock.'],
            ['&#128202;', 'Advanced Analytics', 'Detailed dashboards and data exports.'],
          ];

      const ctaLabel = locale === 'fr' ? 'D\u00e9marrer l\u2019essai PRO gratuit' : 'Start free PRO trial';

      const content = `
        <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#F5F0EB;">${heading}</h1>
        ${body}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
          ${features.map(([icon, title, desc]) => stepRow(icon, title, desc)).join('')}
        </table>
        ${ctaButton(ctaLabel, UPGRADE_URL)}`;

      return { subject, html: dripBaseTemplate(content, unsub, locale) };
    }

    // ── J+13: Trial ending tomorrow ─────────────────────────────────────
    case DRIP_EMAIL_IDS.DAY_13: {
      const subject = locale === 'fr'
        ? `${firstName}, votre essai se termine demain !`
        : `${firstName}, your trial ends tomorrow!`;

      const heading = locale === 'fr'
        ? `Votre essai se termine demain`
        : `Your trial ends tomorrow`;

      const body = locale === 'fr'
        ? `<p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            Il ne vous reste plus qu\u2019un jour pour profiter de toutes les fonctionnalit\u00e9s PRO. Apr\u00e8s demain, vous perdrez l\u2019acc\u00e8s \u00e0 :
          </p>`
        : `<p style="margin:0 0 16px;font-size:15px;color:#9B9590;line-height:1.6;">
            You have just one day left to enjoy all PRO features. After tomorrow, you\u2019ll lose access to:
          </p>`;

      const lostFeatures = locale === 'fr'
        ? [
            ['&#10060;', 'Pr\u00e9dictions IA', 'Plus de pr\u00e9visions de demande automatis\u00e9es.'],
            ['&#10060;', 'Scanner de ventes IA', 'Retour \u00e0 la saisie manuelle.'],
            ['&#10060;', 'Analytics avanc\u00e9s', 'Plus d\u2019exports ni de tableaux d\u00e9taill\u00e9s.'],
            ['&#10060;', 'Alertes intelligentes', 'Plus de notifications proactives.'],
          ]
        : [
            ['&#10060;', 'AI Predictions', 'No more automated demand forecasts.'],
            ['&#10060;', 'AI Sales Scanner', 'Back to manual data entry.'],
            ['&#10060;', 'Advanced Analytics', 'No more exports or detailed dashboards.'],
            ['&#10060;', 'Smart Alerts', 'No more proactive notifications.'],
          ];

      const urgency = locale === 'fr'
        ? `<p style="margin:16px 0 24px;font-size:15px;color:#E8590C;font-weight:700;line-height:1.6;">
            Passez PRO maintenant pour ne rien perdre.
          </p>`
        : `<p style="margin:16px 0 24px;font-size:15px;color:#E8590C;font-weight:700;line-height:1.6;">
            Upgrade to PRO now so you don\u2019t lose anything.
          </p>`;

      const ctaLabel = locale === 'fr' ? 'Passer PRO maintenant' : 'Upgrade to PRO now';

      const content = `
        <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#F5F0EB;">${heading}</h1>
        ${body}
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
          ${lostFeatures.map(([icon, title, desc]) => stepRow(icon, title, desc)).join('')}
        </table>
        ${urgency}
        ${ctaButton(ctaLabel, UPGRADE_URL)}`;

      return { subject, html: dripBaseTemplate(content, unsub, locale) };
    }

    default:
      throw new Error(`Unknown drip email id: ${emailId}`);
  }
}
