"use client";

import { Panel } from "@/shared/components/Panel";
import { formatDateTime } from "@/shared/utils/format";
import { useAudit } from "@/modules/audit/hooks/useAudit";

const actionLabel = {
  SALES_ORDER_CREATED: "Criação de OV",
  STATUS_CHANGED: "Alteração de status",
  SCHEDULE_CHANGED: "Alteração de agendamento",
  TRANSPORT_CHANGED: "Alteração de transporte"
};

export function AuditPanel() {
  const audit = useAudit();

  return (
    <Panel title="Auditoria">
      <div aria-live="polite" className="max-h-[390px] overflow-auto rounded-md border border-line">
        {(audit.data ?? []).length === 0 && <p className="px-3 py-4 text-sm text-muted">Nenhum evento registrado nesta sessão.</p>}
        {(audit.data ?? []).map((event) => (
          <article key={event.id} className="border-b border-line px-3 py-3 text-sm last:border-b-0">
            <div className="flex items-center justify-between gap-2">
              <strong>{actionLabel[event.action]}</strong>
              <span className="text-xs text-muted">{formatDateTime(event.occurredAt)}</span>
            </div>
            <p className="mt-1 text-muted">
              {event.entity} #{event.entityId}
            </p>
            <pre className="mt-2 max-h-24 overflow-auto rounded bg-surface p-2 text-xs">
              {JSON.stringify({ before: event.previousState ?? null, after: event.nextState }, null, 2)}
            </pre>
          </article>
        ))}
      </div>
    </Panel>
  );
}
