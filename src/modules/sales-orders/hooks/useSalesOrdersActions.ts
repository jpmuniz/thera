import { useAppDispatch } from "@/store/hooks";
import {
  domainEventRequested,
  salesOrderSelected,
} from "@/store/uiSlice";

import { getNextStatus, STATUS_LABELS } from "@/shared/status";
import type { SalesOrder, SalesOrderFilters } from "@/shared/types";
import type { FormData } from "../helpers/salesOrderForm.schema";
import { useSalesOrders } from "./useSalesOrders";


export function useSalesOrdersActions(filters?: SalesOrderFilters) {
  const dispatch = useAppDispatch();

  const {
    createSalesOrder,
    updateStatus,
    updateTransport,
  } = useSalesOrders(filters);


  async function createOrder(data: FormData) {
    const order = await createSalesOrder.mutateAsync({
      customerId: data.customerId,
      transportTypeId: data.transportTypeId,
      items: [
        {
          itemId: data.itemId,
          quantity: Number(data.quantity),
        },
      ],
    });

    dispatch(salesOrderSelected(order.id));

    dispatch(
      domainEventRequested(
        `OV ${order.code} criada`
      )
    );

    return order;
  }


  async function advanceOrder(order: SalesOrder) {
    const nextStatus = getNextStatus(order.status);

    if (!nextStatus) return;
    await updateStatus.mutateAsync({
      id: order.id,
      status: nextStatus,
    });


    dispatch(
      domainEventRequested(
        `OV ${order.code}: ${STATUS_LABELS[nextStatus]}`
      )
    );
  }


  async function changeOrderTransport(
    order: SalesOrder,
    transportTypeId: string
  ) {
    await updateTransport.mutateAsync({
      id: order.id,
      transportTypeId,
    });


    dispatch(
      domainEventRequested(
        `Transporte da ${order.code} alterado`
      )
    );
  }


  return {
    createOrder,
    advanceOrder,
    changeOrderTransport,

    createSalesOrder,
    updateStatus,
    updateTransport,
  };
}