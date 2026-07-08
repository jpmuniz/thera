import { notFound, ok } from "@/shared/api/responses";
import { db } from "@/server/mock-db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = db.salesOrders.find((item) => item.id === id);
  if (!order) return notFound("Ordem de Venda não encontrada");

  return ok(order);
}
