import { test, expect } from '@playwright/test';

const APP_URL = process.env.E2E_URL ?? 'http://127.0.0.1:4175/veloris-game/';

test('diagnose which slot has over state during drag', async ({ page }) => {
  const payload = {
    state: {
      currentStageId: 'stage1',
      viewedStoryBriefs: { stage1: true },
      activeStoryBriefStageId: null,
      unlockedStages: ['title', 'mission', 'map', 'stage1'],
      completedStages: [],
      slotAssignments: { 'slot-legacy-assessment': ['azure-migrate'] },
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

  await page.goto(APP_URL);
  await page.evaluate((data) => {
    localStorage.setItem('veloris:progress', JSON.stringify(data));
  }, payload);
  await page.reload();

  // drag Azure Migrate (correct for Q1) toward Q2 area to test
  const card = page.getByRole('button', { name: /Power BI/i }).first();
  const q1 = page.locator('[data-stage1-slot-id="slot-legacy-assessment"]');
  const q2 = page.locator('[data-stage1-slot-id="slot-app-modernization"]');

  const cb = await card.boundingBox();
  const q1b = await q1.boundingBox();
  const q2b = await q2.boundingBox();
  if (!cb || !q1b || !q2b) throw new Error('missing boxes');

  const sx = cb.x + cb.width / 2;
  const sy = cb.y + cb.height / 2;
  const tx = q2b.x + q2b.width / 2;
  const ty = q2b.y + q2b.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(tx, ty, { steps: 20 });
  await page.waitForTimeout(200);

  const q1Class = await q1.getAttribute('class');
  const q2Class = await q2.getAttribute('class');
  const elAtPointer = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const slot = el?.closest('[data-stage1-slot-id]') as HTMLElement | null;
    return {
      tag: el?.tagName,
      slotId: slot?.getAttribute('data-stage1-slot-id') ?? null,
      pointerEvents: el ? getComputedStyle(el).pointerEvents : null,
    };
  }, { x: tx, y: ty });

  console.log('=== DIAG ===');
  console.log('start', { sx, sy });
  console.log('target', { tx, ty });
  console.log('Q1 class:', q1Class);
  console.log('Q2 class:', q2Class);
  console.log('elementFromPoint(target):', elAtPointer);
  console.log('============');

  await page.mouse.up();
  expect(elAtPointer.slotId).toBe('slot-app-modernization');
});
