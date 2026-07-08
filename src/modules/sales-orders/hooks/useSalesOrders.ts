import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { salesOrdersApi } from "@/modules/sales-orders/api/salesOrdersApi";
import type { SalesOrderFilters } from "@/shared/types";

export function useSalesOrders(filters?: SalesOrderFilters) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    void queryClient.invalidateQueries({ queryKey: ["audit"] });
  };

  return {
    salesOrders: useQuery({
      queryKey: ["sales-orders", filters],
      queryFn: () => salesOrdersApi.list(filters)
    }),
    createSalesOrder: useMutation({ mutationFn: salesOrdersApi.create, onSuccess: invalidate }),
    updateStatus: useMutation({ mutationFn: salesOrdersApi.updateStatus, onSuccess: invalidate }),
    updateSchedule: useMutation({ mutationFn: salesOrdersApi.updateSchedule, onSuccess: invalidate }),
    updateTransport: useMutation({ mutationFn: salesOrdersApi.updateTransport, onSuccess: invalidate })
  };
}
