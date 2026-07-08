import { badRequest, notFound, ok } from "@/shared/api/responses";
import { addAuditEvent, db } from "@/server/mock-db";
import { scheduleSchema } from "@/server/schemas";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = db.salesOrders.find((item) => item.id === id);
  if (!order) return notFound("Ordem de Venda não encontrada");

  const result = scheduleSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Dados inválidos para agendamento", result.error);

  const previousState = order.schedule;
  order.schedule = result.data;
  order.updatedAt = new Date().toISOString();

  addAuditEvent({
    action: "SCHEDULE_CHANGED",
    entity: "SalesOrder",
    entityId: order.id,
    previousState,
    nextState: order.schedule
  });

  return ok(order);
}
