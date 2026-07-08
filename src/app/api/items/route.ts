import { badRequest, ok } from "@/shared/api/responses";
import { itemSchema } from "@/server/schemas";
import { db, makeId } from "@/server/mock-db";

export async function GET() {
  return ok(db.items);
}

export async function POST(request: Request) {
  const result = itemSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Dados inválidos para item", result.error);

  if (db.items.some((item) => item.sku === result.data.sku)) {
    return badRequest("SKU já cadastrado");
  }

  const item = { id: makeId("it"), ...result.data };
  db.items.unshift(item);
  return ok(item, 201);
}
