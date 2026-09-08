import { Client } from 'basic-ftp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FTP_HOST = 'neo.herosite.pro';
const FTP_USER = 'kkjbnlfz';
const FTP_PASS = 'Jox$z(CBaxB^$5AN';
const REMOTE_DIR = '/public_html/new_prevahnews';
const LOCAL_DIST = path.join(__dirname, 'dist');

async function deploy() {
  const client = new Client();
  client.ftp.verbose = true;

  try {
    console.log('🔗 Connecting to FTP server...');
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
      secure: false,
    });
    console.log('✅ Connected successfully!');

    console.log(`📂 Navigating to ${REMOTE_DIR}...`);
    await client.ensureDir(REMOTE_DIR);

    // Delete old assets first
    try {
      console.log('🗑️ Removing old assets directory...');
      await client.removeDir(`${REMOTE_DIR}/assets`);
    } catch (e) {
      console.log('ℹ️ No old assets directory found or could not delete.');
    }

    // Upload dist
    console.log('📤 Uploading dist/ files...');
    await client.uploadFromDir(LOCAL_DIST, REMOTE_DIR);
    console.log('✅ All files uploaded successfully!');

  } catch (err) {
    console.error('❌ Deployment failed:', err.message);
  } finally {
    client.close();
  }
}

deploy();
