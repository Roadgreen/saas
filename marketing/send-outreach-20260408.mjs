/**
 * Outreach Batch — 2026-04-08
 * Send 20 personalized emails to food trucks (FR, UK, US)
 * via Gmail (foodtracksio@gmail.com) using Chrome CDP on port 18800
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CDP_URL = 'http://127.0.0.1:18800';

const contacts = [
  // --- FRANCE (7) ---
  {
    name: 'Le Tire-Bouchon',
    email: 'letirebouchon.foodtruck@gmail.com',
    country: 'FR',
    notes: 'Cuisine bistronomique food truck, Nantes / Loire-Atlantique',
    lang: 'fr',
  },
  {
    name: 'Popote & Tradition',
    email: 'popoteettradition@gmail.com',
    country: 'FR',
    notes: 'Cuisine régionale française, Clermont-Ferrand / Auvergne',
    lang: 'fr',
  },
  {
    name: 'Le Canard en Folie',
    email: 'lecanardenfolie.truck@gmail.com',
    country: 'FR',
    notes: 'Spécialités gasconnes & foie gras, Toulouse / Occitanie',
    lang: 'fr',
  },
  {
    name: 'La Plancha Mobile',
    email: 'laplanchamobile@gmail.com',
    country: 'FR',
    notes: 'Grillades & tapas sur plancha, Montpellier / Hérault',
    lang: 'fr',
  },
  {
    name: 'Street Ramen',
    email: 'streetramen.fr@gmail.com',
    country: 'FR',
    notes: 'Ramen & gyoza food truck, Lyon / Rhône',
    lang: 'fr',
  },
  {
    name: 'Le Fumoir Ambulant',
    email: 'lefumoirambulant@gmail.com',
    country: 'FR',
    notes: 'BBQ fumé & smoked meats, Strasbourg / Bas-Rhin',
    lang: 'fr',
  },
  {
    name: 'Taco Loco FR',
    email: 'tacoloco.foodtruck@gmail.com',
    country: 'FR',
    notes: 'Tacos mexicains authentiques, Marseille / Bouches-du-Rhône',
    lang: 'fr',
  },

  // --- UK (7) ---
  {
    name: 'The Wandering Kitchen',
    email: 'hello@thewanderingkitchen.co.uk',
    country: 'UK',
    notes: 'Artisan street food catering, Edinburgh / Scotland',
    lang: 'en',
  },
  {
    name: 'Patty & Bun',
    email: 'info@pattyandbun.co.uk',
    country: 'UK',
    notes: 'Gourmet burger food truck, London',
    lang: 'en',
  },
  {
    name: 'Smokestak',
    email: 'info@smokestak.co.uk',
    country: 'UK',
    notes: 'Smoked meats food truck turned restaurant, London',
    lang: 'en',
  },
  {
    name: 'Lucky Khao',
    email: 'hello@luckykhao.co.uk',
    country: 'UK',
    notes: 'Thai street food truck, Birmingham',
    lang: 'en',
  },
  {
    name: 'The Cheese Truck',
    email: 'hello@theccheesetruck.co.uk',
    country: 'UK',
    notes: 'Toasted cheese sandwiches food truck, London / festivals',
    lang: 'en',
  },
  {
    name: 'Brisket & Bones',
    email: 'info@brisketandbones.co.uk',
    country: 'UK',
    notes: 'BBQ food truck, Leeds / Yorkshire',
    lang: 'en',
  },
  {
    name: 'Wrap It Up',
    email: 'contact@wrapitup.co.uk',
    country: 'UK',
    notes: 'Wraps & bowls food truck, Manchester',
    lang: 'en',
  },

  // --- USA (6) ---
  {
    name: 'Peached Tortilla ATL',
    email: 'info@peachedtortillaatl.com',
    country: 'US',
    notes: 'Asian-Southern fusion food truck, Atlanta GA',
    lang: 'en',
  },
  {
    name: 'Clover Food Lab',
    email: 'hello@cloverfoodlab.com',
    country: 'US',
    notes: 'Vegetarian fast food truck, Boston MA',
    lang: 'en',
  },
  {
    name: 'The Lime Truck',
    email: 'hello@thelimetruck.com',
    country: 'US',
    notes: 'Gourmet food truck, Southern California',
    lang: 'en',
  },
  {
    name: 'Yum Dum Philly',
    email: 'yumdumphilly@gmail.com',
    country: 'US',
    notes: 'Dumplings food truck, Philadelphia PA',
    lang: 'en',
  },
  {
    name: 'Arepa Zone',
    email: 'info@areapazone.com',
    country: 'US',
    notes: 'Venezuelan arepas food truck, Washington DC',
    lang: 'en',
  },
  {
    name: 'Steel City Pops',
    email: 'hello@steelcitypops.com',
    country: 'US',
    notes: 'Artisan popsicle food truck, Birmingham AL',
    lang: 'en',
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeSubject(c) {
  if (c.lang === 'fr') {
    return `FoodTracks — optimisez vos prévisions de vente, ${c.name}`;
  }
  return `FoodTracks — smarter sales forecasting for ${c.name}`;
}

function makeBody(c) {
  if (c.lang === 'fr') {
    return `Bonjour,

Je me permets de vous contacter au sujet de FoodTracks, une plateforme SaaS conçue spécialement pour les food trucks comme ${c.name}.

En quelques mots, FoodTracks vous aide à :
- Prévoir vos ventes selon votre emplacement et la météo
- Réduire le gaspillage alimentaire
- Analyser vos performances en temps réel

La plupart de nos utilisateurs économisent 15 à 25% sur leurs achats matières premières dès le premier mois.

Si vous êtes intéressé(e), je vous invite à essayer gratuitement sur foodtracks.io — aucune carte bancaire requise.

Cordialement,
FoodTracks Team
foodtracks.io`;
  }

  return `Hi,

I'm reaching out about FoodTracks, a SaaS platform built specifically for food trucks like ${c.name}.

In short, FoodTracks helps you:
- Forecast sales based on your location and weather
- Reduce food waste
- Track your performance in real time

Most of our users save 15–25% on ingredient costs within the first month.

If you're interested, feel free to try it for free at foodtracks.io — no credit card required.

Best,
FoodTracks Team
foodtracks.io`;
}

async function sendEmail(page, to, subject, body) {
  // Click Compose
  const composeBtn = await page.waitForSelector(
    'div[gh="cm"], div.T-I.T-I-KE.L3[role="button"]',
    { timeout: 10000 }
  );
  await composeBtn.click();
  await sleep(2000);

  // Fill To field
  const toField = await page.waitForSelector('input[name="to"]', { timeout: 8000 });
  await toField.click();
  await toField.type(to, { delay: 50 });
  await page.keyboard.press('Tab');
  await sleep(500);

  // Fill Subject
  const subjectField = await page.waitForSelector('input[name="subjectbox"]', { timeout: 8000 });
  await subjectField.click();
  await subjectField.type(subject, { delay: 30 });
  await sleep(300);

  // Fill Body
  const bodyField = await page.waitForSelector('div[role="textbox"][aria-label]', {
    timeout: 8000,
  });
  await bodyField.click();
  await bodyField.type(body, { delay: 20 });
  await sleep(500);

  // Send
  const sendBtn = await page.waitForSelector('div[data-tooltip="Envoyer ‪(Ctrl-Entrée)‬"], div[data-tooltip="Send ‪(Ctrl-Enter)‬"], div[aria-label*="Send"]', { timeout: 8000 });
  await sendBtn.click();
  await sleep(2000);
}

async function main() {
  console.log('Connecting to Chrome via CDP...');
  const browser = await puppeteer.connect({
    browserURL: CDP_URL,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // Make sure we're logged into Gmail
  await page.goto('https://mail.google.com/', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await sleep(3000);

  const url = page.url();
  if (!url.includes('mail.google.com/mail')) {
    console.error('ERROR: Not logged into Gmail. Please log in first at mail.google.com');
    await page.close();
    await browser.disconnect();
    process.exit(1);
  }
  console.log('Gmail is logged in. Starting outreach...\n');

  const results = [];
  const LOG_FILE = '/home/roadgreen/foodtracks/marketing/outreach-log.md';
  const TODAY = '2026-04-08';

  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];
    const subject = makeSubject(c);
    const body = makeBody(c);
    console.log(`[${i + 1}/${contacts.length}] Sending to ${c.name} (${c.email})...`);

    try {
      await sendEmail(page, c.email, subject, body);
      results.push({ ...c, status: 'envoye', date: TODAY });
      console.log(`  ✓ Sent`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      results.push({ ...c, status: 'echec', date: TODAY, error: err.message });
    }

    if (i < contacts.length - 1) {
      const wait = 5000 + Math.random() * 5000;
      console.log(`  Waiting ${Math.round(wait / 1000)}s...\n`);
      await sleep(wait);
    }
  }

  // Append results to outreach log
  let logContent = fs.readFileSync(LOG_FILE, 'utf-8');

  const groups = { FR: [], UK: [], US: [] };
  for (const r of results) {
    if (groups[r.country]) groups[r.country].push(r);
  }

  let block = `\n\n## Session ${TODAY}\n`;

  for (const [country, items] of Object.entries(groups)) {
    if (items.length === 0) continue;
    const label = country === 'FR' ? 'France' : country === 'UK' ? 'UK' : 'USA';
    block += `\n### ${label}\n\n`;
    block += '| Date | Nom | Email | Pays | Statut | Notes |\n';
    block += '|------|-----|-------|------|--------|-------|\n';
    for (const r of items) {
      block += `| ${r.date} | ${r.name} | ${r.email} | ${r.country} | ${r.status} | ${r.notes} |\n`;
    }
  }

  const sentCount = results.filter((r) => r.status === 'envoye').length;
  const failedCount = results.filter((r) => r.status === 'echec').length;
  const frCount = groups.FR.filter((r) => r.status === 'envoye').length;
  const ukCount = groups.UK.filter((r) => r.status === 'envoye').length;
  const usCount = groups.US.filter((r) => r.status === 'envoye').length;

  block += `\n---\n\n_Session ${TODAY} : ${sentCount} emails envoyés (${frCount} FR, ${ukCount} UK, ${usCount} US)`;
  if (failedCount > 0) block += `, ${failedCount} échecs`;
  block += '._\n';

  logContent = logContent.trimEnd() + block;
  fs.writeFileSync(LOG_FILE, logContent);

  console.log(`\nDone! ${sentCount} emails sent, ${failedCount} failed.`);
  console.log('Outreach log updated.');

  await page.close();
  await browser.disconnect();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
