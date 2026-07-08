import { clsx } from "clsx";
import { STATUS_LABELS } from "@/shared/status";
import type { OrderStatus } from "@/shared/types";
import { styles } from "./styles";

export function StatusBadge({ status }: { status: OrderStatus }) {
  const label = STATUS_LABELS[status];

  return (
    <span
      aria-label={`Status da Ordem de Venda: ${label}`}
      className={clsx("inline-flex rounded-md border px-2 py-1 text-xs font-semibold", styles[status])}
    >
      {label}
    </span>
  );
}
