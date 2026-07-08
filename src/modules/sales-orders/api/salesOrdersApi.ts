import { http } from "@/shared/api/http";
import type { DeliverySchedule, OrderStatus, SalesOrder, SalesOrderFilters, SalesOrderItem } from "@/shared/types";

export type CreateSalesOrderPayload = {
  customerId: string;
  transportTypeId: string;
  items: SalesOrderItem[];
};

function paramsFromFilters(filters?: SalesOrderFilters) {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== "TODOS") params.set("status", filters.status);
  if (filters?.customerId) params.set("customerId", filters.customerId);
  if (filters?.transportTypeId) params.set("transportTypeId", filters.transportTypeId);
  if (filters?.date) params.set("date", filters.date);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export const salesOrdersApi = {
  list: (filters?: SalesOrderFilters) => http<SalesOrder[]>(`/api/sales-orders${paramsFromFilters(filters)}`),
  get: (id: string) => http<SalesOrder>(`/api/sales-orders/${id}`),
  create: (payload: CreateSalesOrderPayload) =>
    http<SalesOrder>("/api/sales-orders", { method: "POST", body: JSON.stringify(payload) }),
  updateStatus: ({ id, status }: { id: string; status: OrderStatus }) =>
    http<SalesOrder>(`/api/sales-orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  updateSchedule: ({ id, schedule }: { id: string; schedule: DeliverySchedule }) =>
    http<SalesOrder>(`/api/sales-orders/${id}/schedule`, { method: "PUT", body: JSON.stringify(schedule) }),
  updateTransport: ({ id, transportTypeId }: { id: string; transportTypeId: string }) =>
    http<SalesOrder>(`/api/sales-orders/${id}/transport`, {
      method: "PATCH",
      body: JSON.stringify({ transportTypeId })
    })
};
