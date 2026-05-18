#!/usr/bin/env node
/**
 * gen-voiceover.mjs
 * Line-by-line Azure Speech TTS synthesis for all voiceover scripts.
 *
 * Generates one MP3 per line → public/audio/{sceneId}/{voiceKey}/{lineId}.mp3
 *
 * Setup — choose one:
 *
 *   Option A (Speech Key):
 *     AZURE_SPEECH_KEY=<key>  AZURE_SPEECH_REGION=<region>  node scripts/gen-voiceover.mjs
 *
 *   Option B (Azure AD — after `az login`, requires Cognitive Services Speech User role):
 *     AZURE_SPEECH_REGION=<region>  AZURE_SPEECH_ENDPOINT=<url>  node scripts/gen-voiceover.mjs --aad
 *
 * Voice variants:
 *   MIRANDA_VOICE=ava|serena|nova|emma node scripts/gen-voiceover.mjs --aad
 *
 * Force re-generate existing files:
 *   node scripts/gen-voiceover.mjs --aad --force
 */

import { execSync }                                from 'child_process';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { request }                                 from 'https';
import { join, dirname }                           from 'path';
import { fileURLToPath }                           from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── Config ────────────────────────────────────────────────────────────────────
const REGION   = process.env.AZURE_SPEECH_REGION   || 'eastus';
const ENDPOINT = process.env.AZURE_SPEECH_ENDPOINT || null;
const USE_AAD  = process.argv.includes('--aad');
const FORCE    = process.argv.includes('--force');

const VOICE_MAP = {
  ava:    'en-US-Ava:DragonHDOmniLatestNeural',
  serena: 'en-US-Serena:DragonHDOmniLatestNeural',
  nova:   'en-US-Nova:DragonHDOmniLatestNeural',
  emma:   'en-US-Emma:DragonHDOmniLatestNeural',
};
const VOICE_KEY  = process.env.MIRANDA_VOICE || 'ava';
const VOICE_NAME = VOICE_MAP[VOICE_KEY] ?? VOICE_MAP.ava;

// ── Style fallback ────────────────────────────────────────────────────────────
const STYLE_FALLBACK = {
  concerned: 'serious', disappointed: 'serious', suspicious: 'serious',
  defiant: 'serious', commanding: 'confident', urgent: 'determined',
  reflective: 'calm', frustrated: 'serious', proud: 'confident',
};
const resolveStyle = s => STYLE_FALLBACK[s] ?? s;

// ── Scene data (mirrors src/content/voiceovers/scene0Miranda.ts) ──────────────
const SCRIPTS = [
  {
    sceneId: 'scene0',
    lines: [
      { id: 'welcome',               text: 'Welcome to Veloris Maison.',                                                                    style: 'calm',       styleDegree: 1.15 },
      { id: 'running-out-of-time',   text: 'I brought you here because this house is running out of time.',                                  style: 'serious',    styleDegree: 1.35 },
      { id: 'systems-fragmented',    text: 'Our systems are fragmented.',                                                                    style: 'serious',    styleDegree: 1.40 },
      { id: 'data-scattered',        text: 'Our data is scattered.',                                                                         style: 'serious',    styleDegree: 1.35 },
      { id: 'ai-everywhere',         text: 'Our AI is everywhere.',                                                                          style: 'serious',    styleDegree: 1.25 },
      { id: 'transformation-nowhere',text: 'But transformation is nowhere.',                                                                 style: 'serious',    styleDegree: 1.35 },
      { id: 'changes-now',           text: 'Hm. That changes now.',                                                                         style: 'serious',    styleDegree: 1.50 },
      { id: 'new-cto',               text: 'You are my new CTO.',                                                                           style: 'confident',  styleDegree: 1.45 },
      { id: 'frontier-firm',         text: 'Before the next season begins, you will rebuild this maison into an AI-driven Frontier Firm.',   style: 'determined', styleDegree: 1.40 },
      { id: 'five-trials',           text: 'Five trials.',                                                                                   style: 'serious',    styleDegree: 1.65 },
      { id: 'one-season',            text: 'One season.',                                                                                    style: 'serious',    styleDegree: 1.65 },
      { id: 'no-excuses',            text: 'No excuses.',                                                                                    style: 'serious',    styleDegree: 1.80 },
    ],
  },
];

