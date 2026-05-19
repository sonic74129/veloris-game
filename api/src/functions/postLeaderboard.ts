import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { TableClient, TableServiceClient } from "@azure/data-tables";

const TABLE_NAME = "leaderboard";

function getTableClient(): TableClient {
  const connStr = process.env.TABLE_CONNECTION || "UseDevelopmentStorage=true";
  return TableClient.fromConnectionString(connStr, TABLE_NAME);
}

let tableReady = false;
async function ensureTable() {
  if (tableReady) return;
  const connStr = process.env.TABLE_CONNECTION || "UseDevelopmentStorage=true";
  const serviceClient = TableServiceClient.fromConnectionString(connStr);
  try {
    await serviceClient.createTable(TABLE_NAME);
  } catch (e: any) {
    if (e.statusCode !== 409) throw e;
  }
  tableReady = true;
}

interface PostBody {
  playerName: string;
  company: string;
  totalScore: number;
  totalTime: number;
  totalWrongAttempts: number;
  totalHintsUsed: number;
}

export async function postLeaderboard(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  await ensureTable();

  let body: PostBody;
  try {
    body = (await req.json()) as PostBody;
  } catch {
    return { status: 400, jsonBody: { error: "Invalid JSON body" } };
  }

  // Validate
  if (!body.playerName || typeof body.playerName !== "string" || body.playerName.length > 50) {
    return { status: 400, jsonBody: { error: "playerName required (max 50 chars)" } };
  }
  if (!body.company || typeof body.company !== "string" || body.company.length > 80) {
    return { status: 400, jsonBody: { error: "company required (max 80 chars)" } };
  }
  if (typeof body.totalScore !== "number" || body.totalScore < 0 || body.totalScore > 99999) {
    return { status: 400, jsonBody: { error: "totalScore must be 0-99999" } };
  }

  const client = getTableClient();
  const ts = Date.now();
  // RowKey: inverted timestamp + random for uniqueness & descending order
  const rowKey = `${(9999999999999 - ts).toString().padStart(13, "0")}_${Math.random().toString(36).slice(2, 8)}`;

  await client.createEntity({
    partitionKey: "frontier",
    rowKey,
    playerName: body.playerName.slice(0, 50),
    company: body.company.slice(0, 80),
    totalScore: body.totalScore,
    totalTime: body.totalTime ?? 0,
    totalWrongAttempts: body.totalWrongAttempts ?? 0,
    totalHintsUsed: body.totalHintsUsed ?? 0,
    ts,
  });

  return { status: 201, jsonBody: { ok: true, timestamp: ts } };
}

app.http("postLeaderboard", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "leaderboard",
  handler: postLeaderboard,
});
