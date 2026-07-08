import { badRequest, ok } from "@/shared/api/responses";
import { addAuditEvent, db, makeId, nextSalesOrderCode } from "@/server/mock-db";
import { salesOrderSchema } from "@/server/schemas";
import { ORDER_STATUSES } from "@/shared/status";
import {
  validateItemsExist,
  validateTransportAuthorization,
  validateTransportTypeExists
} from "@/modules/sales-orders/helpers/rules";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const customerId = searchParams.get("customerId");
  const transportTypeId = searchParams.get("transportTypeId");
  const date = searchParams.get("date");

  const statusFilter = ORDER_STATUSES.find((item) => item === status);

  const orders = db.salesOrders.filter((order) => {
    if (statusFilter && order.status !== statusFilter) return false;
    if (customerId && order.customerId !== customerId) return false;
    if (transportTypeId && order.transportTypeId !== transportTypeId) return false;
    if (date && !order.createdAt.startsWith(date) && !order.schedule?.deliveryDate.startsWith(date)) return false;
    return true;
  });

  return ok(orders);
}

export async function POST(request: Request) {
  const result = salesOrderSchema.safeParse(await request.json());
  if (!result.success) return badRequest("Dados inválidos para Ordem de Venda", result.error);

  const customer = db.customers.find((item) => item.id === result.data.customerId);
  if (!customer) return badRequest("Cliente informado não existe");

  if (!validateTransportTypeExists(result.data.transportTypeId, db.transportTypes)) {
    return badRequest("Tipo de transporte informado não existe ou está inativo");
  }

  if (!validateTransportAuthorization(customer, result.data.transportTypeId)) {
    return badRequest("Tipo de transporte não autorizado para o cliente selecionado");
  }

  if (!validateItemsExist(result.data.items, db.items)) {
    return badRequest("Todos os itens da OV devem existir previamente no cadastro");
  }

  const timestamp = new Date().toISOString();
  const salesOrder = {
    id: makeId("so"),
    code: nextSalesOrderCode(),
    ...result.data,
    status: "CRIADA" as const,
    createdAt: timestamp,
    updatedAt: timestamp
  };

  db.salesOrders.unshift(salesOrder);
  addAuditEvent({
    action: "SALES_ORDER_CREATED",
    entity: "SalesOrder",
    entityId: salesOrder.id,
    nextState: salesOrder
  });

  return ok(salesOrder, 201);
}
