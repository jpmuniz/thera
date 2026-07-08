"use client";

import { RotateCcw } from "lucide-react";
import { Panel } from "@/shared/components/Panel";
import { ORDER_STATUSES, STATUS_LABELS } from "@/shared/status";
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";
import { useSalesOrders } from "@/modules/sales-orders/hooks/useSalesOrders";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { filtersChanged, filtersReset } from "@/store/monitoringSlice";

export function MonitoringDashboard() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.monitoring);
  const { customers, transportTypes } = useRegistrations();
  const { salesOrders } = useSalesOrders(filters);

  const orders = salesOrders.data ?? [];
  const delivered = orders.filter((order) => order.status === "ENTREGUE").length;
  const scheduled = orders.filter((order) => order.status === "AGENDADA").length;

  return (
    <Panel
      title="Monitoramento operacional"
      action={
        <button
          aria-label="Limpar filtros do monitoramento operacional"
          className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium"
          onClick={() => dispatch(filtersReset())}
          type="button"
        >
          <RotateCcw size={16} /> Limpar
        </button>
      }
    >
      <div className="grid gap-3 md:grid-cols-4">
        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Status</span>
        <select
          className="rounded-md border border-line px-3 py-2"
          value={filters.status}
          onChange={(event) => dispatch(filtersChanged({ ...filters, status: event.target.value as typeof filters.status }))}
        >
          <option value="TODOS">Todos os status</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Cliente</span>
        <select
          className="rounded-md border border-line px-3 py-2"
          value={filters.customerId}
          onChange={(event) => dispatch(filtersChanged({ ...filters, customerId: event.target.value }))}
        >
          <option value="">Todos os clientes</option>
          {(customers.data ?? []).map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Tipo de transporte</span>
        <select
          className="rounded-md border border-line px-3 py-2"
          value={filters.transportTypeId}
          onChange={(event) => dispatch(filtersChanged({ ...filters, transportTypeId: event.target.value }))}
        >
          <option value="">Todos os transportes</option>
          {(transportTypes.data ?? []).map((transport) => (
            <option key={transport.id} value={transport.id}>
              {transport.name}
            </option>
          ))}
        </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Data</span>
        <input
          className="rounded-md border border-line px-3 py-2"
          type="date"
          value={filters.date}
          onChange={(event) => dispatch(filtersChanged({ ...filters, date: event.target.value }))}
        />
        </label>
      </div>
      <div aria-label="Indicadores operacionais filtrados" className="mt-4 grid gap-3 md:grid-cols-3">
        <Kpi label="OVs filtradas" value={orders.length} />
        <Kpi label="Agendadas" value={scheduled} />
        <Kpi label="Entregues" value={delivered} />
      </div>
    </Panel>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-surface px-4 py-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
