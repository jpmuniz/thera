import { ok } from "@/shared/api/responses";
import { db } from "@/server/mock-db";

export async function GET() {
  return ok(db.auditEvents);
}
