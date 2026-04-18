/**
 * Outreach Batch -- 2026-04-13
 * Send 20 personalized emails to food trucks (FR, UK, US)
 * via Gmail (foodtracksio@gmail.com) using Chrome CDP on port 18800
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CDP_URL = 'http://127.0.0.1:18800';

const contacts = [
  // --- FRANCE (7) ---
  {
    name: 'Le Zinc Ambulant',
    email: 'contact@lezincambulant.fr',
    country: 'FR',
    notes: 'Cuisine bistro francaise, food truck evenementiel, Bretagne',
    lang: 'fr',
  },
  {
    name: 'La Roulotte Epicurienne',
    email: 'laroulotteepicurienne@gmail.com',
    country: 'FR',
    notes: 'Cuisine du terroir, food truck evenementiel, Alsace',
    lang: 'fr',
  },
  {
    name: 'Street Bouche',
    email: 'contact@streetbouche.com',
    country: 'FR',
    notes: 'Burgers premium et street food, Clermont-Ferrand / Auvergne',
    lang: 'fr',
  },
  {
    name: 'La Popote Nomade',
    email: 'lapopotenomade@gmail.com',
    country: 'FR',
    notes: 'Food truck traiteur, cuisine du marche, Bordeaux / Gironde',
    lang: 'fr',
  },
  {
    name: 'Roll & Bowl',
    email: 'rollandbowl.foodtruck@gmail.com',
    country: 'FR',
    notes: 'Cuisine asiatique et bowls, food truck, Lyon / Rhone',
    lang: 'fr',
  },
  {
    name: 'Le Comptoir Nomade',
    email: 'lecomptoirnomade@gmail.com',
    country: 'FR',
    notes: 'Plats du jour et cuisine maison, food truck, Nantes / Loire-Atlantique',
    lang: 'fr',
  },
  {
    name: 'La Cantina del Sur',
    email: 'contact@lacantinadelsur.fr',
    country: 'FR',
    notes: 'Cuisine mexicaine authentique, food truck evenementiel, Paris / IDF',
    lang: 'fr',
  },

  // --- UK (7) ---
  {
    name: 'Tikka Chance on Me',
    email: 'hello@tikkachanceonme.co.uk',
    country: 'UK',
    notes: 'Indian street food truck, events & markets, Birmingham / Midlands',
    lang: 'en',
  },
  {
    name: 'Holy Smoke BBQ',
    email: 'info@holysmokebbq.co.uk',
    country: 'UK',
    notes: 'American-style BBQ food truck, events & weddings, Brighton / South East',
    lang: 'en',
  },
  {
    name: 'The Wandering Kitchen',
    email: 'thewanderingkitchen@gmail.com',
    country: 'UK',
    notes: 'Gourmet street food truck, markets & corporate events, Cardiff / Wales',
    lang: 'en',
  },
  {
    name: 'Smokestak',
    email: 'hello@smokestak.com',
    country: 'UK',
    notes: 'Smoked meats & BBQ food truck, London',
    lang: 'en',
  },
  {
    name: 'Patty & Bun',
    email: 'hello@pattyandbun.co.uk',
    country: 'UK',
    notes: 'Craft burger food truck & street food, London',
    lang: 'en',
  },
  {
    name: 'The Wrap & Roll Co',
    email: 'info@thewrapandrollco.co.uk',
    country: 'UK',
    notes: 'Fusion wraps & rolls food truck, markets & festivals, Manchester',
    lang: 'en',
  },
  {
    name: 'Northern Soul Grilled Cheese',
    email: 'hello@northernsoulmc.com',
    country: 'UK',
    notes: 'Gourmet grilled cheese food truck, Manchester / Northern England',
    lang: 'en',
  },

  // --- USA (6) ---
  {
    name: 'Cousins Maine Lobster',
    email: 'catering@cousinsmainelobster.com',
    country: 'US',
    notes: 'Lobster food truck & catering, national franchise, multiple cities',
    lang: 'en',
  },
  {
    name: 'The Lunch Lady',
    email: 'info@lunchlady.la',
    country: 'US',
    notes: 'Vietnamese street food truck, Los Angeles CA',
    lang: 'en',
  },
  {
    name: 'Luke\'s Lobster Truck',
    email: 'events@lukeslobster.com',
    country: 'US',
    notes: 'Sustainable seafood food truck & catering, New York NY',
    lang: 'en',
  },
  {
    name: 'Hapa Food Truck',
    email: 'hapafoodtruck@gmail.com',
    country: 'US',
    notes: 'Hawaiian-Asian fusion food truck, Portland OR',
    lang: 'en',
  },
  {
    name: 'Whiz Wit or Witout',
    email: 'info@whizwitphilly.com',
    country: 'US',
    notes: 'Authentic Philly cheesesteak food truck, Philadelphia PA',
    lang: 'en',
  },
  {
    name: 'Mac Shack',
    email: 'macshacktruck@gmail.com',
    country: 'US',
    notes: 'Gourmet mac & cheese food truck, Dallas TX',
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
  const TODAY = '2026-04-13';

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
