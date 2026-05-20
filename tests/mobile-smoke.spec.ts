import { test, expect, type Page } from '@playwright/test';

const DEPLOY_URL = process.env.E2E_URL ?? 'https://sonic74129.github.io/veloris-game/';

const MEDIA_PATH_RE = /scene2-intro\.mp4|kinky-lily-map-zh\.mp3|assets\/bgm\.mp3/;

async function openMap(page: Page) {
  const payload = {
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
  };

  await page.goto(DEPLOY_URL);
  await page.evaluate((data) => {
    localStorage.setItem('veloris:progress', JSON.stringify(data));
    localStorage.removeItem('veloris:vo:map:played');
    localStorage.removeItem('veloris:bgm:muted');
  }, payload);
  await page.reload();

  const mapStartBtn = page.getByRole('button', { name: /开始第 1 关|Start.*Stage.*1/i });
  await expect(mapStartBtn).toBeVisible();

  // Landscape projects should not be blocked by rotate prompt.
  await expect(page.getByText('请将手机横屏体验')).toHaveCount(0);
}

test.describe('mobile smoke on map', () => {
  test('dialogue bubble, cinematic video element, and BGM toggle are present', async ({ page }) => {
    const critical404: string[] = [];
    page.on('response', (res) => {
      if (res.status() !== 404) return;
      const url = res.url();
      if (MEDIA_PATH_RE.test(url)) critical404.push(url);
    });

    await openMap(page);

    // Dialogue bubble should appear (preview text or active cue).
    await expect(page.getByText('哎呀，别被 Miranda 吓到了。她只是喜欢用董事会的语气开场。')).toBeVisible();

    // Video element should exist in DOM during cinematic setup.
    await expect(page.locator('video[src*="scene2-intro.mp4"]')).toHaveCount(1);

    // BGM button exists and can be toggled.
    const bgmBtn = page.getByRole('button', { name: /Play BGM|Mute BGM/i });
    await expect(bgmBtn).toBeVisible();
    await bgmBtn.click();
    await expect(page.getByRole('button', { name: /Play BGM|Mute BGM/i })).toBeVisible();

    // Critical media files must not 404.
    expect(critical404, `Critical media 404: ${critical404.join(', ')}`).toEqual([]);
  });

  test('cinematic finishes and dialogue appears afterward', async ({ page }) => {
    await openMap(page);

    const firstCue = page.getByText('哎呀，别被 Miranda 吓到了。她只是喜欢用董事会的语气开场。');

    // Dialogue should appear after cinematic completion (or fallback guard on mobile).
    await expect(firstCue).toBeVisible({ timeout: 20_000 });

    // Video should eventually fade out after intro completes.
    await page.waitForFunction(() => {
      const v = document.querySelector('video[src*="scene2-intro.mp4"]') as HTMLVideoElement | null;
      if (!v) return false;
      const style = window.getComputedStyle(v);
      return Number(style.opacity) <= 0.01;
    }, { timeout: 20_000 });
  });
});
