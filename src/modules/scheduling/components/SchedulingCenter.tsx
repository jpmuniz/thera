"use client";

import { CalendarCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "@/shared/components/Alert";
import { Panel } from "@/shared/components/Panel";
import { formatDate } from "@/shared/utils/format";
import { useSalesOrders } from "@/modules/sales-orders/hooks/useSalesOrders";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { salesOrderSelected } from "@/store/uiSlice";

const schema = z.object({
  salesOrderId: z.string().min(1, "Selecione a OV"),
  deliveryDate: z.string().min(10, "Informe a data"),
  windowStart: z.string().min(5, "Informe o início"),
  windowEnd: z.string().min(5, "Informe o fim"),
  confirmed: z.boolean()
});

type FormData = z.infer<typeof schema>;

export function SchedulingCenter() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.monitoring);
  const selectedId = useAppSelector((state) => state.ui.selectedSalesOrderId);
  const { salesOrders, updateSchedule } = useSalesOrders(filters);
  const orders = salesOrders.data ?? [];
  const selectedOrder = orders.find((order) => order.id === selectedId) ?? orders[0];

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      salesOrderId: selectedOrder?.id ?? "",
      deliveryDate: selectedOrder?.schedule?.deliveryDate ?? "",
      windowStart: selectedOrder?.schedule?.windowStart ?? "08:00",
      windowEnd: selectedOrder?.schedule?.windowEnd ?? "12:00",
      confirmed: selectedOrder?.schedule?.confirmed ?? false
    }
  });

  async function onSubmit(data: FormData) {
    try {
      await updateSchedule.mutateAsync({
        id: data.salesOrderId,
        schedule: {
          deliveryDate: data.deliveryDate,
          windowStart: data.windowStart,
          windowEnd: data.windowEnd,
          confirmed: data.confirmed
        }
      });
      dispatch(salesOrderSelected(data.salesOrderId));
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao atualizar agendamento:", error);
      }
    }
  }

  return (
    <Panel title="Central de Agendamento">
      <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Ordem de Venda</span>
        <select className="rounded-md border border-line px-3 py-2" {...form.register("salesOrderId")}>
          <option value="">Selecione uma OV</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.code}
            </option>
          ))}
        </select>
        </label>
        <div className="grid gap-2 md:grid-cols-3">
          <label className="grid gap-1 text-sm font-medium text-ink">
            <span>Data de entrega</span>
            <input className="rounded-md border border-line px-3 py-2" type="date" {...form.register("deliveryDate")} />
          </label>
          <label className="grid gap-1 text-sm font-medium text-ink">
            <span>Início da janela</span>
            <input className="rounded-md border border-line px-3 py-2" type="time" {...form.register("windowStart")} />
          </label>
          <label className="grid gap-1 text-sm font-medium text-ink">
            <span>Fim da janela</span>
            <input className="rounded-md border border-line px-3 py-2" type="time" {...form.register("windowEnd")} />
          </label>
        </div>
        <label className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm">
          <input type="checkbox" {...form.register("confirmed")} /> Confirmar agendamento
        </label>
        {updateSchedule.error && (
          <Alert id="schedule-form-error">{updateSchedule.error.message}</Alert>
        )}
        <button
          className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 font-semibold text-white disabled:opacity-60"
          disabled={updateSchedule.isPending}
          type="submit"
        >
          <CalendarCheck size={16} /> Salvar agenda
        </button>
      </form>
      <div className="mt-4 grid gap-2">
        {orders
          .filter((order) => order.schedule)
          .map((order) => (
            <div key={order.id} className="rounded-md border border-line bg-surface px-3 py-2 text-sm">
              <strong>{order.code}</strong> - {formatDate(order.schedule?.deliveryDate)} das {order.schedule?.windowStart} às{" "}
              {order.schedule?.windowEnd} {order.schedule?.confirmed ? "(confirmado)" : "(pendente)"}
            </div>
          ))}
      </div>
    </Panel>
  );
}
