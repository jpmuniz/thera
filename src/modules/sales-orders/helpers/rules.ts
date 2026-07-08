import { isValidStatusTransition } from "@/shared/status";
import type { Customer, Item, OrderStatus, SalesOrderItem, TransportType } from "@/shared/types";

export function validateTransportAuthorization(customer: Customer, transportTypeId: string) {
  return customer.authorizedTransportTypeIds.includes(transportTypeId);
}

export function validateItemsExist(items: SalesOrderItem[], catalog: Item[]) {
  const catalogIds = new Set(catalog.map((item) => item.id));
  return items.length > 0 && items.every((item) => catalogIds.has(item.itemId));
}

export function validateTransportTypeExists(transportTypeId: string, transportTypes: TransportType[]) {
  return transportTypes.some((transport) => transport.id === transportTypeId && transport.active);
}

export function canTransitionStatus(current: OrderStatus, next: OrderStatus) {
  return isValidStatusTransition(current, next);
}
