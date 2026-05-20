import { test } from '@playwright/test';

const PROD = 'https://sonic74129.github.io/veloris-game/';

test('diag prod: scene 2 entry on iPhone — cinematic/bubble/duck', async ({ page }) => {
  const consoleLogs: string[] = [];
  page.on('console', (msg) => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

  const events: string[] = [];
  await page.exposeFunction('__captureEvent', (name: string, detail: unknown) => {
    events.push(`${name} ${JSON.stringify(detail ?? {})}`);
  });

  await page.goto(PROD, { waitUntil: 'domcontentloaded' });

  // seed game state so we land directly on Scene 2 (map) as a fresh visit
  await page.evaluate(() => {
    localStorage.setItem('veloris:progress', JSON.stringify({
      state: {
        currentStageId: 'map',
        viewedStoryBriefs: {},
        activeStoryBriefStageId: null,
        unlockedStages: ['title', 'mission', 'map', 'stage1'],
        completedStages: [],
        slotAssignments: {},
        score: 0,
        energy: 100,
        language: 'zh',
        player: { name: 'E2E', company: 'TEST' },
        currentRun: null,
        stageScores: [],
        runResult: null,
      },
      version: 2,
    }));
    // make sure speech bubble auto-plays
    localStorage.removeItem('veloris:vo:map:played');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });

  // attach event taps before app initialises further
  await page.evaluate(() => {
    ['veloris:vo:start', 'veloris:vo:end', 'veloris:vo:speaker'].forEach((n) => {
      document.addEventListener(n, (e) => {
        // @ts-expect-error injected
        window.__captureEvent(n, (e as CustomEvent).detail);
      });
      window.addEventListener(n, (e) => {
        // @ts-expect-error injected
        window.__captureEvent(n, (e as CustomEvent).detail ?? null);
      });
    });
  });

  // simulate a user tap to unlock audio
  await page.mouse.click(180, 400);
  await page.waitForTimeout(800);

  await page.waitForTimeout(10000); // give cinematic (up to 8s fallback) + bubble time

  // capture DOM state
  const state = await page.evaluate(() => {
    const sb = document.querySelector('[aria-label*="Tap to play"]') || document.querySelector('.frame-corners');
    const bubbleText = document.body.innerText.match(/(别被 Miranda|CTO|准备好|第一关)/g);
    const video = document.querySelector('video');
    const audios = Array.from(document.querySelectorAll('audio')).map((a) => ({
      src: a.src.split('/').pop(),
      paused: a.paused,
      readyState: a.readyState,
      currentTime: a.currentTime,
      duration: a.duration,
      muted: a.muted,
    }));
    return {
      hasBubble: !!sb,
      bubbleMatches: bubbleText,
      videoExists: !!video,
      videoPaused: video?.paused,
      videoReadyState: video?.readyState,
      videoCurrentTime: video?.currentTime,
      audios,
      bodyHasMap: /MICROSOFT ADVISORY|FIVE CHALLENGES/.test(document.body.innerText),
    };
  });

  console.log('=== EVENTS ===');
  events.slice(-30).forEach((e) => console.log(e));
  console.log('=== CONSOLE ===');
  consoleLogs.slice(-30).forEach((l) => console.log(l));
  console.log('=== STATE ===');
  console.log(JSON.stringify(state, null, 2));

  await page.screenshot({ path: 'test-results/prod-diag.png', fullPage: true });
});
