import type { AuditEvent, Customer, Item, SalesOrder, TransportType } from "@/shared/types";

type Database = {
  customers: Customer[];
  transportTypes: TransportType[];
  items: Item[];
  salesOrders: SalesOrder[];
  auditEvents: AuditEvent[];
};

const now = new Date().toISOString();

const initialDb: Database = {
  customers: [
    {
      id: "cus-1",
      name: "Mercado Sol Nascente",
      document: "12.345.678/0001-90",
      authorizedTransportTypeIds: ["tr-1", "tr-2"]
    },
    {
      id: "cus-2",
      name: "Distribuidora Atlas",
      document: "98.765.432/0001-10",
      authorizedTransportTypeIds: ["tr-2", "tr-3"]
    }
  ],
  transportTypes: [
    { id: "tr-1", name: "Caminhão", active: true },
    { id: "tr-2", name: "Carreta", active: true },
    { id: "tr-3", name: "Bi-truck", active: true }
  ],
  items: [
    { id: "it-1", sku: "SKU-ACU-25", description: "Açúcar cristal 25kg", unit: "SC" },
    { id: "it-2", sku: "SKU-ARR-05", description: "Arroz tipo 1 5kg", unit: "FD" },
    { id: "it-3", sku: "SKU-OLE-900", description: "Óleo vegetal 900ml", unit: "CX" }
  ],
  salesOrders: [
    {
      id: "so-1",
      code: "OV-0001",
      customerId: "cus-1",
      transportTypeId: "tr-1",
      items: [
        { itemId: "it-1", quantity: 120 },
        { itemId: "it-2", quantity: 80 }
      ],
      status: "PLANEJADA",
      createdAt: now,
      updatedAt: now
    }
  ],
  auditEvents: []
};

const globalForDb = globalThis as unknown as { __ovgsDb?: Database };

export const db = globalForDb.__ovgsDb ?? structuredClone(initialDb);
globalForDb.__ovgsDb = db;

export function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export function addAuditEvent(event: Omit<AuditEvent, "id" | "occurredAt">) {
  db.auditEvents.unshift({
    id: makeId("aud"),
    occurredAt: new Date().toISOString(),
    ...event,
    previousState: event.previousState === undefined ? undefined : structuredClone(event.previousState),
    nextState: structuredClone(event.nextState)
  });
}

export function nextSalesOrderCode() {
  return `OV-${String(db.salesOrders.length + 1).padStart(4, "0")}`;
}
