/**
 * Outreach Batch 3 — 2026-03-23
 * Send 20 personalized emails to food trucks (FR, UK, US)
 * via Gmail (foodtracksio@gmail.com) using Chrome CDP on port 18800
 */

import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CDP_URL = 'http://127.0.0.1:18800';

const contacts = [
  // --- FRANCE (6) ---
  {
    name: 'Autour de la Poêle',
    email: 'autourdelapoele@gmail.com',
    country: 'FR',
    notes: 'Pizza napolitaine au feu de bois, Lille / Hauts-de-France',
    lang: 'fr',
  },
  {
    name: 'Au Four et au Moulin',
    email: 'contact@au-four-et-au-moulin.com',
    country: 'FR',
    notes: 'Pizza / crêpes / galettes traiteur, Caen / Normandie',
    lang: 'fr',
  },
  {
    name: 'En Faim Prêt de Chez Vous',
    email: 'contact@enfaimpretdechezvous.fr',
    country: 'FR',
    notes: 'Food truck événementiel, Mérignac / Bordeaux',
    lang: 'fr',
  },
  {
    name: 'La Cuisine Vagabonde',
    email: 'lctraiteur69@gmail.com',
    country: 'FR',
    notes: 'Food truck traiteur brasero / paella, Saint-Étienne / Loire',
    lang: 'fr',
  },
  {
    name: 'Mr. Diot',
    email: 'info@mrdiot.com',
    country: 'FR',
    notes: 'Cuisine savoyarde food truck, Aix-les-Bains / Savoie',
    lang: 'fr',
  },
  {
    name: 'La Chill Zone',
    email: 'contact@lachillzone.com',
    country: 'FR',
    notes: 'Poutines & bagels food truck, Annecy / Haute-Savoie',
    lang: 'fr',
  },
  // --- UK (6) ---
  {
    name: 'Kitchen Street',
    email: 'info@kitchenstreet.co.uk',
    country: 'UK',
    notes: 'Events & catering food truck, Glasgow',
    lang: 'en',
  },
  {
    name: 'The Pizza Post',
    email: 'events@thepizzapost.co.uk',
    country: 'UK',
    notes: 'Pizza food truck catering, London / South East',
    lang: 'en',
  },
  {
    name: 'Urban Food Fest',
    email: 'events@urbanfoodfest.com',
    country: 'UK',
    notes: 'Street food truck hire & events, London',
    lang: 'en',
  },
  {
    name: 'Civerinos',
    email: 'hotline@civerinos.com',
    country: 'UK',
    notes: 'Wood-fired pizza food truck, Edinburgh / Glasgow',
    lang: 'en',
  },
  {
    name: 'The Otley Burger Company',
    email: 'theotleyburgerco@outlook.com',
    country: 'UK',
    notes: 'Burger food truck, Glasgow',
    lang: 'en',
  },
  {
    name: 'Peepal UK',
    email: 'info@peepaluk.com',
    country: 'UK',
    notes: 'Mobile catering excellence, London / multi-city',
    lang: 'en',
  },
  // --- USA (8) ---
  {
    name: 'Rip City Grill',
    email: 'RipCityGrill@gmail.com',
    country: 'US',
    notes: 'Wood-fired catering food truck, Portland OR',
    lang: 'en',
  },
  {
    name: 'The Peached Tortilla',
    email: 'catering@thepeachedtortilla.com',
    country: 'US',
    notes: 'Asian fusion food truck catering, Austin TX',
    lang: 'en',
  },
  {
    name: 'Phat Cart',
    email: 'rika@phatcartpdx.com',
    country: 'US',
    notes: 'Asian fusion comfort food, Portland OR',
    lang: 'en',
  },
  {
    name: 'Mountain Crust Pizza',
    email: 'party@mountaincrust.com',
    country: 'US',
    notes: 'Wood-fired pizza catering trucks, Denver CO',
    lang: 'en',
  },
  {
    name: 'Southern Spoon',
    email: 'info@southernspoontn.com',
    country: 'US',
    notes: 'Food truck catering, Nashville TN',
    lang: 'en',
  },
  {
    name: 'Foreign Policy Truck',
    email: 'foreignpolicytruck@gmail.com',
    country: 'US',
    notes: 'Food truck, Houston TX',
    lang: 'en',
  },
  {
    name: "Tex's Tacos",
    email: 'info@texstacos.com',
    country: 'US',
    notes: "Atlanta's most awarded taco food truck, Atlanta GA",
    lang: 'en',
  },
  {
    name: 'Cattywampus Grill',
    email: 'cattywampusgrill@gmail.com',
    country: 'US',
    notes: 'Food truck catering, Atlanta GA',
    lang: 'en',
  },
];

