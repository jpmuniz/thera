import { badRequest, ok } from "@/shared/api/responses";
import { customerSchema } from "@/server/schemas";
import { db, makeId } from "@/server/mock-db";

export async function GET() {
  return ok(db.customers);
}

export async function POST(request: Request) {
  const result = customerSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Dados inválidos para cliente", result.error);

  const customer = { id: makeId("cus"), ...result.data };
  db.customers.unshift(customer);
  return ok(customer, 201);
}
