#!/usr/bin/env node
/**
 * gen-voiceover-lines.mjs
 * Synthesizes Scene 0 Miranda voiceover line-by-line.
 * Each line → public/audio/scene0/{id}.mp3
 *
 * Usage:
 *   # Azure AD (after az login):
 *   AZURE_SPEECH_REGION=eastus2 \
 *   AZURE_SPEECH_ENDPOINT=https://speechsmegtm-gtm.cognitiveservices.azure.com \
 *   node scripts/gen-voiceover-lines.mjs --aad
 *
 *   # Speech key:
 *   AZURE_SPEECH_KEY=<key> AZURE_SPEECH_REGION=<region> \
 *   node scripts/gen-voiceover-lines.mjs
 *
 *   # Regenerate only missing files:
 *   node scripts/gen-voiceover-lines.mjs --aad
 *
 *   # Force regenerate all:
 *   node scripts/gen-voiceover-lines.mjs --aad --force
 *
 *   # Use a different voice:
 *   MIRANDA_VOICE="en-US-Serena:DragonHDOmniLatestNeural" \
 *   node scripts/gen-voiceover-lines.mjs --aad
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
const ENDPOINT = process.env.AZURE_SPEECH_ENDPOINT || null;
const USE_AAD  = process.argv.includes('--aad');
const FORCE    = process.argv.includes('--force');
const VOICE    = process.env.MIRANDA_VOICE || 'en-US-Ava:DragonHDOmniLatestNeural';
const PARAMS   = 'temperature=0.78;top_p=0.8;top_k=30;cfg_scale=1.65';
const OUT_DIR  = join(ROOT, 'public', 'audio', 'scene0');

// ── Style fallback map ────────────────────────────────────────────────────────
const STYLE_FALLBACK = {
  urgent:       'determined',
  commanding:   'confident',
  concerned:    'serious',
  disappointed: 'serious',
  suspicious:   'serious',
  defiant:      'serious',
  frustrated:   'serious',
  reflective:   'calm',
  proud:        'confident',
};

// ── Voiceover lines ───────────────────────────────────────────────────────────
const LINES = [
  { id: 'welcome',             text: 'Welcome to Veloris Maison.',                                                                style: 'confident',  styleDegree: 1.25 },
  { id: 'out-of-time',         text: 'We are out of time.',                                                                       style: 'serious',    styleDegree: 1.65 },
  { id: 'systems-fragmented',  text: 'The systems are fragmented.',                                                               style: 'serious',    styleDegree: 1.4  },
  { id: 'data-scattered',      text: 'The data is scattered.',                                                                    style: 'serious',    styleDegree: 1.4  },
  { id: 'ai-everywhere',       text: 'The AI is everywhere.',                                                                     style: 'serious',    styleDegree: 1.45 },
  { id: 'impact-nowhere',      text: 'But impact is nowhere.',                                                                    style: 'confident',  styleDegree: 1.65 },
  { id: 'hm',                  text: 'Hm.',                                                                                       style: 'serious',    styleDegree: 1.45 },
  { id: 'that-ends-now',       text: 'That ends now.',                                                                            style: 'confident',  styleDegree: 1.8  },
  { id: 'new-cto',             text: 'You are my new CTO.',                                                                       style: 'confident',  styleDegree: 1.7  },
  { id: 'modernize-apps',      text: 'Modernize the apps.',                                                                       style: 'determined', styleDegree: 1.5  },
  { id: 'connect-knowledge',   text: 'Connect the knowledge.',                                                                    style: 'determined', styleDegree: 1.5  },
  { id: 'govern-data',         text: 'Govern the data.',                                                                          style: 'determined', styleDegree: 1.5  },
  { id: 'deploy-agents',       text: 'Deploy the agents.',                                                                        style: 'determined', styleDegree: 1.5  },
  { id: 'secure-empire',       text: 'Secure the empire.',                                                                        style: 'determined', styleDegree: 1.65 },
  { id: 'frontier-firm',       text: 'Before the next season begins, this maison becomes an AI-driven Frontier Firm.',            style: 'determined', styleDegree: 1.65 },
  { id: 'five-trials',         text: 'Five trials.',                                                                              style: 'serious',    styleDegree: 1.8  },
  { id: 'one-season',          text: 'One season.',                                                                               style: 'serious',    styleDegree: 1.8  },
  { id: 'no-excuses',          text: 'No excuses.',                                                                               style: 'serious',    styleDegree: 1.95 },
  { id: 'move',                text: 'Move.',                                                                                     style: 'confident',  styleDegree: 2.0  },
];

// ── Build SSML for one line ───────────────────────────────────────────────────
function buildSSML(text, style, styleDegree) {
  const resolvedStyle = STYLE_FALLBACK[style] || style;
  return `<speak version="1.0"
       xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="http://www.w3.org/2001/mstts"
       xml:lang="en-US">
  <voice name="${VOICE}" parameters="${PARAMS}">
    <mstts:express-as style="${resolvedStyle}" styledegree="${styleDegree}">
      <prosody rate="fast">
        ${text}
      </prosody>
    </mstts:express-as>
  </voice>
</speak>`;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function getAuthHeaders() {
  if (USE_AAD) {
    const token = execSync(
      'az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv',
      { stdio: ['pipe', 'pipe', 'pipe'] }
    ).toString().trim();
    return { Authorization: `Bearer ${token}` };
  }
  const key = process.env.AZURE_SPEECH_KEY;
  if (!key) {
    console.error('❌  Set AZURE_SPEECH_KEY or use --aad');
    process.exit(1);
  }
  return { 'Ocp-Apim-Subscription-Key': key };
}

// ── Synthesize one line ───────────────────────────────────────────────────────
function synthesizeLine(ssml, outPath, authHeaders) {
  return new Promise((resolve, reject) => {
    const useCustom = USE_AAD && ENDPOINT;
    const hostname  = useCustom ? new URL(ENDPOINT).hostname : `${REGION}.tts.speech.microsoft.com`;
    const path      = useCustom ? '/tts/cognitiveservices/v1' : '/cognitiveservices/v1';

    const headers = {
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
      'User-Agent': 'veloris-game/1.0',
      ...authHeaders,
    };
    if (useCustom) headers['Ocp-Apim-Subscription-Region'] = REGION;

    const req = request({ hostname, path, method: 'POST', headers }, (res) => {
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`)));
        return;
      }
      const out = createWriteStream(outPath);
      res.pipe(out);
      out.on('finish', resolve);
      out.on('error', reject);
    });
    req.on('error', reject);
    req.write(ssml);
    req.end();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`🎙️   Miranda Scene 0 — line-by-line synthesis`);
  console.log(`     Voice    : ${VOICE}`);
  console.log(`     Region   : ${REGION}`);
  if (ENDPOINT) console.log(`     Endpoint : ${ENDPOINT}`);
  console.log(`     Output   : ${OUT_DIR}/`);
  console.log('');

  mkdirSync(OUT_DIR, { recursive: true });

  let authHeaders;
  if (USE_AAD) {
    process.stdout.write('🔐  Getting Azure AD token... ');
    authHeaders = getAuthHeaders();
    console.log('✅');
  } else {
    authHeaders = getAuthHeaders();
  }

  let generated = 0;
  let skipped   = 0;

  for (const line of LINES) {
    const outPath = join(OUT_DIR, `${line.id}.mp3`);
    if (!FORCE && existsSync(outPath)) {
      console.log(`  ⏭  skip   ${line.id}.mp3 (exists)`);
      skipped++;
      continue;
    }

    const ssml = buildSSML(line.text, line.style, line.styleDegree);
    process.stdout.write(`  ⏳  synth  ${line.id}.mp3 ...`);
    try {
      await synthesizeLine(ssml, outPath, authHeaders);
      console.log(' ✅');
      generated++;
    } catch (err) {
      console.log(` ❌  ${err.message}`);
    }
  }

  console.log('');
  console.log(`✅  Done — ${generated} generated, ${skipped} skipped`);
  console.log(`📂  Files: ${OUT_DIR}/`);
  console.log('');
  console.log('🔊  Quick listen:');
  console.log(`    open "${OUT_DIR}"`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
