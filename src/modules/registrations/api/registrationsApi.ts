import { http } from "@/shared/api/http";
import type { Customer, Item, TransportType } from "@/shared/types";

export const registrationsApi = {
  customers: () => http<Customer[]>("/api/customers"),
  createCustomer: (payload: Omit<Customer, "id">) =>
    http<Customer>("/api/customers", { method: "POST", body: JSON.stringify(payload) }),
  updateCustomer: (id: string, payload: Omit<Customer, "id">) =>
    http<Customer>(`/api/customers/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  transportTypes: () => http<TransportType[]>("/api/transport-types"),
  createTransportType: (payload: Omit<TransportType, "id">) =>
    http<TransportType>("/api/transport-types", { method: "POST", body: JSON.stringify(payload) }),
  updateTransportType: (id: string, payload: Omit<TransportType, "id">) =>
    http<TransportType>(`/api/transport-types/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  items: () => http<Item[]>("/api/items"),
  createItem: (payload: Omit<Item, "id">) =>
    http<Item>("/api/items", { method: "POST", body: JSON.stringify(payload) })
};
