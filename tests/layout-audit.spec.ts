/**
 * Layout audit — seed straight into each scene, screenshot + report overlaps.
 */
import { test } from '@playwright/test';

const URL = 'http://localhost:4173/veloris-game/';

interface Box { x: number; y: number; w: number; h: number; }

function overlapArea(a: Box, b: Box): number {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  return x * y;
}

async function snap(page: import('@playwright/test').Page, name: string) {
  await page.screenshot({ path: `test-results/audit-${name}.png`, fullPage: false });
}

async function getBoxes(page: import('@playwright/test').Page, selectors: { name: string; sel: string }[]) {
  return Promise.all(selectors.map(async ({ name, sel }) => {
    const box = await page.evaluate((s) => {
      const el = document.querySelector(s) as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    }, sel);
    return { name, box };
  }));
}

function report(scene: string, named: { name: string; box: Box | null }[]) {
  console.log(`\n=== ${scene} ===`);
  for (const n of named) {
    console.log(`  ${n.name.padEnd(20)}: ${n.box ? `${Math.round(n.box.x)},${Math.round(n.box.y)} ${Math.round(n.box.w)}x${Math.round(n.box.h)}` : 'MISSING'}`);
  }
  for (let i = 0; i < named.length; i++) {
    for (let j = i + 1; j < named.length; j++) {
      const a = named[i].box; const b = named[j].box;
      if (!a || !b) continue;
      const ov = overlapArea(a, b);
      if (ov > 500) console.log(`  ⚠ OVERLAP ${named[i].name} ↔ ${named[j].name} = ${Math.round(ov)} px²`);
    }
  }
}

async function seed(page: import('@playwright/test').Page, state: object) {
  await page.goto(URL);
  await page.evaluate((s) => {
    localStorage.clear();
    const base = {
      currentStageId: 'title',
      viewedStoryBriefs: {},
      activeStoryBriefStageId: null,
      unlockedStages: ['title','mission','map','stage1','stage2','stage3','stage4','stage5','results','leaderboard'],
      completedStages: [],
      slotAssignments: {},
      score: 0,
      energy: 100,
      language: 'zh',
      player: { name: 'TestPlayer', company: 'TestCo' },
      currentRun: null,
      stageScores: [],
      runResult: null,
    };
    localStorage.setItem('veloris:progress', JSON.stringify({ state: { ...base, ...s }, version: 2 }));
  }, state);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
}

test('audit stage1 brief overlay', async ({ page }) => {
  await seed(page, { currentStageId: 'stage1', completedStages: ['title','mission','map'], activeStoryBriefStageId: 'stage1' });
  await snap(page, '01-stage1-overlay');
  const boxes = await getBoxes(page, [
    { name: 'overlay-panel', sel: 'div.z-\\[60\\] > div:not(.absolute)' },
    { name: 'overlay-body', sel: '.z-\\[60\\] p' },
    { name: 'enter-button', sel: '.z-\\[60\\] button' },
  ]);
  report('stage1-overlay', boxes);
});

test('audit stage1 board', async ({ page }) => {
  await seed(page, {
    currentStageId: 'stage1',
    completedStages: ['title','mission','map'],
    viewedStoryBriefs: { stage1: true },
    activeStoryBriefStageId: null,
  });
  await snap(page, '02-stage1-board');
  const boxes = await getBoxes(page, [
    { name: 'character-kinky', sel: 'img[alt="Kinky"]' },
    { name: 'character-lily', sel: 'img[alt="Lily"]' },
    { name: 'stage-header', sel: '.eyebrow' },
    { name: 'story-bg-card', sel: '[class*="frame-corners"]' },
  ]);
  report('stage1-board', boxes);
});

test('audit map', async ({ page }) => {
  await seed(page, { currentStageId: 'map', completedStages: ['title','mission'] });
  await snap(page, '03-map');
});

test('audit leaderboard', async ({ page }) => {
  await seed(page, {
    currentStageId: 'leaderboard',
    completedStages: ['title','mission','map','stage1','stage2','stage3','stage4','stage5'],
  });
  await snap(page, '04-leaderboard');
});
