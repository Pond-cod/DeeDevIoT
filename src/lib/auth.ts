// Web Crypto API based session signing (compatible with Node.js & Edge Runtime / Next.js Middleware)

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'deedeviot-session-secure-key-default';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyData = enc.encode(SESSION_SECRET);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Creates a cryptographically signed session token.
 * Format: admin.<timestamp>.<random>.<signature>
 */
export async function createSessionToken(username: string = 'admin'): Promise<string> {
  const timestamp = Date.now().toString();
  const random = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
  const dataToSign = `${username}.${timestamp}.${random}`;
  
  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(dataToSign));
  const signatureHex = bufferToHex(signatureBuffer);

  return `${dataToSign}.${signatureHex}`;
}

/**
 * Verifies a signed session token.
 * Returns true only if the signature is valid and token is not expired.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 4) return false;

  const [username, timestampStr, random, signatureHex] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return false;

  // Check expiration (24h)
  const now = Date.now();
  if (now - timestamp > SESSION_MAX_AGE_MS || timestamp > now + 60000) {
    return false; // Expired or future timestamp
  }

  try {
    const key = await getCryptoKey();
    const dataToVerify = `${username}.${timestampStr}.${random}`;
    const enc = new TextEncoder();
    const signatureBuffer = hexToBuffer(signatureHex);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBuffer,
      enc.encode(dataToVerify)
    );

    return isValid;
  } catch (err) {
    console.error('Session verification error:', err);
    return false;
  }
}
