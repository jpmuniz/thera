import { http } from "@/shared/api/http";
import type { AuditEvent } from "@/shared/types";

export const auditApi = {
  list: () => http<AuditEvent[]>("/api/audit")
};
