#!/usr/bin/env node
import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const ORIGIN = 'https://burn15.com';
const MAX_INPUT_BYTES = 8192;

function fail(message) { throw new Error(message); }

function decode(value, bytes) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) fail('Invalid encrypted note.');
  const decoded = Buffer.from(value, 'base64url');
  if (decoded.toString('base64url') !== value || (bytes !== undefined && decoded.length !== bytes)) fail('Invalid encrypted note.');
  return decoded;
}

export function parseLink(value) {
  let url;
  try { url = new URL(value.trim()); } catch { fail('Enter a complete https://burn15.com/burn# link.'); }
  if (url.origin !== ORIGIN || url.pathname !== '/burn' || url.search || url.username || url.password) fail('Enter a complete https://burn15.com/burn# link.');
  const key = decode(url.hash.slice(1), 32);
  const id = createHash('sha256').update(key).digest('hex');
  return { key, id };
}

export function encrypt(content) {
  if (typeof content !== 'string' || !content.trim() || content.length > 1000) fail('A note must contain 1–1,000 UTF-16 code units.');
  const key = randomBytes(32);
  const id = createHash('sha256').update(key).digest('hex');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(`burn15:v1:${id}`));
  const ciphertext = Buffer.concat([cipher.update(content, 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return {
    url: `${ORIGIN}/burn#${key.toString('base64url')}`,
    payload: { version: 1, id, iv: iv.toString('base64url'), ciphertext: ciphertext.toString('base64url') },
  };
}

function times(data) {
  if (!data || !Number.isSafeInteger(data.createdAt) || !Number.isSafeInteger(data.expiresAt)
      || !Number.isSafeInteger(data.serverNow) || data.createdAt <= 0
      || data.expiresAt - data.createdAt !== 900000 || data.serverNow < data.createdAt
      || data.serverNow >= data.expiresAt) fail('Burn15 returned invalid or expired note metadata.');
  return { createdAt: new Date(data.createdAt).toISOString(), expiresAt: new Date(data.expiresAt).toISOString() };
}

async function request(path, body, expectedStatus, fetchImpl) {
  let result;
  try {
    result = await fetchImpl(`${ORIGIN}${path}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body), redirect: 'error', signal: AbortSignal.timeout(15000),
    });
  } catch { fail('Burn15 could not confirm the operation. Do not assume it succeeded or retry automatically.'); }
  if (result.status === 404) fail('This note is unavailable or expired.');
  if (result.status !== expectedStatus) fail('Burn15 could not confirm the operation. Do not assume it succeeded.');
  if (expectedStatus === 204) return;
  // Bound the response before parsing; never echo upstream errors or response bodies.
  if (!result.body) fail('Burn15 returned an invalid response.');
  const chunks = [];
  let size = 0;
  for await (const chunk of result.body) {
    size += chunk.length;
    if (size > MAX_INPUT_BYTES) fail('Burn15 returned an invalid response.');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { fail('Burn15 returned an invalid response.'); }
}

export async function run(action, input, fetchImpl = fetch) {
  if (action === 'create') {
    const { url, payload } = encrypt(input);
    const data = await request('/api/messages', payload, 201, fetchImpl);
    return { url, ...times(data), expiresAfterMinutes: 15 };
  }
  if (!['read', 'burn'].includes(action)) fail('Usage: node burn15.mjs create|read|burn (input on stdin).');
  const { key, id } = parseLink(input);
  if (action === 'burn') {
    await request('/api/messages/burn', { id }, 204, fetchImpl);
    return { burned: true, message: 'Burn15 confirmed live-database deletion. Existing copies and provider backups are not revoked.' };
  }
  const data = await request('/api/messages/view', { id }, 200, fetchImpl);
  const metadata = times(data);
  if (data.id !== id || data.version !== 1) fail('Invalid encrypted note.');
  const iv = decode(data.iv, 12);
  if (typeof data.ciphertext !== 'string' || data.ciphertext.length > 5355) fail('Invalid encrypted note.');
  const encrypted = decode(data.ciphertext);
  if (encrypted.length < 17 || encrypted.length > 4016) fail('Invalid encrypted note.');
  let content;
  try {
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAAD(Buffer.from(`burn15:v1:${id}`));
    decipher.setAuthTag(encrypted.subarray(-16));
    const plain = Buffer.concat([decipher.update(encrypted.subarray(0, -16)), decipher.final()]);
    content = new TextDecoder('utf-8', { fatal: true }).decode(plain);
  } catch { fail('The note could not be authenticated or decrypted.'); }
  if (!content.trim() || content.length > 1000) fail('Invalid encrypted note.');
  return { content, ...metadata };
}

async function main() {
  try {
    if (process.argv.length !== 3 || !['create', 'read', 'burn'].includes(process.argv[2])) fail('Usage: node burn15.mjs create|read|burn (input on stdin).');
    const chunks = [];
    let size = 0;
    for await (const chunk of process.stdin) {
      size += chunk.length;
      if (size > MAX_INPUT_BYTES) fail('Input is too large.');
      chunks.push(chunk);
    }
    let input;
    try { input = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)); }
    catch { fail('Input must be UTF-8.'); }
    process.stdout.write(JSON.stringify(await run(process.argv[2], input)) + '\n');
  } catch (error) {
    process.stderr.write(error.message + '\n');
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();

