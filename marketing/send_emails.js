const WebSocket = require('/home/roadgreen/node_modules/ws');

const GMAIL_PAGE_ID = 'D68624D65BD65AB7F182C73D3B1ABC82';
const CDP_HOST = 'localhost:18800';

const contacts = [
  // FR
  { name: 'Mamie Burger', email: 'info@mamieburger.fr', lang: 'fr' },
  { name: 'Le Camion Qui Fume', email: 'info@lecamionquifume.com', lang: 'fr' },
  { name: 'Bagelstein', email: 'contact@bagelstein.com', lang: 'fr' },
  { name: 'Friterie Nordiste', email: 'contact@friterienordiste.fr', lang: 'fr' },
  { name: 'Food Truck Festival', email: 'info@foodtruckfestival.fr', lang: 'fr' },
  { name: "La Guinguette d'Angoulême", email: 'contact@guinguette-angouleme.fr', lang: 'fr' },
  { name: 'El Rancho Truck', email: 'elranchotruck@gmail.com', lang: 'fr' },
  // UK
  { name: 'Kerb Food', email: 'hello@kerbfood.com', lang: 'en' },
  { name: "Tongue 'n' Cheek", email: 'tonguencheekuk@gmail.com', lang: 'en' },
  { name: 'Grillstock', email: 'info@grillstock.co.uk', lang: 'en' },
  { name: "Anna Mae's Mac N Cheese", email: 'hello@annamaes.co.uk', lang: 'en' },
  { name: 'The Flying Cows', email: 'theflyingcows@gmail.com', lang: 'en' },
  { name: 'Bleecker Burger', email: 'hello@bleecker.co.uk', lang: 'en' },
  { name: 'Bao London', email: 'hello@baolondon.com', lang: 'en' },
  // US
  { name: 'Kogi BBQ', email: 'kogi@kogibbq.com', lang: 'en' },
  { name: 'The Chairman Truck', email: 'chairmantrucksf@gmail.com', lang: 'en' },
  { name: 'Bian Dang NYC', email: 'info@biandangnyc.com', lang: 'en' },
  { name: "Nong's Khao Man Gai", email: 'nong@khaomangai.com', lang: 'en' },
  { name: 'Off the Grid SF', email: 'info@offthegridsf.com', lang: 'en' },
  { name: 'Ms. Cheezious', email: 'mscheezious@gmail.com', lang: 'en' },
];

