import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import type { Customer, TransportType, SalesOrder } from "@/shared/types";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { getNextStatus } from "@/shared/status"; 

type SalesOrdersData = {
    orders: SalesOrder[];
    customers: Customer[];
    transportTypes: TransportType[];
    isUpdating: boolean;
    onSelect: (id: string) => void;
    onAdvance: (order: SalesOrder) => Promise<void>;
}

export function SalesOrdersTable({
  orders,
  customers,
  transportTypes,
  isUpdating,
  onSelect,
  onAdvance,
}: SalesOrdersData) {
  const customersMap = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers]
  );

  const transportTypesMap = useMemo(
    () => new Map(transportTypes.map((transport) => [transport.id, transport])),
    [transportTypes]
  );

  return (
    <div className="max-h-[360px] overflow-auto rounded-md border border-line">
      <table className="w-full min-w-[620px] text-left text-sm">
        <caption className="sr-only">
          Ordens de Venda cadastradas e ações de avanço de status
        </caption>

        <thead className="sticky top-0 bg-surface text-xs uppercase text-muted">
          <tr>
            <th className="px-3 py-2">OV</th>
            <th className="px-3 py-2">Cliente</th>
            <th className="px-3 py-2">Transporte</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Ação</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-line">
              <td className="px-3 py-2 font-semibold">
                <button
                  type="button"
                  className="text-brand underline-offset-2 hover:underline"
                  onClick={() => onSelect(order.id)}
                >
                  {order.code}
                </button>
              </td>

              <td className="px-3 py-2">
                {customersMap.get(order.customerId)?.name}
              </td>

              <td className="px-3 py-2">
                {transportTypesMap.get(order.transportTypeId)?.name}
              </td>

              <td className="px-3 py-2">
                <StatusBadge status={order.status} />
              </td>

              <td className="px-3 py-2">
                <button
                  type="button"
                  aria-label={`Avançar status da ${order.code}`}
                  className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 disabled:opacity-50"
                  disabled={!getNextStatus(order.status) || isUpdating}
                  onClick={() => onAdvance(order)}
                >
                  <ArrowRight size={14} />
                  Avançar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}