import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/home/roadgreen/.nvm/versions/node/v22.22.0/lib/node_modules/puppeteer-core');

const CHROME_URL = 'http://localhost:18800';

const trucks = [
  // FRANCE
  {
    name: "JERO Globe-Croqueur",
    email: "evenements@jero-globecroqueur.fr",
    city: "Lyon",
    country: "FR",
    specialty: "food truck traiteur evenementiel"
  },
  {
    name: "Coincidence Food Truck",
    email: "contact@coincidencefoodtruck.fr",
    city: "Alsace / Strasbourg",
    country: "FR",
    specialty: "evenements et mariages, cuisine modulable"
  },
  {
    name: "Ker Zesto",
    email: "contact@kerzesto.com",
    city: "Marseille",
    country: "FR",
    specialty: "crepes et galettes artisanales"
  },
  {
    name: "Les Enflammes",
    email: "contact@les-enflammes.fr",
    city: "Strasbourg",
    country: "FR",
    specialty: "tartes flambees au feu de bois"
  },
  {
    name: "Rest Truck",
    email: "contact.resthome21@gmail.com",
    city: "Seine-et-Marne / Ile-de-France",
    country: "FR",
    specialty: "burgers americains, frites belges, pizzas au feu de bois"
  },
  {
    name: "Burger Avenue Food Truck",
    email: "studio.diabolo@gmail.com",
    city: "Paris / Ile-de-France",
    country: "FR",
    specialty: "burgers gourmets evenementiel"
  },
  {
    name: "L'Epicurieux",
    email: "contact@lepicurieux.net",
    city: "Toulouse",
    country: "FR",
    specialty: "bagels et street food eco-responsable"
  },
  // UK
  {
    name: "Planet G",
    email: "enjoy@planetgfood.com",
    city: "Edinburgh",
    country: "UK",
    specialty: "sustainable plant-based street food"
  },
  {
    name: "Street Food Union",
    email: "info@streetfoodunion.co.uk",
    city: "London / UK-wide",
    country: "UK",
    specialty: "collective of independent street food traders"
  },
  {
    name: "Bristol Eats",
    email: "weddings@bristoleats.co.uk",
    city: "Bristol",
    country: "UK",
    specialty: "street food events and wedding catering"
  },
  {
    name: "Feed Food Truck",
    email: "Infofeedcatering@gmail.com",
    city: "London",
    country: "UK",
    specialty: "private and corporate event catering"
  },
  {
    name: "Eat The Street",
    email: "info@eatthestreet.co.uk",
    city: "Brighton",
    country: "UK",
    specialty: "boutique street food catering, weddings and events"
  },
  {
    name: "Gully UK",
    email: "gullywrapz@gmail.com",
    city: "London / UK",
    country: "UK",
    specialty: "Indian street food truck, weddings and events"
  },
  {
    name: "Chew That",
    email: "hello@theweddingarrangers.com",
    city: "London",
    country: "UK",
    specialty: "street food event service, food trucks and market traders"
  },
  // USA
  {
    name: "Mile High Tikka Express",
    email: "milehightikkaexpress@gmail.com",
    city: "Denver, CO",
    country: "US",
    specialty: "Indian fusion food truck"
  },
  {
    name: "Tula's Tapas",
    email: "chefgabriel@tulastapas.com",
    city: "Denver, CO",
    country: "US",
    specialty: "global-inspired tapas food truck"
  },
  {
    name: "That's My Dog",
    email: "thatsmydogcorp@gmail.com",
    city: "Miami, FL",
    country: "US",
    specialty: "gourmet food truck events Miami"
  },
  {
    name: "The Fat Shallot",
    email: "info@thefatshallot.com",
    city: "Chicago, IL",
    country: "US",
    specialty: "gourmet sandwich food truck"
  },
  {
    name: "El Zorro Tacos",
    email: "elzorrotacosfoodtruck@gmail.com",
    city: "Chicago, IL",
    country: "US",
    specialty: "authentic taco food truck"
  },
  {
    name: "The Gilty Pig",
    email: "thegiltypig@gmail.com",
    city: "Chicago, IL",
    country: "US",
    specialty: "artisan food truck catering"
  }
];