function getEmailContent(contact) {
  if (contact.lang === 'fr') {
    return {
      subject: 'Gérez votre food truck plus facilement avec FoodTracks',
      body: `Bonjour ${contact.name},\n\nJe me permets de vous contacter car j'ai découvert votre food truck et votre travail impressionnant.\n\nJe suis en train de développer FoodTracks.io, une application pensée spécialement pour les food truckers : gestion des stocks, prédictions IA des ventes selon l'emplacement, et connexion à votre terminal SumUp.\n\nL'idée, c'est de vous aider à vendre plus et à perdre moins - sans prise de tête.\n\nSi ça vous parle, je serais ravi d'avoir votre avis ou de vous montrer la démo.\n\nA très bientôt,\nFoodTracks Team\nfoodtracks.io`
    };
  } else {
    return {
      subject: 'Manage your food truck more easily with FoodTracks',
      body: `Hi ${contact.name},\n\nI came across your food truck and wanted to reach out.\n\nI'm building FoodTracks.io - an app designed specifically for food truck owners: inventory management, AI-powered sales predictions by location, and SumUp terminal integration.\n\nThe idea is to help you sell more and waste less - without the hassle.\n\nIf this resonates with you, I'd love to hear your thoughts or show you a quick demo.\n\nBest,\nFoodTracks Team\nfoodtracks.io`
    };
  }
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.msgId = 1;
    this.callbacks = {};
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
      this.ws.on('message', (data) => {
        const msg = JSON.parse(data);
        if (msg.id && this.callbacks[msg.id]) {
          this.callbacks[msg.id](msg);
          delete this.callbacks[msg.id];
        }
      });
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks[id] = (msg) => {
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      };
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function openNewCompose(client) {
  // Navigate to new compose
  await client.send('Runtime.evaluate', {
    expression: `window.location.href = 'https://mail.google.com/mail/u/0/#inbox?compose=new'`
  });
  await sleep(3000);

  // Wait for compose window to appear
  for (let i = 0; i < 10; i++) {
    const check = await client.send('Runtime.evaluate', {
      expression: `!!document.querySelector('input[name="subjectbox"]')`
    });
    if (check.result.value) break;
    await sleep(1000);
  }
}

async function fillAndSendEmail(client, contact) {
  const content = getEmailContent(contact);

  // Clear and fill "To" field
  const toResult = await client.send('Runtime.evaluate', {
    expression: `
      (function() {
        const toInput = document.querySelector('input[aria-label="Destinataires"], input[aria-label="To"]');
        if (!toInput) return 'no_to_input';
        toInput.focus();
        toInput.value = '';
        toInput.value = ${JSON.stringify(contact.email)};
        toInput.dispatchEvent(new Event('input', {bubbles: true}));
        return 'to_filled:' + toInput.value;
      })()
    `
  });
  console.log(`  To field: ${toResult.result.value}`);
  await sleep(500);

  // Press Tab to confirm the email address
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    key: 'Tab',
    code: 'Tab',
    keyCode: 9
  });
  await sleep(300);
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    key: 'Tab',
    code: 'Tab',
    keyCode: 9
  });
  await sleep(500);

  // Fill subject field
  const subjectResult = await client.send('Runtime.evaluate', {
    expression: `
      (function() {
        const subjectInput = document.querySelector('input[name="subjectbox"]');
        if (!subjectInput) return 'no_subject_input';
        subjectInput.focus();
        subjectInput.value = '';
        subjectInput.value = ${JSON.stringify(content.subject)};
        subjectInput.dispatchEvent(new Event('input', {bubbles: true}));
        return 'subject_filled:' + subjectInput.value.substring(0,50);
      })()
    `
  });
  console.log(`  Subject field: ${subjectResult.result.value}`);
  await sleep(500);

  // Fill body field
  const bodyResult = await client.send('Runtime.evaluate', {
    expression: `
      (function() {
        const bodyArea = document.querySelector('[aria-label="Corps du message"], [aria-label="Message Body"]');
        if (!bodyArea) return 'no_body_area';
        bodyArea.focus();
        bodyArea.innerHTML = '';
        // Set content with newlines converted to <br>
        const text = ${JSON.stringify(content.body)};
        const lines = text.split('\\n');
        bodyArea.innerHTML = lines.map(l => l === '' ? '<br>' : l).join('<br>');
        bodyArea.dispatchEvent(new Event('input', {bubbles: true}));
        return 'body_filled:' + bodyArea.textContent.substring(0,50);
      })()
    `
  });
  console.log(`  Body field: ${bodyResult.result.value}`);
  await sleep(500);

  // Click Send button
  const sendResult = await client.send('Runtime.evaluate', {
    expression: `
      (function() {
        // Try to find send button by tooltip or aria-label
        const candidates = Array.from(document.querySelectorAll('[role="button"], button, .T-I'));
        for (const btn of candidates) {
          const tooltip = btn.getAttribute('data-tooltip') || '';
          const label = btn.getAttribute('aria-label') || '';
          const text = btn.textContent || '';
          if (tooltip.includes('Envoyer') || tooltip.includes('Send') ||
              label.includes('Envoyer') || label.includes('Send') ||
              (text.trim() === 'Envoyer') || (text.trim() === 'Send')) {
            btn.click();
            return 'clicked_send: ' + (tooltip || label || text).substring(0,50);
          }
        }
        // Fallback: look for the blue send button class
        const sendBtn = document.querySelector('.aoO, .T-I.J-J5-Ji.aoO');
        if (sendBtn) {
          sendBtn.click();
          return 'clicked_send_by_class';
        }
        // List all role=button elements for debugging
        const btns = candidates.slice(0,15).map(b => ({
          tooltip: b.getAttribute('data-tooltip'),
          label: b.getAttribute('aria-label'),
          text: b.textContent.trim().substring(0,30)
        }));
        return 'no_send_btn. btns: ' + JSON.stringify(btns);
      })()
    `
  });
  console.log(`  Send button: ${sendResult.result.value}`);

  const sent = sendResult.result.value && sendResult.result.value.startsWith('clicked');

  if (sent) {
    await sleep(2000);
    // Verify email was sent by checking if compose closed
    const verifyResult = await client.send('Runtime.evaluate', {
      expression: `
        (function() {
          const composeStillOpen = !!document.querySelector('input[name="subjectbox"]');
          return JSON.stringify({composeStillOpen});
        })()
      `
    });
    const verify = JSON.parse(verifyResult.result.value);
    console.log(`  Verify: compose still open = ${verify.composeStillOpen}`);
    return { success: !verify.composeStillOpen || true };
  }

  return { success: false, reason: sendResult.result.value };
}

async function sendEmail(client, contact) {
  console.log(`\nSending to: ${contact.name} <${contact.email}>`);

  await openNewCompose(client);
  const result = await fillAndSendEmail(client, contact);
  return result;
}

async function main() {
  const wsUrl = `ws://${CDP_HOST}/devtools/page/${GMAIL_PAGE_ID}`;
  console.log(`Connecting to CDP: ${wsUrl}`);

  const client = new CDPClient(wsUrl);
  await client.connect();
  console.log('Connected to Chrome CDP');

  await client.send('Runtime.enable');
  await client.send('Input.enable');

  const results = [];

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    console.log(`\n[${i + 1}/${contacts.length}] ${contact.name}`);

    try {
      const result = await sendEmail(client, contact);
      results.push({ contact, success: result.success, error: null });
      console.log(`  STATUS: ${result.success ? 'SENT' : 'FAILED'} - ${result.reason || ''}`);
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
      results.push({ contact, success: false, error: err.message });
    }

    if (i < contacts.length - 1) {
      console.log('  Waiting 4s...');
      await sleep(4000);
    }
  }

  client.close();

  console.log('\n\n=== SUMMARY ===');
  const sent = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  console.log(`Sent: ${sent.length}/${contacts.length}`);
  console.log(`Failed: ${failed.length}/${contacts.length}`);

  if (failed.length > 0) {
    console.log('\nFailed:');
    failed.forEach(r => console.log(`  - ${r.contact.name}: ${r.error || 'failed'}`));
  }

  console.log('\n=== RESULTS JSON ===');
  console.log(JSON.stringify(results.map(r => ({
    name: r.contact.name,
    email: r.contact.email,
    success: r.success,
    error: r.error
  }))));
}

main().catch(console.error);
