import { test, expect } from '@playwright/test';

const APP_URL = process.env.E2E_URL ?? 'https://sonic74129.github.io/veloris-game/';

test.describe('mobile drag alignment', () => {
  test('stage1 drag card lands on expected slot', async ({ page }) => {
    const payload = {
      state: {
        currentStageId: 'stage1',
        viewedStoryBriefs: { stage1: true },
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

    await page.goto(APP_URL);
    await page.evaluate((data) => {
      localStorage.setItem('veloris:progress', JSON.stringify(data));
    }, payload);
    await page.reload();

    await expect(page.getByText('问题 1：先看清旧系统')).toBeVisible();

    const card = page.getByRole('button', { name: /Azure Migrate/i }).first();
    const drop = page.getByText('DROP CARD HERE').first();

    await expect(card).toBeVisible();
    await expect(drop).toBeVisible();
    await card.dragTo(drop);

    const slotBlock = page.getByText('问题 1：先看清旧系统').locator('xpath=ancestor::div[1]');
    await expect(slotBlock).toContainText('Azure Migrate');
  });
});
