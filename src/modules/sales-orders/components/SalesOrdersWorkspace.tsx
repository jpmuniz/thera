"use client";

import { ArrowRight, Check, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/shared/components/Alert";
import { Panel } from "@/shared/components/Panel";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { getNextStatus, STATUS_LABELS } from "@/shared/status";
import { formatDateTime } from "@/shared/utils/format";
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";
import { useSalesOrders } from "@/modules/sales-orders/hooks/useSalesOrders";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { domainEventRequested, salesOrderSelected } from "@/store/uiSlice";
import type { SalesOrder } from "@/shared/types";

const schema = z.object({
  customerId: z.string().min(1, "Selecione o cliente"),
  transportTypeId: z.string().min(1, "Selecione o transporte"),
  itemId: z.string().min(1, "Selecione um item"),
  quantity: z.coerce.number().positive("Quantidade deve ser maior que zero")
});

type FormData = z.infer<typeof schema>;

export function SalesOrdersWorkspace() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.monitoring);
  const selectedId = useAppSelector((state) => state.ui.selectedSalesOrderId);
  const lastEvent = useAppSelector((state) => state.ui.lastEvent);
  const { customers, transportTypes, items } = useRegistrations();
  const { salesOrders, createSalesOrder, updateStatus, updateTransport } = useSalesOrders(filters);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customerId: "", transportTypeId: "", itemId: "", quantity: 1 }
  });

  const orders = salesOrders.data ?? [];
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? orders[0];

  async function onSubmit(data: FormData) {
    const order = await createSalesOrder.mutateAsync({
      customerId: data.customerId,
      transportTypeId: data.transportTypeId,
      items: [{ itemId: data.itemId, quantity: Number(data.quantity) }]
    });
    dispatch(salesOrderSelected(order.id));
    dispatch(domainEventRequested(`OV ${order.code} criada`));
    form.reset({ customerId: "", transportTypeId: "", itemId: "", quantity: 1 });
  }

  async function advance(order: SalesOrder) {
    const next = getNextStatus(order.status);
    if (!next) return;
    await updateStatus.mutateAsync({ id: order.id, status: next });
    dispatch(domainEventRequested(`OV ${order.code}: ${STATUS_LABELS[next]}`));
  }

  async function changeTransport(order: SalesOrder, transportTypeId: string) {
    await updateTransport.mutateAsync({ id: order.id, transportTypeId });
    dispatch(domainEventRequested(`Transporte da ${order.code} alterado`));
  }

  return (
    <Panel title="Gestão de Ordens de Venda">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <form className="grid gap-3 rounded-md border border-line bg-surface p-3" onSubmit={form.handleSubmit(onSubmit)}>
          <h3 className="text-sm font-semibold text-ink">Nova Ordem de Venda</h3>
          <label className="grid gap-1 text-sm font-medium text-ink">
            <span>Cliente</span>
          <select className="rounded-md border border-line px-3 py-2" {...form.register("customerId")}>
            <option value="">Cliente</option>
            {(customers.data ?? []).map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-ink">
            <span>Tipo de transporte</span>
          <select className="rounded-md border border-line px-3 py-2" {...form.register("transportTypeId")}>
            <option value="">Tipo de transporte</option>
            {(transportTypes.data ?? []).map((transport) => (
              <option key={transport.id} value={transport.id}>
                {transport.name}
              </option>
            ))}
          </select>
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_8rem]">
            <label className="grid min-w-0 gap-1 text-sm font-medium text-ink">
              <span>Item</span>
              <select
                className="w-full min-w-0 rounded-md border border-line px-3 py-2"
                {...form.register("itemId")}
              >
                <option value="">Item</option>
                {(items.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sku} - {item.description}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid min-w-0 gap-1 text-sm font-medium text-ink">
              <span>Qtd.</span>
              <input
                aria-describedby="sales-order-form-error"
                className="w-full min-w-0 rounded-md border border-line px-3 py-2"
                type="number"
                min="1"
                {...form.register("quantity")}
              />
            </label>
          </div>
          {(createSalesOrder.error?.message ?? Object.values(form.formState.errors)[0]?.message) && (
            <Alert id="sales-order-form-error">
              {createSalesOrder.error?.message ?? Object.values(form.formState.errors)[0]?.message}
            </Alert>
          )}
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 font-semibold text-white disabled:opacity-60"
            disabled={createSalesOrder.isPending}
            type="submit"
          >
            <Check size={16} /> Criar OV
          </button>
          {lastEvent && (
            <Alert live="polite" variant="success">
              {lastEvent}
            </Alert>
          )}
        </form>

        <div className="grid gap-3">
          <div className="max-h-[360px] overflow-auto rounded-md border border-line">
            <table className="w-full min-w-[620px] text-left text-sm">
              <caption className="sr-only">Ordens de Venda cadastradas e ações de avanço de status</caption>
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
                      <button className="text-brand underline-offset-2 hover:underline" onClick={() => dispatch(salesOrderSelected(order.id))}>
                        {order.code}
                      </button>
                    </td>
                    <td className="px-3 py-2">{customers.data?.find((customer) => customer.id === order.customerId)?.name}</td>
                    <td className="px-3 py-2">{transportTypes.data?.find((transport) => transport.id === order.transportTypeId)?.name}</td>
                    <td className="px-3 py-2"><StatusBadge status={order.status} /></td>
                    <td className="px-3 py-2">
                      <button
                        aria-label={`Avançar status da ${order.code}`}
                        className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 disabled:opacity-50"
                        disabled={!getNextStatus(order.status) || updateStatus.isPending}
                        onClick={() => advance(order)}
                      >
                        <ArrowRight size={14} /> Avançar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedOrder && (
            <div className="rounded-md border border-line bg-surface p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{selectedOrder.code}</h3>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <p className="mt-2 text-sm text-muted">Criada em {formatDateTime(selectedOrder.createdAt)}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {selectedOrder.items.map((line) => {
                  const item = items.data?.find((entry) => entry.id === line.itemId);
                  return (
                    <div key={line.itemId} className="rounded-md border border-line bg-white px-3 py-2 text-sm">
                      <strong>{item?.sku}</strong> - {item?.description} | Qtd. {line.quantity}
                    </div>
                  );
                })}
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm">
                <Truck aria-hidden="true" size={16} />
                <span className="sr-only">Alterar tipo de transporte da {selectedOrder.code}</span>
                <select
                  aria-label={`Alterar tipo de transporte da ${selectedOrder.code}`}
                  className="flex-1 rounded-md border border-line px-3 py-2"
                  value={selectedOrder.transportTypeId}
                  onChange={(event) => changeTransport(selectedOrder, event.target.value)}
                >
                  {(transportTypes.data ?? []).map((transport) => (
                    <option key={transport.id} value={transport.id}>
                      {transport.name}
                    </option>
                  ))}
                </select>
              </label>
              {(updateTransport.error?.message ?? updateStatus.error?.message) && (
                <Alert>{updateTransport.error?.message ?? updateStatus.error?.message}</Alert>
              )}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
