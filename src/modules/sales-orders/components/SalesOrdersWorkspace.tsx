"use client";

import { ArrowRight, Check, Truck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/shared/components/Alert";
import { Panel } from "@/shared/components/Panel";
import { SalesOrderForm } from "./SalesOrderForm";
import { SalesOrdersTable } from "./SalesOrdersTable";
import { SalesOrderDetails } from "./SalesOrderDetails"
import { getNextStatus, STATUS_LABELS } from "@/shared/status";
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
        <SalesOrderForm 
          form={form}
          customers={customers.data ?? []}
          items={items.data ?? []}
          createSalesOrder={createSalesOrder}
          lastEvent={lastEvent ?? ""}
          onSubmit={onSubmit}
          transportTypes={transportTypes.data ?? []}
        />

        <div className="grid gap-3">
        <SalesOrdersTable
            orders={orders}
            customers={customers.data ?? []}
            transportTypes={transportTypes.data ?? []}
            isUpdating={updateStatus.isPending}
            onSelect={(id: string)=>dispatch(salesOrderSelected(id))}
            onAdvance={advance}
          />
          
          {selectedOrder && (
            <SalesOrderDetails
              order={selectedOrder}
              items={items.data ?? []}
              transportTypes={transportTypes.data ?? []}
              updateTransport={updateTransport}
              updateStatus={updateStatus}
              onChangeTransport={changeTransport}
            /> 
          )}
        </div>
      </div>
    </Panel>
  );
}
