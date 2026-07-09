import { AuditPanel } from "@/modules/audit/components/AuditPanel";
import { RegistrationsPanel } from "@/modules/registrations/components/RegistrationsPanel";
import { SchedulingCenter } from "@/modules/scheduling/components/SchedulingCenter";
import { SalesOrdersWorkspace } from "@/modules/sales-orders/components/SalesOrdersWorkspace";
import { MonitoringDashboard } from "@/modules/monitoring/components/MonitoringDashboard";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Ir para o conteúdo principal
      </a>
      <main id="conteudo-principal" className="min-h-screen" tabIndex={-1}>
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">OVGS</p>
            <h1 className="text-3xl font-semibold text-ink">Gestão de Ordens de Venda</h1>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-5 px-5 py-5">
        <MonitoringDashboard />
        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
          <SalesOrdersWorkspace />
          <SchedulingCenter />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <RegistrationsPanel />
          <AuditPanel />
        </div>
      </div>
      </main>
    </>
  );
}
