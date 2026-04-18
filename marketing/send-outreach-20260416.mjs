/**
 * Outreach Batch -- 2026-04-16
 * Send 20 personalized emails to food trucks (FR, UK, US)
 * via Gmail (foodtracksio@gmail.com) using Chrome CDP on port 18800
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CDP_URL = 'http://127.0.0.1:18800';

const contacts = [
  // --- FRANCE (7) ---
  {
    name: 'Le Camion Qui Fume',
    email: 'contact@lecamionquifume.com',
    country: 'FR',
    notes: 'Burger gourmet street food, Paris — pionnier du food truck francais',
    lang: 'fr',
  },
  {
    name: 'Cantine California',
    email: 'cantinecalifornia@gmail.com',
    country: 'FR',
    notes: 'Cuisine californienne et bowls, food truck Paris / IDF',
    lang: 'fr',
  },
  {
    name: 'Le Baobab Food Truck',
    email: 'lebaobabfoodtruck@gmail.com',
    country: 'FR',
    notes: 'Cuisine africaine et senegalaise, food truck Lyon',
    lang: 'fr',
  },
  {
    name: 'Naan Stop',
    email: 'naanstop.foodtruck@gmail.com',
    country: 'FR',
    notes: 'Street food indien et naans, food truck Marseille / PACA',
    lang: 'fr',
  },
  {
    name: 'La Creperie Nomade',
    email: 'lacreperienomade@gmail.com',
    country: 'FR',
    notes: 'Crepes et galettes bretonnes, food truck evenementiel, Rennes',
    lang: 'fr',
  },
  {
    name: 'Truck & Roll',
    email: 'truckandroll.paris@gmail.com',
    country: 'FR',
    notes: 'Cuisine fusion asiatique, food truck Paris',
    lang: 'fr',
  },
  {
    name: 'Le Wagon Gourmand',
    email: 'lewagongourmand@gmail.com',
    country: 'FR',
    notes: 'Gastronomie en mouvement, food truck traiteur, Nantes',
    lang: 'fr',
  },
  // --- UK (7) ---
  {
    name: 'Biff\'s Jack Shack',
    email: 'hello@biffsjackshack.com',
    country: 'UK',
    notes: 'Vegan jackfruit street food, London',
    lang: 'en',
  },
  {
    name: 'Patty & Bun',
    email: 'hello@pattyandbun.co.uk',
    country: 'UK',
    notes: 'Craft burger food truck & restaurant, London',
    lang: 'en',
  },
  {
    name: 'Club Mexicana',
    email: 'hello@clubmexicana.com',
    country: 'UK',
    notes: 'Vegan Mexican street food truck, London',
    lang: 'en',
  },
  {
    name: 'Yum Bun',
    email: 'yumbun@gmail.com',
    country: 'UK',
    notes: 'Asian-inspired bao buns food truck, London markets',
    lang: 'en',
  },
  {
    name: 'The Hungry Donkey',
    email: 'info@thehungrydonkey.co.uk',
    country: 'UK',
    notes: 'Greek street food truck, London',
    lang: 'en',
  },
  {
    name: 'Pizza Pilgrims',
    email: 'hello@pizzapilgrims.co.uk',
    country: 'UK',
    notes: 'Neapolitan pizza van turned street food empire, London',
    lang: 'en',
  },
  {
    name: 'Big Apple Hot Dogs',
    email: 'info@bigapplehotdogs.com',
    country: 'UK',
    notes: 'NYC-style hot dog cart/truck, London Old Street',
    lang: 'en',
  },
  // --- USA (6) ---
  {
    name: 'Cousins Maine Lobster',
    email: 'info@cousinsmainelobster.com',
    country: 'US',
    notes: 'Maine lobster rolls food truck franchise, nationwide US (Shark Tank)',
    lang: 'en',
  },
  {
    name: 'Luke\'s Lobster',
    email: 'catering@lukeslobster.com',
    country: 'US',
    notes: 'Lobster roll food truck & shacks, Portland ME / NYC',
    lang: 'en',
  },
  {
    name: 'Wafels & Dinges',
    email: 'info@wafelsanddinges.com',
    country: 'US',
    notes: 'Belgian waffle truck, New York City',
    lang: 'en',
  },
  {
    name: 'The Lobos Truck',
    email: 'thelobostruck@gmail.com',
    country: 'US',
    notes: 'Latin fusion food truck, Los Angeles CA',
    lang: 'en',
  },
  {
    name: 'Big Star Food Truck',
    email: 'bigstarfoodtruck@gmail.com',
    country: 'US',
    notes: 'Tacos and street food, Chicago IL',
    lang: 'en',
  },
  {
    name: 'Marination Mobile',
    email: 'info@marinationmobile.com',
    country: 'US',
    notes: 'Hawaiian-Korean fusion food truck, Seattle WA',
    lang: 'en',
  },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function makeSubject(c) {
  if (c.lang === 'fr') {
    return 'FoodTracks — Prédisez vos ventes avant de vous déplacer';
  }
  return 'FoodTracks — Predict your sales before you move your truck';
}

function makeBody(c) {
  if (c.lang === 'fr') {
    return `Bonjour ${c.name},

Je me permets de vous contacter au sujet de FoodTracks.io, un outil conçu spécifiquement pour les food truckers.

FoodTracks analyse en temps réel la météo, les événements locaux et les habitudes de consommation pour vous aider à prédire vos ventes selon l'emplacement. Fini les déplacements à perte — vous choisissez vos spots avec des données concrètes.

Quelques fonctionnalités :
- Prédictions de ventes par lieu et par créneau horaire
- Suivi de votre trésorerie en temps réel
- Scan de vos ingrédients pour anticiper le gaspillage
- Connexion directe avec votre terminal SumUp

C'est gratuit pour commencer : foodtracks.io

Bonne continuation,
FoodTracks Team`;
  }
  return `Hi ${c.name},

I'm reaching out about FoodTracks.io, a tool built specifically for food truck operators like you.

FoodTracks analyzes real-time weather, local events, and consumer patterns to help you predict sales by location — so you move your truck where the customers are, not the other way around.

Key features:
- Sales predictions by location and time slot
- Real-time cash flow tracking
- Ingredient scanning to cut waste
- Direct SumUp terminal integration

Free to get started: foodtracks.io

Best,
FoodTracks Team`;
}

async function sendEmail(page, to, subject, body) {
  // Click compose button
  const composeBtn = await page.waitForSelector('[gh="cm"]', { timeout: 10000 });
  await composeBtn.click();
  await sleep(2000);

  // Fill To field
  const toField = await page.waitForSelector('[name="to"]', { timeout: 10000 });
  await toField.click();
  await toField.type(to, { delay: 50 });
  await page.keyboard.press('Tab');
  await sleep(500);

  // Fill Subject field
  const subjectField = await page.waitForSelector('[name="subjectbox"]', { timeout: 10000 });
  await subjectField.click();
  await subjectField.type(subject, { delay: 30 });
  await sleep(300);

  // Fill body
  const bodyField = await page.waitForSelector('[role="textbox"][aria-label*="Message"]', { timeout: 10000 });
  await bodyField.click();
  await bodyField.type(body, { delay: 20 });
  await sleep(500);

  // Send
  const sendBtn = await page.waitForSelector('[data-tooltip*="Send"] [data-tooltip*="Send"], [aria-label*="Send "]', { timeout: 10000 });
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
  const TODAY = '2026-04-16';

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
