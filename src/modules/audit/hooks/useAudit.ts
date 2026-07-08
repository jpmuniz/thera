import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/modules/audit/api/auditApi";

export function useAudit() {
  return useQuery({ queryKey: ["audit"], queryFn: auditApi.list });
}
