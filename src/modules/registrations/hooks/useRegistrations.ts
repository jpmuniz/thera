import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { registrationsApi } from "@/modules/registrations/api/registrationsApi";

export function useRegistrations() {
  const queryClient = useQueryClient();

  const customers = useQuery({
    queryKey: ["customers"],
    queryFn: registrationsApi.customers,
  });

  const transportTypes = useQuery({
    queryKey: ["transport-types"],
    queryFn: registrationsApi.transportTypes,
  });

  const items = useQuery({
    queryKey: ["items"],
    queryFn: registrationsApi.items,
  });

  const createCustomer = useMutation({
    mutationFn: registrationsApi.createCustomer,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["customers"] });
      void queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
  });

  const createTransportType = useMutation({
    mutationFn: registrationsApi.createTransportType,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transport-types"] });
      void queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
  });

  const createItem = useMutation({
    mutationFn: registrationsApi.createItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["items"] });
      void queryClient.invalidateQueries({ queryKey: ["sales-orders"] });
    },
  });

  return {
    customers,
    transportTypes,
    items,
    createCustomer,
    createTransportType,
    createItem,
  };
}