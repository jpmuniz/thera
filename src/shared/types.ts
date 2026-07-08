export type OrderStatus = "CRIADA" | "PLANEJADA" | "AGENDADA" | "EM_TRANSPORTE" | "ENTREGUE";

export type Customer = {
  id: string;
  name: string;
  document: string;
  authorizedTransportTypeIds: string[];
};

export type TransportType = {
  id: string;
  name: string;
  active: boolean;
};

export type Item = {
  id: string;
  sku: string;
  description: string;
  unit: string;
};

export type SalesOrderItem = {
  itemId: string;
  quantity: number;
};

export type DeliverySchedule = {
  deliveryDate: string;
  windowStart: string;
  windowEnd: string;
  confirmed: boolean;
};

export type SalesOrder = {
  id: string;
  code: string;
  customerId: string;
  transportTypeId: string;
  items: SalesOrderItem[];
  status: OrderStatus;
  schedule?: DeliverySchedule;
  createdAt: string;
  updatedAt: string;
};

export type AuditEvent = {
  id: string;
  occurredAt: string;
  action: "SALES_ORDER_CREATED" | "STATUS_CHANGED" | "SCHEDULE_CHANGED" | "TRANSPORT_CHANGED";
  entity: "SalesOrder";
  entityId: string;
  previousState?: unknown;
  nextState: unknown;
};

export type SalesOrderFilters = {
  status?: OrderStatus | "TODOS";
  customerId?: string;
  transportTypeId?: string;
  date?: string;
};

export type ApiErrorPayload = {
  message: string;
  details?: Record<string, string[]>;
};
