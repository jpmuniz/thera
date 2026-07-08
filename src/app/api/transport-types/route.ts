import { badRequest, ok } from "@/shared/api/responses";
import { transportTypeSchema } from "@/server/schemas";
import { db, makeId } from "@/server/mock-db";

export async function GET() {
  return ok(db.transportTypes);
}

export async function POST(request: Request) {
  const result = transportTypeSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Dados inválidos para tipo de transporte", result.error);

  const transportType = { id: makeId("tr"), ...result.data };
  db.transportTypes.unshift(transportType);
  return ok(transportType, 201);
}
