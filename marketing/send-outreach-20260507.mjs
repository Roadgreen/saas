/**
 * Outreach Batch — 2026-05-07
 * Send 20 personalized emails to food trucks (FR, UK, US)
 * via Gmail (foodtracksio@gmail.com) using Chrome CDP on port 18800
 * Signed: FoodTracks Team
 * All contacts verified as new (no duplicates with outreach-log.md)
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CDP_URL = 'http://127.0.0.1:18800';

const contacts = [
  // --- FRANCE (7) ---
  {
    name: 'La Street Tortilla',
    email: 'lastrtortilla.foodtruck@gmail.com',
    country: 'FR',
    notes: 'Tacos mexicains street food, Lyon / Rhône-Alpes',
    lang: 'fr',
  },
  {
    name: 'Les Copains d\'Abord',
    email: 'lescopainsdabord.ft@gmail.com',
    country: 'FR',
    notes: 'Cuisine du terroir fait maison, food truck Strasbourg / Grand Est',
    lang: 'fr',
  },
  {
    name: 'Truck à Frite',
    email: 'truckafrite.foodtruck@gmail.com',
    country: 'FR',
    notes: 'Friterie belge gourmet et hamburgers, Lille / Hauts-de-France',
    lang: 'fr',
  },
  {
    name: 'La Caravane Épicée',
    email: 'lacaravaneepicee@gmail.com',
    country: 'FR',
    notes: 'Cuisine indienne et currys maison, food truck Paris / IDF',
    lang: 'fr',
  },
  {
    name: 'Nomad Sushi',
    email: 'nomadsushi.ft@gmail.com',
    country: 'FR',
    notes: 'Sushi et cuisine japonaise nomade, Bordeaux / Nouvelle-Aquitaine',
    lang: 'fr',
  },
  {
    name: 'L\'Atelier des Saveurs',
    email: 'atelierdessaveurs.ft@gmail.com',
    country: 'FR',
    notes: 'Cuisine gastronomique accessible et créative, Nice / PACA',
    lang: 'fr',
  },
  {
    name: 'Le Food Bus',
    email: 'lefoodbus.fr@gmail.com',
    country: 'FR',
    notes: 'Street food éclectique dans un bus anglais réhabilité, Nantes',
    lang: 'fr',
  },

  // --- UK (7) ---
  {
    name: 'The Wholesome Truck',
    email: 'wholesometruck.uk@gmail.com',
    country: 'UK',
    notes: 'Healthy plant-based street food, Manchester / North West',
    lang: 'en',
  },
  {
    name: 'Seoul Food UK',
    email: 'seoulfooduk@gmail.com',
    country: 'UK',
    notes: 'Korean street food and bibimbap bowls, Birmingham',
    lang: 'en',
  },
  {
    name: 'The Greek Street',
    email: 'thegreekstreet.uk@gmail.com',
    country: 'UK',
    notes: 'Authentic Greek street food and gyros, Edinburgh',
    lang: 'en',
  },
  {
    name: 'Maki Maki Roll',
    email: 'makimakiroll.uk@gmail.com',
    country: 'UK',
    notes: 'Japanese sushi rolls street food truck, Leeds markets',
    lang: 'en',
  },
  {
    name: 'Falafel Kings',
    email: 'falafelkings.uk@gmail.com',
    country: 'UK',
    notes: 'Middle Eastern street food and wraps, London markets',
    lang: 'en',
  },
  {
    name: 'Smoke & Mirrors BBQ',
    email: 'smokemirrorsbbq.uk@gmail.com',
    country: 'UK',
    notes: 'Craft slow-smoked BBQ food truck, Bristol / South West',
    lang: 'en',
  },
  {
    name: 'The Curry Caravan',
    email: 'currycaravan.uk@gmail.com',
    country: 'UK',
    notes: 'British-Indian fusion street food, Nottingham / East Midlands',
    lang: 'en',
  },

  // --- USA (6) ---
  {
    name: 'Pho King Awesome',
    email: 'phokingawesometruck@gmail.com',
    country: 'US',
    notes: 'Vietnamese pho and banh mi food truck, Austin TX',
    lang: 'en',
  },
  {
    name: 'Mac Attack Truck',
    email: 'macattacktruck.co@gmail.com',
    country: 'US',
    notes: 'Gourmet mac & cheese variations food truck, Denver CO',
    lang: 'en',
  },
  {
    name: 'Seoul Taco STL',
    email: 'seoultacostl@gmail.com',
    country: 'US',
    notes: 'Korean-Mexican fusion tacos and bowls, St. Louis MO',
    lang: 'en',
  },
  {
    name: 'Fried Chicken Empire',
    email: 'friedchickenempire.atl@gmail.com',
    country: 'US',
    notes: 'Southern fried chicken and comfort food truck, Atlanta GA',
    lang: 'en',
  },
  {
    name: 'The Arepa Zone',
    email: 'theareparzone.dc@gmail.com',
    country: 'US',
    notes: 'Venezuelan arepas and street food, Washington DC',
    lang: 'en',
  },
  {
    name: 'Grilled Cheese Mania',
    email: 'grilledcheesemania.la@gmail.com',
    country: 'US',
    notes: 'Artisan grilled cheese sandwiches food truck, Los Angeles CA',
    lang: 'en',
  },
];

function makeSubject(c) {
  if (c.lang === 'fr') {
    return 'Un outil gratuit pour mieux choisir vos spots de vente';
  }
  return 'A free tool to help you find your best selling spots';
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

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendEmail(page, to, subject, body) {
  // Ensure we are on Gmail inbox
  if (!page.url().includes('mail.google.com')) {
    await page.goto('https://mail.google.com/mail/u/0/?shva=1#inbox', { waitUntil: 'networkidle2', timeout: 30000 });
    await sleep(4000);
  }

  // Click compose via JS (bypasses clickability check)
  await page.waitForSelector('[gh="cm"]', { timeout: 10000 });
  await page.evaluate(() => document.querySelector('[gh="cm"]').click());
  await sleep(2000);

  const toField = await page.waitForSelector('[name="to"]', { timeout: 10000 });
  await toField.type(to, { delay: 40 });
  await page.keyboard.press('Tab');
  await sleep(500);

  const subjectField = await page.waitForSelector('[name="subjectbox"]', { timeout: 10000 });
  await page.evaluate(() => document.querySelector('[name="subjectbox"]').focus());
  await subjectField.type(subject, { delay: 30 });
  await sleep(300);

  const bodyField = await page.waitForSelector('[aria-label="Corps du message"]', { timeout: 10000 }).catch(() =>
    page.waitForSelector('[aria-label="Message Body"]', { timeout: 5000 })
  );
  await page.evaluate(() => {
    const b = document.querySelector('[aria-label="Corps du message"]') || document.querySelector('[aria-label="Message Body"]');
    if (b) b.focus();
  });
  await bodyField.type(body, { delay: 8 });
  await sleep(500);

  // Click send button using partial tooltip match
  const sendClicked = await page.evaluate(() => {
    const btn = document.querySelector('[data-tooltip*="Envoyer"]') || document.querySelector('[data-tooltip*="Send"]');
    if (!btn) throw new Error('Send button not found');
    btn.click();
    return true;
  });
  await sleep(2500);
}

async function main() {
  const browser = await puppeteer.connect({ browserURL: CDP_URL });
  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();

  await page.goto('https://mail.google.com/mail/u/0/?shva=1#inbox', { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(5000);
  const currentUrl = page.url();
  console.log('Gmail URL:', currentUrl.substring(0,80));
  if (!currentUrl.includes('mail.google.com')) { console.error('Not on Gmail!'); process.exit(1); }
  await sleep(2000);

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
  const TODAY = '2026-05-07';

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
      await page.goto('https://mail.google.com/mail/u/0/?shva=1#inbox', { waitUntil: 'domcontentloaded', timeout: 20000 });
      const wait = 5000 + Math.random() * 3000;
      console.log(`  Waiting ${Math.round(wait / 1000)}s...\n`);
      await sleep(wait);
    }
  }

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
