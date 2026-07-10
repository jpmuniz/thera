import { Check } from "lucide-react";
import type { Customer, Item, TransportType, SalesOrder } from "@/shared/types";
import { CreateSalesOrderPayload } from "../api/salesOrdersApi";  
import { UseMutationResult } from "@tanstack/react-query";
import { Alert } from "@/shared/components/Alert";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../helpers/salesOrderForm.schema"

type SalesOrderData = {
  form: UseFormReturn<FormData>;
  customers: Customer[];
  transportTypes: TransportType[];
  items: Item[];
  createSalesOrder: UseMutationResult<
  SalesOrder,
  Error,
  CreateSalesOrderPayload,
  unknown
>;
  lastEvent: string ;
  onSubmit: (data: FormData) => Promise<void>;
}

export function SalesOrderForm ({form, customers, items, createSalesOrder, lastEvent, transportTypes,onSubmit}: SalesOrderData){
    return (
        <form className="grid gap-3 max-h-[400px] rounded-md border border-line bg-surface p-3" onSubmit={form.handleSubmit(onSubmit)}>
          <h3 className="text-sm font-semibold text-ink">Nova Ordem de Venda</h3>
          <label className="grid gap-1 text-sm font-medium text-ink">
            <span>Cliente</span>
          <select className="rounded-md border border-line px-3 py-2" {...form.register("customerId")}>
            <option value="">Cliente</option>
            {(customers).map((customer) => (
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
            {(transportTypes).map((transport) => (
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
                {(items).map((item) => (
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
                {...form.register("quantity", {
                  valueAsNumber: true,
                })}
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
            <Check size={16} /> Criar Ordem de venda
          </button>
          {lastEvent && (
            <Alert live="polite" variant="success">
              {lastEvent}
            </Alert>
          )}
        </form>        
    )
}