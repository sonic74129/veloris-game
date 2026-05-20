import { test } from '@playwright/test';

const APP_URL = process.env.E2E_URL ?? 'http://127.0.0.1:4175/veloris-game/';

const payload = (slotAssignments: Record<string, string[]>) => ({
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

test('proof C: capture moment the dragged card touches Q1', async ({ page }) => {
  await page.goto(APP_URL);
  await page.evaluate(
    (d) => localStorage.setItem('veloris:progress', JSON.stringify(d)),
    payload({}),
  );
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
  await page.mouse.move(tx, ty, { steps: 24 });
  await page.waitForTimeout(220);

  // Find the active DragOverlay element by dnd-kit attribute, fallback to text match
  await page.evaluate(
    ({ sx, sy, tx, ty }) => {
      const old = document.getElementById('proof-overlay');
      if (old) old.remove();

      const ov = document.createElement('div');
      ov.id = 'proof-overlay';
      ov.style.cssText =
        'position:fixed;inset:0;pointer-events:none;z-index:2147483647;';

      const box = (
        rect: DOMRect,
        color: string,
        label: string,
      ) => {
        const b = document.createElement('div');
        b.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;border:3px solid ${color};box-sizing:border-box;box-shadow:0 0 14px ${color};border-radius:6px;`;
        const t = document.createElement('div');
        t.textContent = label;
        t.style.cssText = `position:fixed;left:${rect.left}px;top:${Math.max(0, rect.top - 22)}px;padding:2px 6px;background:${color};color:#000;font:11px monospace;border-radius:4px;font-weight:700;`;
        ov.appendChild(b);
        ov.appendChild(t);
      };

      const dot = (x: number, y: number, label: string, color: string) => {
        const d = document.createElement('div');
        d.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:14px;height:14px;border-radius:50%;transform:translate(-50%,-50%);background:${color};box-shadow:0 0 0 2px rgba(0,0,0,.7),0 0 12px ${color};`;
        const t = document.createElement('div');
        t.textContent = label;
        t.style.cssText = `position:fixed;left:${x + 12}px;top:${y - 22}px;padding:3px 8px;border:1px solid #ffd66b;border-radius:7px;background:rgba(0,0,0,.85);color:#fff;font:12px monospace;white-space:nowrap;`;
        ov.appendChild(d);
        ov.appendChild(t);
      };

      // Q1 slot box
      const q1 = document.querySelector(
        '[data-stage1-slot-id="slot-legacy-assessment"]',
      ) as HTMLElement | null;
      if (q1) box(q1.getBoundingClientRect(), '#4de2ff', 'Q1 SLOT');

      // Locate the dragged overlay card. dnd-kit DragOverlay wrapper has aria-pressed/role and sits at document.body level.
      // Heuristic: find a fixed-positioned element whose textContent includes 'Power BI' and is NOT the original draggable.
      const original = Array.from(
        document.querySelectorAll('[role="button"]'),
      ).find((el) => /Power BI/i.test(el.textContent ?? ''));
      const candidates = Array.from(document.body.querySelectorAll('div')).filter(
        (el) => {
          if (el === original) return false;
          if (el.contains(original as Node)) return false;
          const cs = getComputedStyle(el);
          if (cs.position !== 'fixed') return false;
          if (!/Power BI/i.test(el.textContent ?? '')) return false;
          return true;
        },
      );
      // Pick the one with the smallest area (innermost card)
      candidates.sort(
        (a, b) =>
          a.getBoundingClientRect().width * a.getBoundingClientRect().height -
          b.getBoundingClientRect().width * b.getBoundingClientRect().height,
      );
      const overlayCard = candidates[0] as HTMLElement | undefined;
      if (overlayCard) {
        box(overlayCard.getBoundingClientRect(), '#ff6b6b', 'DRAGGED CARD');
      } else {
        const note = document.createElement('div');
        note.textContent = 'overlay card not found in DOM';
        note.style.cssText =
          'position:fixed;left:50%;top:40px;transform:translateX(-50%);padding:6px 12px;background:#ff6b6b;color:#000;font:12px monospace;border-radius:6px;';
        ov.appendChild(note);
      }

      dot(sx, sy, 'start', '#ff6b6b');
      dot(tx, ty, 'mouse', '#4de2ff');

      const cap = document.createElement('div');
      cap.textContent =
        'C · moment of contact — red box = dragged card, blue box = Q1 slot';
      cap.style.cssText =
        'position:fixed;left:50%;top:8px;transform:translateX(-50%);padding:8px 14px;border:1px solid #ffd66b;border-radius:8px;background:rgba(0,0,0,.85);color:#ffd66b;font:13px monospace;';
      ov.appendChild(cap);

      document.body.appendChild(ov);
    },
    { sx, sy, tx, ty },
  );

  await page.screenshot({ path: 'test-results/proof-C-contact.png', fullPage: true });
  await page.mouse.up();
});
