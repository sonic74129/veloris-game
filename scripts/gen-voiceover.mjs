#!/usr/bin/env node
/**
 * gen-voiceover.mjs
 * Generates Miranda's Scene 0 voiceover MP3 via Azure Speech REST API.
 *
 * Setup — choose one:
 *
 *   Option A (Speech Key):
 *     AZURE_SPEECH_KEY=<key> AZURE_SPEECH_REGION=<region> node scripts/gen-voiceover.mjs
 *
 *   Option B (Azure AD — after `az login`):
 *     AZURE_SPEECH_REGION=<region> node scripts/gen-voiceover.mjs --aad
 *     Requires: "Cognitive Services Speech User" role on your Speech resource
 *
 * Find your region & key:
 *   az cognitiveservices account list --output table
 *   az cognitiveservices account keys list --name <name> --resource-group <rg>
 *
 * Output: public/audio/miranda-scene0.mp3
 */

import { execSync } from 'child_process';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { request } from 'https';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Config ────────────────────────────────────────────────────────────────────
const REGION   = process.env.AZURE_SPEECH_REGION   || 'eastus';
// Custom-domain endpoint (required when disableLocalAuth=true)
// e.g. "https://myresource.cognitiveservices.azure.com"
const ENDPOINT = process.env.AZURE_SPEECH_ENDPOINT || null;
const OUTPUT_DIR = join(ROOT, 'public', 'audio');
const OUTPUT = join(OUTPUT_DIR, 'miranda-scene0.mp3');
const USE_AAD = process.argv.includes('--aad');

// ── SSML ──────────────────────────────────────────────────────────────────────
const SSML = `<speak version="1.0"
       xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts"
       xml:lang="en-US">

  <voice name="en-US-Ava:DragonHDOmniLatestNeural"
         parameters="temperature=0.76;top_p=0.78;top_k=30;cfg_scale=1.15">

    <mstts:express-as style="calm" styledegree="1.1">
      Welcome to Veloris Maison.
    </mstts:express-as>

    <break time="750ms"/>

    <mstts:express-as style="serious" styledegree="1.25">
      Hmm.
      <break time="350ms"/>
      I brought you here because this house is running out of time.
    </mstts:express-as>

    <break time="650ms"/>

    <mstts:express-as style="serious" styledegree="1.15">
      Our systems are fragmented.
      <break time="400ms"/>
      Our data is scattered.
      <break time="400ms"/>
      Our AI is everywhere —
      <break time="350ms"/>
      but transformation is nowhere.
    </mstts:express-as>

    <break time="800ms"/>

    <mstts:express-as style="serious" styledegree="1.3">
      Well.
      <break time="300ms"/>
      That changes now.
    </mstts:express-as>

    <break time="600ms"/>

    <mstts:express-as style="confident" styledegree="1.3">
      You are my new CTO.
    </mstts:express-as>

    <break time="650ms"/>

    <mstts:express-as style="determined" styledegree="1.25">
      Before the next season begins,
      <break time="300ms"/>
      you will rebuild this maison into an AI-driven Frontier Firm.
    </mstts:express-as>

    <break time="950ms"/>

    <mstts:express-as style="serious" styledegree="1.55">
      Five trials.
      <break time="450ms"/>
      One season.
      <break time="650ms"/>
      No excuses.
    </mstts:express-as>

  </voice>
</speak>`;

// ── Auth ──────────────────────────────────────────────────────────────────────
function getAuthHeaders() {
  if (USE_AAD) {
    console.log('🔐  Getting Azure AD token via az CLI...');
    try {
      const token = execSync(
        'az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv',
        { stdio: ['pipe', 'pipe', 'pipe'] }
      ).toString().trim();
      console.log('✅  AAD token obtained');
      return { Authorization: `Bearer ${token}` };
    } catch {
      console.error('❌  Failed to get AAD token. Run `az login` first, and ensure your account');
      console.error('    has "Cognitive Services Speech User" role on the Speech resource.');
      process.exit(1);
    }
  }

  const key = process.env.AZURE_SPEECH_KEY;
  if (!key) {
    console.error('❌  AZURE_SPEECH_KEY is not set.');
    console.error('');
    console.error('    Option A — Speech Key:');
    console.error('      AZURE_SPEECH_KEY=<key> AZURE_SPEECH_REGION=<region> node scripts/gen-voiceover.mjs');
    console.error('');
    console.error('    Option B — Azure AD (after az login):');
    console.error('      AZURE_SPEECH_REGION=<region> node scripts/gen-voiceover.mjs --aad');
    console.error('');
    console.error('    Find your key:');
    console.error('      az cognitiveservices account keys list --name <name> --resource-group <rg>');
    process.exit(1);
  }
  return { 'Ocp-Apim-Subscription-Key': key };
}

// ── Synthesize ────────────────────────────────────────────────────────────────
function synthesize(authHeaders) {
  return new Promise((resolve, reject) => {
    // Custom-domain endpoint required when disableLocalAuth=true
    const useCustomEndpoint = USE_AAD && ENDPOINT;
    const hostname = useCustomEndpoint
      ? new URL(ENDPOINT).hostname
      : `${REGION}.tts.speech.microsoft.com`;
    const path = useCustomEndpoint
      ? '/tts/cognitiveservices/v1'
      : '/cognitiveservices/v1';

    const headers = {
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
      'User-Agent': 'veloris-game/1.0',
      ...authHeaders,
    };

    // Region header may be required by some custom-domain setups
    if (useCustomEndpoint) {
      headers['Ocp-Apim-Subscription-Region'] = REGION;
    }

    const options = {
      hostname,
      path,
      method: 'POST',
      headers,
    };

    const req = request(options, (res) => {
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${body}`)));
        return;
      }

      mkdirSync(OUTPUT_DIR, { recursive: true });
      const out = createWriteStream(OUTPUT);
      res.pipe(out);
      out.on('finish', resolve);
      out.on('error', reject);
    });

    req.on('error', reject);
    req.write(SSML);
    req.end();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (existsSync(OUTPUT) && !process.argv.includes('--force')) {
    console.log(`ℹ️   ${OUTPUT} already exists. Use --force to regenerate.`);
    process.exit(0);
  }

  console.log('🎙️   Miranda Scene 0 voiceover — Azure Speech TTS');
  console.log(`     Region   : ${REGION}`);
  if (ENDPOINT) console.log(`     Endpoint : ${ENDPOINT}`);
  console.log(`     Voice    : en-US-Ava:DragonHDOmniLatestNeural`);
  console.log(`     Output   : ${OUTPUT}`);
  console.log('');

  const authHeaders = getAuthHeaders();

  console.log('⏳  Synthesizing...');
  await synthesize(authHeaders);

  console.log(`✅  Saved: ${OUTPUT}`);
  console.log('');
  console.log('📋  Next steps:');
  console.log('    1. git add public/audio/miranda-scene0.mp3');
  console.log('    2. npm run build && git push');
  console.log('');
  console.log('🎚️   Subtitle timings are in src/data/voiceovers/scene0.ts');
  console.log('    Listen to the audio and adjust start/end values if needed.');
}

main().catch((err) => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