function makeSubject(contact) {
  if (contact.lang === 'fr') {
    const variants = [
      `${contact.name} — un outil IA pensé pour les food trucks`,
      `${contact.name} — prévoir vos ventes, ça change tout`,
      `${contact.name} — et si vous pouviez anticiper vos journées ?`,
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }
  const variants = [
    `${contact.name} — an AI tool built for food trucks`,
    `${contact.name} — predict your sales, plan your day`,
    `${contact.name} — what if you could forecast your busiest days?`,
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}

function makeBody(contact) {
  if (contact.lang === 'fr') {
    return `Bonjour l'équipe ${contact.name},

Je me permets de vous écrire car je suis tombé sur votre activité et j'ai trouvé votre concept vraiment chouette.

On développe FoodTracks.io, un outil pensé spécifiquement pour les food trucks. L'idée est simple : grâce à l'IA, on vous aide à prévoir vos ventes et à planifier vos stocks en fonction de la météo, du lieu, du jour de la semaine, des événements autour de vous, etc.

Concrètement, ça veut dire : moins de gaspillage, moins de ruptures, et plus de chiffre d'affaires les bons jours.

On est encore en phase de lancement et on cherche des food trucks motivés pour tester l'outil (c'est gratuit au début). Si ça vous parle, n'hésitez pas à jeter un œil sur https://foodtracks.io ou à me répondre directement — je serais ravi d'en discuter.

Belle continuation à vous !

— FoodTracks Team
https://foodtracks.io`;
  }

  return `Hi ${contact.name} team,

I came across your food truck and really like what you're doing — great concept!

We're building FoodTracks.io, an AI-powered tool designed specifically for food trucks. It helps you forecast daily sales and plan your inventory based on weather, location, day of the week, local events, and more.

The result: less food waste, fewer stockouts, and more revenue on your best days.

We're currently in early launch and looking for food truck operators to try the tool out (it's free to start). If that sounds interesting, feel free to check out https://foodtracks.io or just reply to this email — I'd love to chat.

Keep up the great work!

— FoodTracks Team
https://foodtracks.io`;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendEmail(page, to, subject, body) {
  // Navigate to Gmail inbox first
  await page.goto('https://mail.google.com/mail/u/0/#inbox', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });
  await sleep(3000);

  // Click "Nouveau message" compose button
  const composeBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('div[role="button"]'));
    return btns.find(b => b.textContent?.trim().includes('Nouveau message') || b.textContent?.trim().includes('Compose'));
  });
  await composeBtn.click();
  await sleep(2500);

  // Fill "To" field (French: "Destinataires")
  const toField = await page.waitForSelector(
    'input[aria-label="Destinataires"], input[aria-label="To recipients"], input[aria-label="To"]',
    { timeout: 10000 }
  );
  await toField.click();
  await sleep(300);
  await toField.type(to, { delay: 30 });
  await sleep(800);
  await page.keyboard.press('Tab');
  await sleep(500);

  // Fill Subject (French: "Objet")
  const subjectField = await page.waitForSelector(
    'input[name="subjectbox"]',
    { timeout: 5000 }
  );
  await subjectField.click();
  await sleep(200);
  await subjectField.type(subject, { delay: 15 });
  await sleep(300);

  // Fill Body (French: "Corps du message")
  const bodyField = await page.waitForSelector(
    'div[aria-label="Corps du message"][role="textbox"], div[aria-label="Message Body"][role="textbox"]',
    { timeout: 5000 }
  );
  await bodyField.click();
  await sleep(200);
  // Type body line by line to preserve formatting
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) {
      await page.keyboard.press('Enter');
    }
    if (lines[i].length > 0) {
      await bodyField.type(lines[i], { delay: 5 });
    }
    await sleep(50);
  }
  await sleep(500);

  // Click Send (Ctrl+Enter as reliable shortcut)
  await page.keyboard.down('Control');
  await page.keyboard.press('Enter');
  await page.keyboard.up('Control');
  await sleep(3000);

  console.log(`  ✓ Sent to ${to}`);
}

async function main() {
  console.log('Connecting to Chrome via CDP...');
  const browser = await puppeteer.connect({
    browserURL: CDP_URL,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // First make sure we're logged into Gmail
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

  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];
    const subject = makeSubject(c);
    const body = makeBody(c);
    console.log(`[${i + 1}/${contacts.length}] Sending to ${c.name} (${c.email})...`);

    try {
      await sendEmail(page, c.email, subject, body);
      results.push({ ...c, status: 'envoye', date: '2026-03-23' });
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      results.push({ ...c, status: 'echec', date: '2026-03-23', error: err.message });
    }

    // Wait between emails to avoid triggering rate limits
    if (i < contacts.length - 1) {
      const wait = 5000 + Math.random() * 5000;
      console.log(`  Waiting ${Math.round(wait / 1000)}s...\n`);
      await sleep(wait);
    }
  }

  // Append results to outreach log
  let logContent = fs.readFileSync(LOG_FILE, 'utf-8');

  // Build new session block
  let block = '\n\n## Session 2026-03-23\n';

  // Group by country
  const groups = { FR: [], UK: [], US: [] };
  for (const r of results) {
    if (groups[r.country]) groups[r.country].push(r);
  }

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

  // Count sent
  const sentCount = results.filter((r) => r.status === 'envoye').length;
  const failedCount = results.filter((r) => r.status === 'echec').length;
  const frCount = groups.FR.filter((r) => r.status === 'envoye').length;
  const ukCount = groups.UK.filter((r) => r.status === 'envoye').length;
  const usCount = groups.US.filter((r) => r.status === 'envoye').length;

  block += `\n---\n\n_Session 2026-03-23 : ${sentCount} emails envoyés batch 3 (${frCount} FR, ${ukCount} UK, ${usCount} US)`;
  if (failedCount > 0) block += `, ${failedCount} échecs`;
  block += '._\n';

  // Remove the trailing newline at end of file, append
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
