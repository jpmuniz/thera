import { badRequest, notFound, ok } from "@/shared/api/responses";
import { addAuditEvent, db } from "@/server/mock-db";
import { transportChangeSchema } from "@/server/schemas";
import { validateTransportAuthorization, validateTransportTypeExists } from "@/modules/sales-orders/helpers/rules";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = db.salesOrders.find((item) => item.id === id);
  if (!order) return notFound("Ordem de Venda não encontrada");

  const result = transportChangeSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Transporte inválido", result.error);

  const customer = db.customers.find((item) => item.id === order.customerId);
  if (!customer) return badRequest("Cliente da OV não encontrado");

  if (!validateTransportTypeExists(result.data.transportTypeId, db.transportTypes)) {
    return badRequest("Tipo de transporte informado não existe ou está inativo");
  }

  if (!validateTransportAuthorization(customer, result.data.transportTypeId)) {
    return badRequest("Tipo de transporte não autorizado para este cliente");
  }

  const previousState = { transportTypeId: order.transportTypeId };
  order.transportTypeId = result.data.transportTypeId;
  order.updatedAt = new Date().toISOString();

  addAuditEvent({
    action: "TRANSPORT_CHANGED",
    entity: "SalesOrder",
    entityId: order.id,
    previousState,
    nextState: { transportTypeId: order.transportTypeId }
  });

  return ok(order);
}
