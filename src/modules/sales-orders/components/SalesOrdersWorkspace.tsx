"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Panel } from "@/shared/components/Panel";
import { SalesOrderForm } from "./SalesOrderForm";
import { SalesOrdersTable } from "./SalesOrdersTable";
import { SalesOrderDetails } from "./SalesOrderDetails"
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";
import { useSalesOrdersActions } from "@/modules/sales-orders/hooks/useSalesOrdersActions";
import { useSalesOrders } from "@/modules/sales-orders/hooks/useSalesOrders";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { salesOrderSelected, domainEventRequested } from "@/store/uiSlice";
import { FormData, schema } from "../helpers/salesOrderForm.schema"
import type { SalesOrder } from "@/shared/types";

export function SalesOrdersWorkspace() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.monitoring);
  const selectedId = useAppSelector((state) => state.ui.selectedSalesOrderId);
  const lastEvent = useAppSelector((state) => state.ui.lastEvent);
  const { customers, transportTypes, items } = useRegistrations();

  const {
    salesOrders,
  } = useSalesOrders(filters);
  
  const {
    createOrder,
    advanceOrder,
    changeOrderTransport,
    createSalesOrder,
    updateStatus,
    updateTransport,
  } = useSalesOrdersActions(filters);
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customerId: "", transportTypeId: "", itemId: "", quantity: 1 }
  });

  const orders = salesOrders.data ?? [];
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? orders[0];
  const HAS_NO_ORDERS = !!orders.length ;

  async function handleCreateOrder(data: FormData) {
    try {
      await createOrder(data);
      form.reset({
        customerId: "",
        transportTypeId: "",
        itemId: "",
        quantity: 1,
      });
      dispatch(domainEventRequested(""));
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao criar ordem de venda", error);
      }
    }
  }

  async function handleAdvanceOrder(order: SalesOrder) {
    
    try {
      await advanceOrder(order);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao avançar status da OV", error);
      }
    }
  }

  async function handleChangeOrderTransport(
    order: SalesOrder,
    transportTypeId: string
  ) {
    try {
      await changeOrderTransport(order, transportTypeId);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Erro ao alterar transporte da OV",
          error
        );
      }
    }
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
          onSubmit={handleCreateOrder}
          transportTypes={transportTypes.data ?? []}
        />
        <div className="grid gap-3">
          {HAS_NO_ORDERS ? (
            <>
              <SalesOrdersTable
                orders={orders}
                customers={customers.data ?? []}
                transportTypes={transportTypes.data ?? []}
                isUpdating={updateStatus.isPending}
                onSelect={(id: string)=>dispatch(salesOrderSelected(id))}
                onAdvance={handleAdvanceOrder}
              />
              {selectedOrder && (
                <SalesOrderDetails
                  order={selectedOrder}
                  items={items.data ?? []}
                  transportTypes={transportTypes.data ?? []}
                  updateTransport={updateTransport}
                  updateStatus={updateStatus}
                  onChangeTransport={handleChangeOrderTransport}
                /> 
              )}            
            </>
          ) : (
              <p className="px-3 py-4 text-sm text-muted">Nenhuma ordem de venda </p>
          )}
        </div>
      </div>
    </Panel>
  );
}
