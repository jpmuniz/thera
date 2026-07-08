import type { OrderStatus } from "@/shared/types";

export const ORDER_STATUSES: OrderStatus[] = [
  "CRIADA",
  "PLANEJADA",
  "AGENDADA",
  "EM_TRANSPORTE",
  "ENTREGUE"
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  CRIADA: "Criada",
  PLANEJADA: "Planejada",
  AGENDADA: "Agendada",
  EM_TRANSPORTE: "Em transporte",
  ENTREGUE: "Entregue"
};

export function getNextStatus(status: OrderStatus): OrderStatus | null {
  const index = ORDER_STATUSES.indexOf(status);
  return ORDER_STATUSES[index + 1] ?? null;
}

export function isValidStatusTransition(from: OrderStatus, to: OrderStatus) {
  return getNextStatus(from) === to;
}
