import { badRequest, notFound, ok } from "@/shared/api/responses";
import { addAuditEvent, db } from "@/server/mock-db";
import { statusSchema } from "@/server/schemas";
import { canTransitionStatus } from "@/modules/sales-orders/helpers/rules";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = db.salesOrders.find((item) => item.id === id);
  if (!order) return notFound("Ordem de Venda não encontrada");

  const result = statusSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Status inválido", result.error);

  if (!canTransitionStatus(order.status, result.data.status)) {
    return badRequest(`Transição inválida: ${order.status} para ${result.data.status}`);
  }

  const previousState = { status: order.status };
  order.status = result.data.status;
  order.updatedAt = new Date().toISOString();

  addAuditEvent({
    action: "STATUS_CHANGED",
    entity: "SalesOrder",
    entityId: order.id,
    previousState,
    nextState: { status: order.status }
  });

  return ok(order);
}
