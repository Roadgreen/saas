/**
 * Outreach Batch -- 2026-04-09
 * Send 20 personalized emails to food trucks (FR, UK, US)
 * via Gmail (foodtracksio@gmail.com) using Chrome CDP on port 18800
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CDP_URL = 'http://127.0.0.1:18800';

const contacts = [
  // --- FRANCE (7) ---
  {
    name: 'Pause Gourmande Foodtruck',
    email: 'pausegourmande4@gmail.com',
    country: 'FR',
    notes: 'Food truck burgers & street food, Montpellier / Herault',
    lang: 'fr',
  },
  {
    name: 'La Galette Bougnate',
    email: 'lagalettebougnate@gmail.com',
    country: 'FR',
    notes: 'Food truck galettes & crepes, Clermont-Ferrand / Puy-de-Dome',
    lang: 'fr',
  },
  {
    name: 'Gandz Ter',
    email: 'gandz.globale@gmail.com',
    country: 'FR',
    notes: 'Burgers basques & brasero food truck, Toulouse / Occitanie',
    lang: 'fr',
  },
  {
    name: 'Miam Yum',
    email: 'miamyum31@gmail.com',
    country: 'FR',
    notes: 'Food truck traiteur evenementiel, Toulouse / Lauragais',
    lang: 'fr',
  },
  {
    name: "L'Epicurieux",
    email: 'contact@lepicurieux.net',
    country: 'FR',
    notes: 'Food truck bagels & street food, Toulouse / Occitanie',
    lang: 'fr',
  },
  {
    name: 'Le Gavroche Food Truck',
    email: 'legavrochefoodtruck@gmail.com',
    country: 'FR',
    notes: 'Cuisine du Sud-Ouest, traiteur & food truck evenementiel, Bordeaux / Gironde',
    lang: 'fr',
  },
  {
    name: 'Toro Truck',
    email: 'contact@torotruck.com',
    country: 'FR',
    notes: 'Viande de taureau AOP Camargue, food truck evenementiel, Nimes / Gard',
    lang: 'fr',
  },

  // --- UK (7) ---
  {
    name: 'Streat Scullery',
    email: 'streatscullery@gmail.com',
    country: 'UK',
    notes: 'Bespoke street food truck, events & weddings, Glasgow / Scotland',
    lang: 'en',
  },
  {
    name: 'Kebabbar',
    email: 'hello@eatkebabbar.co.uk',
    country: 'UK',
    notes: 'Gourmet kebab street food truck, Edinburgh / Scotland',
    lang: 'en',
  },
  {
    name: 'Wee Green Events',
    email: 'info@theweegreen.com',
    country: 'UK',
    notes: 'Food trucks & corporate catering, Edinburgh / East Lothian',
    lang: 'en',
  },
  {
    name: 'Sugar & Rind',
    email: 'info@sugarandrind.com',
    country: 'UK',
    notes: 'Food truck hire & event catering, London & Cotswolds',
    lang: 'en',
  },
  {
    name: 'Chick and Pea',
    email: 'jeremy@chickandpea.co.uk',
    country: 'UK',
    notes: 'Street food & wedding catering truck, Edinburgh / Scotland',
    lang: 'en',
  },
  {
    name: 'Bristol Eats',
    email: 'weddings@bristoleats.co.uk',
    country: 'UK',
    notes: 'Street food truck hire & catering, Bristol',
    lang: 'en',
  },
  {
    name: 'Whamburg on Wheels',
    email: 'hello@whamburg.com',
    country: 'UK',
    notes: 'Artisan burger food truck, London / Cotswolds',
    lang: 'en',
  },

  // --- USA (6) ---
  {
    name: 'The Grilled Cheeserie',
    email: 'events@grilledcheeserie.com',
    country: 'US',
    notes: "Nashville's award-winning grilled cheese food truck, Nashville TN",
    lang: 'en',
  },
  {
    name: 'Whateke Mexican Food',
    email: 'whatekeseattle@gmail.com',
    country: 'US',
    notes: 'Mexican food truck & catering, Seattle WA',
    lang: 'en',
  },
  {
    name: "Brank's BBQ",
    email: 'catering@branksbbq.com',
    country: 'US',
    notes: 'Southern BBQ food truck & catering, Seattle / Sumner WA',
    lang: 'en',
  },
  {
    name: 'The Crock Spot',
    email: 'info@thecrockspot.com',
    country: 'US',
    notes: 'Gourmet food truck & catering, Denver CO',
    lang: 'en',
  },
  {
    name: 'Denver Taco Truck',
    email: 'info@denvertacotruck.com',
    country: 'US',
    notes: 'Fusion taco food truck & catering, Denver CO',
    lang: 'en',
  },
  {
    name: 'EHijole Tacos',
    email: 'order@ehijoletacos.com',
    country: 'US',
    notes: 'Fresh taco catering food truck, Denver CO',
    lang: 'en',
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeSubject(c) {
  if (c.lang === 'fr') {
    return `FoodTracks -- optimisez vos previsions de vente, ${c.name}`;
  }
  return `FoodTracks -- smarter sales forecasting for ${c.name}`;
}

function makeBody(c) {
  if (c.lang === 'fr') {
    return `Bonjour,

Je me permets de vous contacter au sujet de FoodTracks, une plateforme SaaS concue specialement pour les food trucks comme ${c.name}.

En quelques mots, FoodTracks vous aide a :
- Prevoir vos ventes selon votre emplacement, la meteo et vos historiques
- Reduire le gaspillage alimentaire grace aux previsions IA
- Analyser vos performances en temps reel depuis votre dashboard

La plupart de nos utilisateurs economisent 15 a 25% sur leurs achats de matieres premieres des le premier mois.

Si vous etes interesse(e), vous pouvez essayer gratuitement sur foodtracks.io, aucune carte bancaire requise.

Cordialement,
FoodTracks Team
foodtracks.io`;
  }

  return `Hi,

I'm reaching out about FoodTracks, a SaaS platform built specifically for food trucks like ${c.name}.

In short, FoodTracks helps you:
- Forecast sales based on your location, weather, and past performance
- Reduce food waste with AI-powered predictions
- Track your performance in real time from a clean dashboard

Most of our users save 15 to 25% on ingredient costs within the first month.

If you're interested, feel free to try it for free at foodtracks.io, no credit card required.

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
  const sendBtn = await page.waitForSelector(
    'div[data-tooltip="Envoyer \u202a(Ctrl-Entree)\u202c"], div[data-tooltip="Send \u202a(Ctrl-Enter)\u202c"], div[aria-label*="Send"], div[aria-label*="Envoyer"]',
    { timeout: 8000 }
  );
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
  const TODAY = '2026-04-09';

  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];
    const subject = makeSubject(c);
    const body = makeBody(c);
    console.log(`[${i + 1}/${contacts.length}] Sending to ${c.name} (${c.email})...`);

    try {
      await sendEmail(page, c.email, subject, body);
      results.push({ ...c, status: 'envoye', date: TODAY });
      console.log(`  OK Sent`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
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

  block += `\n---\n\n_Session ${TODAY} : ${sentCount} emails envoyes (${frCount} FR, ${ukCount} UK, ${usCount} US)`;
  if (failedCount > 0) block += `, ${failedCount} echecs`;
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
