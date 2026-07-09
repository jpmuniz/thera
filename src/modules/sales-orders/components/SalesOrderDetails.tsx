import { useMemo } from "react";
import { Truck } from "lucide-react";

import { Alert } from "@/shared/components/Alert";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { formatDateTime } from "@/shared/utils/format";

import type {
  Item,
  SalesOrder,
  TransportType,
} from "@/shared/types";

type SalesOrderDetailsData = {
  order: SalesOrder;
  items: Item[];
  transportTypes: TransportType[];
  updateTransport: {
    error?: {
      message?: string;
    } | null;
  };
  updateStatus: {
    error?: {
      message?: string;
    } | null;
  };
  onChangeTransport: (
    order: SalesOrder,
    transportTypeId: string
  ) => Promise<void>;
};

export function SalesOrderDetails({
  order,
  items,
  transportTypes,
  updateTransport,
  updateStatus,
  onChangeTransport,
}: SalesOrderDetailsData) {
  const itemsMap = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items]
  );

  const errorMessage =
    updateTransport.error?.message ?? updateStatus.error?.message;

  return (
    <div className="rounded-md border border-line bg-surface p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold">{order.code}</h3>

        <StatusBadge status={order.status} />
      </div>

      <p className="mt-2 text-sm text-muted">
        Criada em {formatDateTime(order.createdAt)}
      </p>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {order.items.map((line) => {
          const item = itemsMap.get(line.itemId);

          return (
            <div
              key={line.itemId}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm"
            >
              <strong>{item?.sku}</strong> - {item?.description} | Qtd.{" "}
              {line.quantity}
            </div>
          );
        })}
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm">
        <Truck aria-hidden="true" size={16} />

        <span className="sr-only">
          Alterar tipo de transporte da {order.code}
        </span>

        <select
          aria-label={`Alterar tipo de transporte da ${order.code}`}
          className="flex-1 rounded-md border border-line px-3 py-2"
          value={order.transportTypeId}
          onChange={(event) =>
            onChangeTransport(order, event.target.value)
          }
        >
          {transportTypes.map((transport) => (
            <option
              key={transport.id}
              value={transport.id}
            >
              {transport.name}
            </option>
          ))}
        </select>
      </label>

      {errorMessage && <Alert>{errorMessage}</Alert>}
    </div>
  );
}