// ── SSML builder ──────────────────────────────────────────────────────────────
function buildSSML(text, style, styleDegree, voiceName) {
  return `<speak version="1.0"
       xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts"
       xml:lang="en-US">
  <voice name="${voiceName}"
         parameters="temperature=0.78;top_p=0.8;top_k=30;cfg_scale=1.15">
    <mstts:express-as style="${resolveStyle(style)}" styledegree="${styleDegree}">
      ${text}
    </mstts:express-as>
  </voice>
</speak>`;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function getAuthHeaders() {
  if (USE_AAD) {
    process.stdout.write('🔐  Getting Azure AD token... ');
    try {
      const token = execSync(
        'az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv',
        { stdio: ['pipe', 'pipe', 'pipe'] }
      ).toString().trim();
      console.log('✅');
      return { Authorization: `Bearer ${token}` };
    } catch {
      console.error('\n❌  Failed. Run `az login` first.');
      process.exit(1);
    }
  }
  const key = process.env.AZURE_SPEECH_KEY;
  if (!key) {
    console.error('❌  Set AZURE_SPEECH_KEY or use --aad flag.\n    az cognitiveservices account keys list --name <name> --resource-group <rg>');
    process.exit(1);
  }
  return { 'Ocp-Apim-Subscription-Key': key };
}

// ── HTTP synthesis ────────────────────────────────────────────────────────────
function synthesizeLine(ssml, outPath, authHeaders) {
  return new Promise((resolve, reject) => {
    const useCustom = USE_AAD && ENDPOINT;
    const hostname  = useCustom ? new URL(ENDPOINT).hostname : `${REGION}.tts.speech.microsoft.com`;
    const path      = useCustom ? '/tts/cognitiveservices/v1' : '/cognitiveservices/v1';
    const headers   = {
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
      'User-Agent': 'veloris-game/2.0',
      ...authHeaders,
    };
    if (useCustom) headers['Ocp-Apim-Subscription-Region'] = REGION;

    const req = request({ hostname, path, method: 'POST', headers }, (res) => {
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => (body += d));
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`)));
        return;
      }
      const out = createWriteStream(outPath);
      res.pipe(out);
      out.on('finish', resolve);
      out.on('error',  reject);
    });
    req.on('error', reject);
    req.write(ssml);
    req.end();
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🎙️   Veloris Maison — line-by-line voiceover synthesis');
  console.log(`     Voice  : ${VOICE_NAME}  (key: ${VOICE_KEY})`);
  console.log(`     Region : ${REGION}${ENDPOINT ? `  |  Endpoint: ${ENDPOINT}` : ''}`);
  console.log('');

  const authHeaders = getAuthHeaders();

  for (const script of SCRIPTS) {
    const dir = join(ROOT, 'public', 'audio', script.sceneId, VOICE_KEY);
    mkdirSync(dir, { recursive: true });
    console.log(`📁  public/audio/${script.sceneId}/${VOICE_KEY}/  (${script.lines.length} lines)`);

    for (const line of script.lines) {
      const outPath = join(dir, `${line.id}.mp3`);
      if (existsSync(outPath) && !FORCE) {
        console.log(`     ⏭   ${line.id}.mp3  (skip — use --force to overwrite)`);
        continue;
      }
      const ssml = buildSSML(line.text, line.style, line.styleDegree, VOICE_NAME);
      process.stdout.write(`     ⏳  ${line.id}.mp3 ...`);
      try {
        await synthesizeLine(ssml, outPath, authHeaders);
        console.log(' ✅');
      } catch (err) {
        console.log(` ❌  ${err.message}`);
      }
    }
    console.log('');
  }

  console.log('📋  Done. Next steps:');
  console.log('    git add public/audio/ && npm run build && git push');
  console.log('');
  console.log('🔄  To test another voice:');
  console.log('    MIRANDA_VOICE=serena node scripts/gen-voiceover.mjs --aad');
  console.log('    Add VITE_MIRANDA_VOICE=serena to .env.local and reload browser.');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });


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
const OUTPUT = join(OUTPUT_DIR, 'miranda-scene0-zh.mp3');
const USE_AAD = process.argv.includes('--aad');

// ── SSML ──────────────────────────────────────────────────────────────────────
const SSML = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="http://www.w3.org/2001/mstts"
       xml:lang="zh-CN">
  <voice name="zh-CN-XiaoxiaoNeural">

    <mstts:express-as style="calm" styledegree="1.2">
      <prosody rate="+8%" pitch="-1%">
        嗯。
        <break time="250ms"/>
        你终于来了。
        <break time="350ms"/>
        董事会要速度。
        <break time="180ms"/>
        业务部门要 Agent。
        <break time="180ms"/>
        每一个团队，都想把 AI 接进自己的系统。
        <break time="350ms"/>
        客户资料。
        <break time="120ms"/>
        订单数据。
        <break time="120ms"/>
        设计资产。
        <break time="120ms"/>
        供应链流程。
        <break time="120ms"/>
        财务权限。
      </prosody>
    </mstts:express-as>

    <break time="350ms"/>

    <mstts:express-as style="disgruntled" styledegree="1.4">
      <prosody rate="+5%" pitch="-1%">
        呵。
        <break time="250ms"/>
        他们说，这是通往 Frontier Firm 的路。
        <break time="300ms"/>
        听起来很美，对吗？
      </prosody>
    </mstts:express-as>

    <break time="350ms"/>

    <mstts:express-as style="serious" styledegree="1.45">
      <prosody rate="+10%" pitch="-2%">
        可是，CTO，
        <break time="250ms"/>
        你应该比任何人都清楚——
        <break time="350ms"/>
        AI 最危险的地方，
        <break time="200ms"/>
        从来不是它会不会回答。
        <break time="300ms"/>
        而是它能访问什么。
        <break time="150ms"/>
        能执行什么。
        <break time="150ms"/>
        又是谁，在治理它。
      </prosody>
    </mstts:express-as>

    <break time="300ms"/>

    <mstts:express-as style="angry" styledegree="1.75">
      <prosody rate="+18%" pitch="+2%" volume="+12%">
        如果没有边界，
        <break time="150ms"/>
        它不是助手。
        <break time="180ms"/>
        它是风险。
      </prosody>
    </mstts:express-as>

    <break time="350ms"/>

    <mstts:express-as style="whispering" styledegree="1.3">
      <prosody rate="+3%" pitch="-3%" volume="-3%">
        不。
        <break time="250ms"/>
        它甚至不是风险。
        <break time="250ms"/>
        它是已经打开的门。
      </prosody>
    </mstts:express-as>

    <break time="450ms"/>

    <mstts:express-as style="serious" styledegree="1.4">
      <prosody rate="+10%" pitch="-1%">
        所以今天，
        <break time="200ms"/>
        你不是来欣赏 Demo 的。
        <break time="350ms"/>
        你是来判断：
        <break time="250ms"/>
        哪些系统可以连接。
        <break time="150ms"/>
        哪些流程必须保护。
        <break time="150ms"/>
        哪些 Agent，必须被治理。
      </prosody>
    </mstts:express-as>

    <break time="400ms"/>

    <mstts:express-as style="calm" styledegree="1.2">
      <prosody rate="+8%" pitch="-2%">
        别急。
        <break time="300ms"/>
        每一个选择，都会留下后果。
        <break time="350ms"/>
        做对了，
        <break time="180ms"/>
        你会把这家公司带进未来。
        <break time="300ms"/>
        做错了……
        <break time="450ms"/>
        你会亲手把它推向失控。
      </prosody>
    </mstts:express-as>

    <break time="450ms"/>

    <mstts:express-as style="serious" styledegree="1.5">
      <prosody rate="+8%" pitch="-2%">
        现在，CTO。
        <break time="300ms"/>
        证明你配得上这个位置。
      </prosody>
    </mstts:express-as>

  </voice>
</speak>`;

    <mstts:express-as style="reflective" styledegree="1.2">
      Welcome
      <break time="400ms"/>
      to Veloris Maison.
    </mstts:express-as>

    <break time="900ms"/>

    <mstts:paralinguistic type="breathing"/>
    <break time="250ms"/>

    <mstts:express-as style="disappointed" styledegree="1.4">
      Hmm.
    </mstts:express-as>
    <break time="500ms"/>

    <mstts:express-as style="serious" styledegree="1.3">
      I brought you here
      <break time="350ms"/>
      because this house
      <break time="300ms"/>
      is running out of time.
    </mstts:express-as>

    <break time="800ms"/>

    <mstts:express-as style="frustrated" styledegree="1.3">
      Our systems are fragmented.
      <break time="450ms"/>
      Our data
      <break time="250ms"/>
      is scattered.
      <break time="450ms"/>
      Our AI is everywhere
      <break time="400ms"/>
    </mstts:express-as>

    <mstts:express-as style="disappointed" styledegree="1.5">
      but transformation
      <break time="300ms"/>
      is nowhere.
    </mstts:express-as>

    <break time="900ms"/>

    <mstts:paralinguistic type="sighing"/>
    <break time="400ms"/>

    <mstts:express-as style="defiant" styledegree="1.4">
      Well.
      <break time="350ms"/>
      That changes
      <break time="200ms"/>
      now.
    </mstts:express-as>

    <break time="700ms"/>

    <mstts:express-as style="proud" styledegree="1.3">
      You
      <break time="250ms"/>
      are my new CTO.
    </mstts:express-as>

    <break time="800ms"/>

    <mstts:express-as style="determined" styledegree="1.4">
      Before the next season begins,
      <break time="400ms"/>
      you will rebuild this maison
      <break time="350ms"/>
      into an AI-driven Frontier Firm.
    </mstts:express-as>

    <break time="1100ms"/>

    <mstts:express-as style="urgent" styledegree="1.8">
      Five trials.
      <break time="550ms"/>
      One season.
      <break time="750ms"/>
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
  console.log(`     Voice    : zh-CN-XiaoxiaoNeural`);
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
