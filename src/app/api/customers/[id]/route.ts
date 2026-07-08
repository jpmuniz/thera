import { badRequest, notFound, ok } from "@/shared/api/responses";
import { customerSchema } from "@/server/schemas";
import { db } from "@/server/mock-db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = db.customers.findIndex((customer) => customer.id === id);
  if (index === -1) return notFound("Cliente não encontrado");

  const result = customerSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Dados inválidos para cliente", result.error);

  db.customers[index] = { id, ...result.data };
  return ok(db.customers[index]);
}
