import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('/home/roadgreen/.nvm/versions/node/v22.22.0/lib/node_modules/puppeteer-core');

const CHROME_URL = 'http://localhost:18800';

const trucks = [
  // FRANCE
  {
    name: "Food Truck Marianna",
    email: "foodtruck.marianna@gmail.com",
    city: "Mimizan",
    country: "FR",
    specialty: "cuisine mobile"
  },
  {
    name: "Che Empanadas",
    email: "foodtruckche@gmail.com",
    city: "Paris",
    country: "FR",
    specialty: "empanadas argentines"
  },
  {
    name: "Sukhumvit",
    email: "contact.sukhumvit@gmail.com",
    city: "Paris",
    country: "FR",
    specialty: "street food thai"
  },
  {
    name: "Puccia Foodtruck",
    email: "puccia.foodtruck@gmail.com",
    city: "Paris",
    country: "FR",
    specialty: "cuisine italienne, puccia"
  },
  {
    name: "Nomad Food",
    email: "nomadfood44@gmail.com",
    city: "Nantes",
    country: "FR",
    specialty: "traiteur evenementiel"
  },
  {
    name: "Il etait une fouee",
    email: "iletaitunefouee@gmail.com",
    city: "Nantes / Vendee",
    country: "FR",
    specialty: "fouees au four a bois"
  },
  {
    name: "La Kitchenette",
    email: "contact@lakitchenette.net",
    city: "Nice",
    country: "FR",
    specialty: "cuisine italienne"
  },
  {
    name: "La Camionnette",
    email: "contact@lacamionnette.com",
    city: "Lyon",
    country: "FR",
    specialty: "brochettes et comptoir mobile"
  },
  {
    name: "Appelez-moi Jacques",
    email: "pauline@foodtruck-crepes.fr",
    city: "Grenoble",
    country: "FR",
    specialty: "crepes artisanales"
  },
  {
    name: "Food Trucks Villages Gourmands",
    email: "foodtrucksvg@gmail.com",
    city: "Aix-en-Provence",
    country: "FR",
    specialty: "collectif de food trucks"
  },
  {
    name: "Breizh Food",
    email: "contactbzhfood@yahoo.com",
    city: "Bordeaux / Gironde",
    country: "FR",
    specialty: "specialites bretonnes"
  },
  {
    name: "Foodies Truck",
    email: "foodiestruck@gmail.com",
    city: "Dijon",
    country: "FR",
    specialty: "restaurant mobile"
  },
  {
    name: "Chez Mes Soeurs",
    email: "traiteur@chezmessoeurs.fr",
    city: "Dijon",
    country: "FR",
    specialty: "traiteur et food truck"
  },
  {
    name: "Comme Autrefois",
    email: "contact@commeautrefois.com",
    city: "Rouen",
    country: "FR",
    specialty: "burgers traditionnels"
  },
  // UK
  {
    name: "Lazeez Street Food",
    email: "lazeezstreetfood@gmail.com",
    city: "Edinburgh",
    country: "UK",
    specialty: "Middle Eastern street food"
  },
  {
    name: "Bears Street Food",
    email: "leetaylorwintercottage@hotmail.co.uk",
    city: "Leeds / Barnsley",
    country: "UK",
    specialty: "event street food catering"
  },
  // US
  {
    name: "Food Truck Avenue",
    email: "info@foodtruckavenue.com",
    city: "Denver, CO",
    country: "US",
    specialty: "chef-driven food truck catering"
  },
  {
    name: "Fresh Food Generation",
    email: "catering@freshfoodgeneration.com",
    city: "Boston, MA",
    country: "US",
    specialty: "healthy food truck catering"
  },
  {
    name: "Wicked Tasty Trucks",
    email: "Info@wickedtastytrucks.com",
    city: "New England",
    country: "US",
    specialty: "New England comfort food"
  },
  {
    name: "MIAFTA",
    email: "info@miafta.org",
    city: "Miami, FL",
    country: "US",
    specialty: "Miami food truck association"
  }
];

function generateEmailFR(truck) {
  const subject = `${truck.name} x FoodTracks.io — Optimisez votre activite food truck`;
  const body = `Bonjour l'equipe ${truck.name},

Je me permets de vous ecrire car on connait bien les galeres du quotidien en food truck : savoir combien preparer, gerer les stocks a la derniere minute, eviter le gaspillage en fin de service... On sait que c'est pas toujours evident quand on est sur le terrain a ${truck.city}.

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
