/**
 * Frontier Firm Leaderboard — Google Apps Script Web App
 * 
 * 设置步骤：
 * 1. 打开 Google Sheets → 建一个新 Sheet，命名为 "Leaderboard"
 * 2. 第一行写表头：playerName | company | totalScore | totalTime | totalWrongAttempts | totalHintsUsed | timestamp
 * 3. Extensions → Apps Script → 贴上这个代码 → Save
 * 4. Deploy → New deployment → Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. 复制 deployment URL → 填到前端 .env 的 VITE_LEADERBOARD_API
 *
 * 注意：第一次 deploy 会要求授权 Google Sheets 权限，点 Allow 即可
 */

const SHEET_NAME = 'Leaderboard';

// Seed data — first time only
const SEED_DATA = [
  ['Miranda Priestly', 'Runway Group', 1800, 360, 8, 2, 1716000000000],
  ['Lily Chen', 'Contoso Maison', 1400, 400, 10, 3, 1716100000000],
  ['Kinky Wang', 'Fabrikam', 1100, 430, 12, 3, 1716200000000],
  ['Nigel', 'Atelier AI', 800, 470, 14, 4, 1716300000000],
  ['Emily Charlton', 'Cerulean', 500, 520, 16, 5, 1716400000000],
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Headers
    sheet.getRange(1, 1, 1, 7).setValues([['playerName', 'company', 'totalScore', 'totalTime', 'totalWrongAttempts', 'totalHintsUsed', 'timestamp']]);
    // Seed
    sheet.getRange(2, 1, SEED_DATA.length, 7).setValues(SEED_DATA);
  }
  return sheet;
}

// GET ?action=reset → clear and re-seed the sheet
// GET ?action=clear → clear sheet with NO seed entries
function doGet(e) {
  if (e && e.parameter && (e.parameter.action === 'reset' || e.parameter.action === 'clear')) {
    const wantSeed = e.parameter.action === 'reset';
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (sheet) ss.deleteSheet(sheet);
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 7).setValues([['playerName', 'company', 'totalScore', 'totalTime', 'totalWrongAttempts', 'totalHintsUsed', 'timestamp']]);
    if (wantSeed) {
      sheet.getRange(2, 1, SEED_DATA.length, 7).setValues(SEED_DATA);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, message: wantSeed ? 'Sheet reset with seed data' : 'Sheet cleared (no seed)' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  const entries = rows.map(row => ({
    playerName: row[0],
    company: row[1],
    totalScore: Number(row[2]),
    totalTime: Number(row[3]),
    totalWrongAttempts: Number(row[4]),
    totalHintsUsed: Number(row[5]),
    timestamp: Number(row[6]),
  }));

  // Sort: -totalScore, +totalTime, +wrong, +hints
  entries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.totalTime !== b.totalTime) return a.totalTime - b.totalTime;
    if (a.totalWrongAttempts !== b.totalWrongAttempts) return a.totalWrongAttempts - b.totalWrongAttempts;
    return a.totalHintsUsed - b.totalHintsUsed;
  });

  // Assign ranks
  const ranked = entries.map((e, i) => ({ ...e, rank: i + 1 }));

  return ContentService
    .createTextOutput(JSON.stringify(ranked))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST request → append new entry
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // Validate
    if (!body.playerName || !body.company || typeof body.totalScore !== 'number') {
      return ContentService
        .createTextOutput(JSON.stringify({ error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = getSheet();
    const ts = Date.now();

    sheet.appendRow([
      String(body.playerName).slice(0, 50),
      String(body.company).slice(0, 80),
      Math.max(0, Math.min(99999, Number(body.totalScore))),
      Number(body.totalTime) || 0,
      Number(body.totalWrongAttempts) || 0,
      Number(body.totalHintsUsed) || 0,
      ts,
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, timestamp: ts }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
