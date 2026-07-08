import { badRequest, notFound, ok } from "@/shared/api/responses";
import { transportTypeSchema } from "@/server/schemas";
import { db } from "@/server/mock-db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = db.transportTypes.findIndex((transport) => transport.id === id);
  if (index === -1) return notFound("Tipo de transporte não encontrado");

  const result = transportTypeSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Dados inválidos para tipo de transporte", result.error);

  db.transportTypes[index] = { id, ...result.data };
  return ok(db.transportTypes[index]);
}
