import { test } from '@playwright/test';

const APP_URL = process.env.E2E_URL ?? 'http://127.0.0.1:4175/veloris-game/';

test('manual proof screenshot with three markers on stage1', async ({ page }) => {
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

  const card = page.getByRole('button', { name: /Power BI/i }).first();
  const drop = page.getByText('DROP CARD HERE').first();

  const cb = await card.boundingBox();
  const db = await drop.boundingBox();
  if (!cb || !db) {
    throw new Error('Unable to locate card/drop boxes');
  }

  const sx = cb.x + cb.width / 2;
  const sy = cb.y + cb.height / 2;
  const tx = db.x + db.width / 2;
  const ty = db.y + db.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(tx, ty, { steps: 18 });
  await page.waitForTimeout(120);

  await page.evaluate(({ sx, sy, tx, ty }) => {
    const old = document.getElementById('proof-overlay');
    if (old) old.remove();

    const ov = document.createElement('div');
    ov.id = 'proof-overlay';
    ov.style.position = 'fixed';
    ov.style.inset = '0';
    ov.style.pointerEvents = 'none';
    ov.style.zIndex = '2147483647';

    const mk = (x: number, y: number, label: string, color: string) => {
      const d = document.createElement('div');
      d.style.position = 'fixed';
      d.style.left = `${x}px`;
      d.style.top = `${y}px`;
      d.style.width = '14px';
      d.style.height = '14px';
      d.style.borderRadius = '50%';
      d.style.transform = 'translate(-50%, -50%)';
      d.style.background = color;
      d.style.boxShadow = `0 0 0 2px rgba(0,0,0,.7), 0 0 12px ${color}`;

      const t = document.createElement('div');
      t.textContent = label;
      t.style.position = 'fixed';
      t.style.left = `${x + 10}px`;
      t.style.top = `${y - 20}px`;
      t.style.padding = '3px 7px';
      t.style.border = '1px solid #ffd66b';
      t.style.borderRadius = '7px';
      t.style.background = 'rgba(0,0,0,.82)';
      t.style.color = '#fff';
      t.style.font = '12px monospace';

      ov.appendChild(d);
      ov.appendChild(t);
    };

    mk(sx, sy, '拖拽起点', '#ff6b6b');
    mk(tx + 22, ty + 18, '滑鼠位置', '#4de2ff');
    mk(tx, ty, '右侧目标中心', '#ffe066');

    const mouse = document.createElement('div');
    mouse.textContent = '🖱';
    mouse.style.position = 'fixed';
    mouse.style.left = `${tx + 42}px`;
    mouse.style.top = `${ty + 22}px`;
    mouse.style.color = '#fff';
    mouse.style.font = '18px monospace';
    mouse.style.textShadow = '0 0 6px rgba(0,0,0,.9)';
    ov.appendChild(mouse);

    document.body.appendChild(ov);
  }, { sx, sy, tx, ty });

  await page.screenshot({ path: 'test-results/manual-proof-stage1-3points.png', fullPage: true });
  await page.mouse.up();
});
