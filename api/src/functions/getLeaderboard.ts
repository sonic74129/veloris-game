import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableClient, TableServiceClient } from "@azure/data-tables";

const TABLE_NAME = "leaderboard";

function getTableClient(): TableClient {
  const connStr = process.env.TABLE_CONNECTION || "UseDevelopmentStorage=true";
  return TableClient.fromConnectionString(connStr, TABLE_NAME);
}

// Ensure table exists (idempotent)
let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  const connStr = process.env.TABLE_CONNECTION || "UseDevelopmentStorage=true";
  const serviceClient = TableServiceClient.fromConnectionString(connStr);
  try {
    await serviceClient.createTable(TABLE_NAME);
  } catch (e: any) {
    if (e.statusCode !== 409) throw e; // 409 = already exists
  }
  tableReady = true;
}

export async function getLeaderboard(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  await ensureTable();
  const client = getTableClient();

  const entries: any[] = [];
  const iter = client.listEntities({
    queryOptions: { filter: `PartitionKey eq 'frontier'` },
  });
  for await (const entity of iter) {
    entries.push({
      playerName: entity.playerName as string,
      company: entity.company as string,
      totalScore: entity.totalScore as number,
      totalTime: entity.totalTime as number,
      totalWrongAttempts: entity.totalWrongAttempts as number,
      totalHintsUsed: entity.totalHintsUsed as number,
      timestamp: entity.ts as number,
    });
  }

  // Sort: -totalScore, +totalTime, +wrong, +hints
  entries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.totalTime !== b.totalTime) return a.totalTime - b.totalTime;
    if (a.totalWrongAttempts !== b.totalWrongAttempts) return a.totalWrongAttempts - b.totalWrongAttempts;
    return a.totalHintsUsed - b.totalHintsUsed;
  });

  // Assign ranks
  const ranked = entries.map((e, i) => ({ ...e, rank: i + 1 }));

  return { jsonBody: ranked };
}

app.http("getLeaderboard", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "leaderboard",
  handler: getLeaderboard,
});
