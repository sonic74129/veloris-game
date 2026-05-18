import { execSync, execFileSync } from 'child_process';
import { createWriteStream, mkdirSync, unlinkSync, existsSync } from 'fs';
import { request } from 'https';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT     = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENDPOINT = 'https://speechsmegtm-gtm.cognitiveservices.azure.com';
const TMP      = join(ROOT, 'public/audio/_tmp_map');
const OUTPUT   = join(ROOT, 'public/audio/kinky-lily-map-zh.mp3');

// ── Segments: { voice, style, degree, rate, pitch, text, pauseAfterMs } ───────
const SEGMENTS = [
  { voice:'zh-CN-XiaomoNeural',   style:'cheerful',    degree:1.25, rate:'+8%',  pitch:'-1%', pauseAfterMs:220,
    text:'哎呀，别被 Miranda 吓到了。<break time="180ms"/>她只是喜欢用董事会的语气开场。' },
  { voice:'zh-CN-XiaoxiaoNeural', style:'cheerful',    degree:1.3,  rate:'+10%', pitch:'+2%', pauseAfterMs:220,
    text:'哈哈，CTO，放轻松一点。<break time="160ms"/>你不是一个人在闯关。' },
  { voice:'zh-CN-XiaomoNeural',   style:'calm',        degree:1.15, rate:'+8%',  pitch:'-1%', pauseAfterMs:180,
    text:'我们会陪你把 AI 接进真正的业务系统，<break time="160ms"/>但不是乱接。' },
  { voice:'zh-CN-XiaoxiaoNeural', style:'serious',     degree:1.2,  rate:'+11%', pitch:'+2%', pauseAfterMs:240,
    text:'对，要接得快，也要接得安全。<break time="140ms"/>Agent、数据、流程、权限，一个都不能放飞。' },
  { voice:'zh-CN-XiaomoNeural',   style:'calm',        degree:1.2,  rate:'+8%',  pitch:'-1%', pauseAfterMs:180,
    text:'从现在开始，我们代表 Microsoft，<break time="150ms"/>帮你一步一步打造 AI Frontier Firm。' },
  { voice:'zh-CN-XiaoxiaoNeural', style:'calm',        degree:1.2,  rate:'+9%',  pitch:'+2%', pauseAfterMs:240,
    text:'放心啦。<break time="160ms"/>只要你做对选择，这家公司一定可以升级成功。' },
  { voice:'zh-CN-XiaomoNeural',   style:'cheerful',    degree:1.2,  rate:'+9%',  pitch:'-1%', pauseAfterMs:180,
    text:'那么，CTO，准备好了吗？' },
  { voice:'zh-CN-XiaoxiaoNeural', style:'cheerful',    degree:1.3,  rate:'+11%', pitch:'+2%', pauseAfterMs:0,
    text:'第一关，要开始咯。' },
];

function buildSSML(seg) {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">
  <voice name="${seg.voice}">
    <mstts:express-as style="${seg.style}" styledegree="${seg.degree}">
      <prosody rate="${seg.rate}" pitch="${seg.pitch}">${seg.text}</prosody>
    </mstts:express-as>
  </voice>
</speak>`;
}

function synthesize(ssml, outPath) {
  return new Promise((resolve, reject) => {
    const token = execSync(
      'az account get-access-token --resource https://cognitiveservices.azure.com --query accessToken -o tsv',
      { stdio: ['pipe','pipe','pipe'] }
    ).toString().trim();

    const body = Buffer.from(ssml, 'utf8');
    const hostname = new URL(ENDPOINT).hostname;
    const headers = {
      'Content-Type': 'application/ssml+xml',
      'User-Agent': 'veloris-game/1.0',
      'Content-Length': body.length,
      'X-Microsoft-OutputFormat': 'audio-48khz-192kbitrate-mono-mp3',
      'Authorization': `Bearer ${token}`,
      'Ocp-Apim-Subscription-Region': 'eastus2',
    };

    const req = request({ hostname, path: '/tts/cognitiveservices/v1', method: 'POST', headers }, (res) => {
      if (res.statusCode !== 200) {
        let b = ''; res.on('data', d => b += d);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${b.slice(0,200)}`)));
        return;
      }
      const out = createWriteStream(outPath);
      res.pipe(out);
      out.on('finish', resolve);
      out.on('error', reject);
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

mkdirSync(TMP, { recursive: true });

console.log('🎙️  Generating segments...');
const files = [];
for (let i = 0; i < SEGMENTS.length; i++) {
  const seg = SEGMENTS[i];
  const name = seg.voice.includes('Xiaomo') ? 'kinky' : 'lily';
  const file = join(TMP, `seg${i.toString().padStart(2,'0')}_${name}.mp3`);
  process.stdout.write(`  [${i+1}/${SEGMENTS.length}] ${name} "${seg.text.replace(/<[^>]+>/g,'').slice(0,20)}..." `);
  await synthesize(buildSSML(seg), file);
  console.log('✅');
  files.push({ file, pauseMs: seg.pauseAfterMs });
}

console.log('\n🔗  Merging with ffmpeg...');
// Build ffmpeg concat with silence padding between segments
const inputs = [];
const filterParts = [];
let idx = 0;
for (const { file, pauseMs } of files) {
  inputs.push('-i', file);
  filterParts.push(`[${idx}]`);
  idx++;
  if (pauseMs > 0) {
    inputs.push('-f', 'lavfi', '-t', String(pauseMs / 1000), '-i', 'aevalsrc=0');
    filterParts.push(`[${idx}]`);
    idx++;
  }
}
const filterComplex = filterParts.join('') + `concat=n=${idx}:v=0:a=1[out]`;
execFileSync('ffmpeg', ['-y', ...inputs, '-filter_complex', filterComplex, '-map', '[out]', '-codec:a', 'libmp3lame', '-b:a', '192k', OUTPUT], { stdio: 'inherit' });

// Cleanup tmp
for (const { file } of files) { try { unlinkSync(file); } catch {} }
try { require('fs').rmdirSync(TMP); } catch {}

console.log(`\n✅  Done → ${OUTPUT}`);
