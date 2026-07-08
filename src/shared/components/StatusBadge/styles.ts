import type { OrderStatus } from "@/shared/types";

export const styles: Record<OrderStatus, string> = {
  CRIADA: "border-slate-300 bg-slate-50 text-slate-700",
  PLANEJADA: "border-cyan-300 bg-cyan-50 text-cyan-800",
  AGENDADA: "border-amber-300 bg-amber-50 text-amber-800",
  EM_TRANSPORTE: "border-indigo-300 bg-indigo-50 text-indigo-800",
  ENTREGUE: "border-emerald-300 bg-emerald-50 text-emerald-800"
};