function generateEmailFR(truck) {
  const subject = `${truck.name} x FoodTracks.io — Optimisez votre activite food truck`;
  const body = `Bonjour l'equipe ${truck.name},

Je me permets de vous ecrire car on connait bien les defis du quotidien en food truck : savoir combien preparer, gerer les stocks a la derniere minute, eviter le gaspillage en fin de service... On sait que ce n'est pas toujours evident quand on est sur le terrain a ${truck.city}.

C'est exactement pour ca qu'on a cree FoodTracks.io. C'est une appli pensee par et pour les food truckers, et voici ce qu'elle permet de faire concretement :

Des predictions IA de vos ventes, pour savoir combien preparer selon le jour, la meteo et l'emplacement. Une gestion de stock par simple scan, fini les tableurs et les notes papier. Et des alertes intelligentes pour reduire le gaspillage alimentaire.

C'est gratuit pour demarrer, sans engagement. Vous testez et vous voyez directement l'impact sur votre activite. Si ca vous plait, on a aussi un abonnement Pro avec des fonctionnalites avancees (predictions poussees, analytics detailles, integration SumUp).

Jetez un oeil sur foodtracks.io, ca prend 2 minutes a configurer.

On serait vraiment ravis d'avoir ${truck.name} parmi nos utilisateurs !

A tres vite,
L'equipe FoodTracks
https://foodtracks.io`;

  return { subject, body };
}

function generateEmailEN(truck) {
  const subject = `${truck.name} x FoodTracks.io — Level up your food truck operations`;
  const body = `Hey ${truck.name} team,

Reaching out because we know the food truck grind all too well. Figuring out how much to prep, managing stock on the fly, trying not to waste food at the end of service... it's a lot when you're already busy serving great ${truck.specialty} in ${truck.city}.

That's why we built FoodTracks.io. It's an app made specifically for food truck operators, and here's what it does:

AI powered sales predictions so you know exactly how much to prep based on the day, weather and location. Stock management by simple scan, no more spreadsheets or guesswork. And smart alerts to help cut food waste.

It's free to start, no strings attached. Try it out and see the difference right away. If you want to go further, we have a Pro plan with advanced features like deep AI predictions, detailed analytics and SumUp integration.

Check it out at foodtracks.io, takes about 2 minutes to set up.

We'd love to have ${truck.name} on board!

Cheers,
The FoodTracks Team
https://foodtracks.io`;

  return { subject, body };
}

async function sendEmail(page, truck) {
  const isFR = truck.country === 'FR';
  const { subject, body } = isFR ? generateEmailFR(truck) : generateEmailEN(truck);

  console.log(`\nSending email to ${truck.name} (${truck.email})...`);

  const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(truck.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  await page.goto(composeUrl, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 4000));

  try {
    const sent = await page.evaluate(() => {
      const buttons = document.querySelectorAll('[role="button"]');
      for (const btn of buttons) {
        const text = btn.textContent.trim().toLowerCase();
        if (text === 'send' || text === 'envoyer') {
          btn.click();
          return 'clicked-text';
        }
      }
      const sendBtn = document.querySelector('[aria-label*="Send"]') || document.querySelector('[aria-label*="Envoyer"]');
      if (sendBtn) {
        sendBtn.click();
        return 'clicked-aria';
      }
      return 'need-keyboard';
    });

    if (sent === 'need-keyboard') {
      await page.keyboard.down('Control');
      await page.keyboard.press('Enter');
      await page.keyboard.up('Control');
      console.log(`  Sent via keyboard shortcut`);
    } else {
      console.log(`  Sent (${sent})`);
    }

    await new Promise(r => setTimeout(r, 3000));
    return true;

  } catch (err) {
    console.log(`  Error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('Connecting to Chrome...');

  const response = await fetch(`${CHROME_URL}/json/version`);
  const data = await response.json();
  const wsUrl = data.webSocketDebuggerUrl;

  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: null
  });

  const pages = await browser.pages();
  let page = pages[0];

  if (!page) {
    page = await browser.newPage();
  }

  // Get a fresh page to avoid detached frame issues
  page = await browser.newPage();

  console.log('Checking Gmail access...');
  await page.goto('https://mail.google.com/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 3000));

  const currentUrl = page.url();
  console.log(`Current URL: ${currentUrl}`);

  if (currentUrl.includes('accounts.google.com') || currentUrl.includes('signin')) {
    console.log('Not logged into Gmail! Please log in first.');
    await browser.disconnect();
    return;
  }

  console.log('Gmail accessible. Starting email campaign...\n');

  const results = [];

  for (const truck of trucks) {
    try {
      const success = await sendEmail(page, truck);
      results.push({ name: truck.name, email: truck.email, country: truck.country, city: truck.city, success });
      await new Promise(r => setTimeout(r, 3000));
    } catch (err) {
      console.log(`  Failed for ${truck.name}: ${err.message}`);
      results.push({ name: truck.name, email: truck.email, country: truck.country, city: truck.city, success: false });
    }
  }

  console.log('\n\n=== CAMPAIGN SUMMARY ===');
  console.log(`Total: ${results.length}`);
  console.log(`Sent: ${results.filter(r => r.success).length}`);
  console.log(`Failed: ${results.filter(r => !r.success).length}`);
  console.log('\nDetails:');
  for (const r of results) {
    console.log(`  ${r.success ? 'OK' : 'FAIL'} ${r.name} (${r.email}) [${r.country}]`);
  }

  await browser.disconnect();
}

main().catch(console.error);
