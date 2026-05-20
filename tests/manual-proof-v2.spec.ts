import { test } from '@playwright/test';

const APP_URL = process.env.E2E_URL ?? 'http://127.0.0.1:4175/veloris-game/';

const basePayload = (slotAssignments: Record<string, string[]>) => ({
  state: {
    currentStageId: 'stage1',
    viewedStoryBriefs: { stage1: true },
    activeStoryBriefStageId: null,
    unlockedStages: ['title', 'mission', 'map', 'stage1'],
    completedStages: [],
    slotAssignments,
    score: 0,
    energy: 100,
    language: 'zh',
    player: { name: 'E2E', company: 'TEST' },
    currentRun: null,
    stageScores: [],
    runResult: null,
  },
  version: 2,
});

async function annotate(
  page: import('@playwright/test').Page,
  sx: number,
  sy: number,
  tx: number,
  ty: number,
  caption: string,
) {
  await page.evaluate(
    ({ sx, sy, tx, ty, caption }) => {
      const old = document.getElementById('proof-overlay');
      if (old) old.remove();
      const ov = document.createElement('div');
      ov.id = 'proof-overlay';
      ov.style.cssText =
        'position:fixed;inset:0;pointer-events:none;z-index:2147483647;';
      const mk = (x: number, y: number, label: string, color: string) => {
        const d = document.createElement('div');
        d.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:14px;height:14px;border-radius:50%;transform:translate(-50%,-50%);background:${color};box-shadow:0 0 0 2px rgba(0,0,0,.7),0 0 12px ${color};`;
        const t = document.createElement('div');
        t.textContent = label;
        t.style.cssText = `position:fixed;left:${x + 12}px;top:${y - 22}px;padding:3px 8px;border:1px solid #ffd66b;border-radius:7px;background:rgba(0,0,0,.85);color:#fff;font:12px monospace;white-space:nowrap;`;
        ov.appendChild(d);
        ov.appendChild(t);
      };
      mk(sx, sy, 'start', '#ff6b6b');
      mk(tx, ty, 'mouse', '#4de2ff');
      const cap = document.createElement('div');
      cap.textContent = caption;
      cap.style.cssText =
        'position:fixed;left:50%;top:8px;transform:translateX(-50%);padding:8px 14px;border:1px solid #ffd66b;border-radius:8px;background:rgba(0,0,0,.85);color:#ffd66b;font:14px monospace;z-index:2147483647;';
      ov.appendChild(cap);
      document.body.appendChild(ov);
    },
    { sx, sy, tx, ty, caption },
  );
}

test('proof A: drag PowerBI to Q1 (Q1 fresh) — Q1 lights up as over', async ({ page }) => {
  await page.goto(APP_URL);
  await page.evaluate((d) => localStorage.setItem('veloris:progress', JSON.stringify(d)), basePayload({}));
  await page.reload();

  const card = page.getByRole('button', { name: /Power BI/i }).first();
  const q1 = page.locator('[data-stage1-slot-id="slot-legacy-assessment"]');

  const cb = await card.boundingBox();
  const q1b = await q1.boundingBox();
  if (!cb || !q1b) throw new Error('boxes');

  const sx = cb.x + cb.width / 2;
  const sy = cb.y + cb.height / 2;
  const tx = q1b.x + q1b.width / 2;
  const ty = q1b.y + q1b.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(tx, ty, { steps: 22 });
  await page.waitForTimeout(180);

  await annotate(page, sx, sy, tx, ty, 'A · drag to Q1 → Q1 should be the only highlighted slot');
  await page.screenshot({ path: 'test-results/proof-A-over-Q1.png', fullPage: true });
  await page.mouse.up();
});

test('proof B: drag PowerBI to Q2 (Q1 solved) — Q2 lights up as over', async ({ page }) => {
  await page.goto(APP_URL);
  await page.evaluate(
    (d) => localStorage.setItem('veloris:progress', JSON.stringify(d)),
    basePayload({ 'slot-legacy-assessment': ['azure-migrate'] }),
  );
  await page.reload();

  const card = page.getByRole('button', { name: /Power BI/i }).first();
  const q2 = page.locator('[data-stage1-slot-id="slot-app-modernization"]');

  const cb = await card.boundingBox();
  const q2b = await q2.boundingBox();
  if (!cb || !q2b) throw new Error('boxes');

  const sx = cb.x + cb.width / 2;
  const sy = cb.y + cb.height / 2;
  const tx = q2b.x + q2b.width / 2;
  const ty = q2b.y + q2b.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(tx, ty, { steps: 22 });
  await page.waitForTimeout(180);

  await annotate(
    page,
    sx,
    sy,
    tx,
    ty,
    'B · drag to Q2 → Q1 still glows because it is already SOLVED; Q2 has hover highlight under mouse',
  );
  await page.screenshot({ path: 'test-results/proof-B-over-Q2.png', fullPage: true });
  await page.mouse.up();
});
