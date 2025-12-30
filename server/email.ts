import { google } from 'googleapis';
import type { InsertShop } from '@shared/schema';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

async function getUncachableGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

function createEmailMessage(to: string, subject: string, body: string): string {
  const message = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'Content-Type: text/html; charset=utf-8',
    '',
    body
  ].join('\r\n');
  
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sendNewShopNotification(shop: InsertShop, shopId: number): Promise<boolean> {
  try {
    const gmail = await getUncachableGmailClient();
    
    const services = [];
    if (shop.repair) services.push('Réparation');
    if (shop.rental) services.push('Location');
    if (shop.sale) services.push('Vente');
    if (shop.storage) services.push('Entreposage');
    
    const subject = `Nouvelle demande d'inscription: ${shop.name}`;
    const body = `
      <h2>Nouvelle demande d'inscription au répertoire</h2>
      <p>Un nouveau commerce demande à être ajouté au répertoire Vélo Montréal.</p>
      
      <h3>Informations du commerce:</h3>
      <ul>
        <li><strong>Nom:</strong> ${shop.name}</li>
        <li><strong>Adresse:</strong> ${shop.address}</li>
        <li><strong>Code postal:</strong> ${shop.postalCode}</li>
        <li><strong>Ville:</strong> ${shop.city || 'Non spécifiée'}</li>
        <li><strong>Téléphone:</strong> ${shop.phone || 'Non spécifié'}</li>
        <li><strong>Site web:</strong> ${shop.website || 'Non spécifié'}</li>
        <li><strong>Services:</strong> ${services.join(', ') || 'Aucun spécifié'}</li>
        <li><strong>Notes:</strong> ${shop.notes || 'Aucune'}</li>
      </ul>
      
      <p>Pour approuver ou rejeter cette demande, connectez-vous à l'interface d'administration:</p>
      <p><a href="https://bikemtl.com/admin">Accéder à l'administration</a></p>
      
      <p>ID du commerce: ${shopId}</p>
    `;
    
    const rawMessage = createEmailMessage('me', subject, body);
    
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawMessage
      }
    });
    
    console.log(`Email notification sent for shop: ${shop.name}`);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
}
