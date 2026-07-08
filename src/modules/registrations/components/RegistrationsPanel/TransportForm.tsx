import { useForm } from "react-hook-form";
import { Alert } from "@/shared/components/Alert";
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";
import { List } from "./List";
import { SubmitButton } from "./SubmitButton";

type TransportFormData = {
  name: string;
  active: boolean;
};

export function TransportForm() {
  const { transportTypes, createTransportType } = useRegistrations();

  const form = useForm<TransportFormData>({
    defaultValues: {
      name: "",
      active: true
    }
  });

  async function onSubmit(data: TransportFormData) {
    await createTransportType.mutateAsync(data);
    form.reset({
      name: "",
      active: true
    });
  }

  return (
    <div aria-labelledby="tab-transports" className="grid gap-4 md:grid-cols-[0.8fr_1fr]" id="panel-transports" role="tabpanel">
      <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Nome do transporte</span>
          <input
            aria-describedby={createTransportType.error ? "transport-form-error" : undefined}
            className="rounded-md border border-line px-3 py-2"
            {...form.register("name")}
          />
        </label>

        <label className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm">
          <input type="checkbox" {...form.register("active")} />
          Ativo
        </label>

        {createTransportType.error && <Alert id="transport-form-error">{createTransportType.error.message}</Alert>}

        <SubmitButton disabled={createTransportType.isPending} label="Criar transporte" />
      </form>

      <List
        label="Tipos de transporte cadastrados"
        rows={(transportTypes?.data ?? []).map((transport) => `${transport.name} - ${transport.active ? "ativo" : "inativo"}`)}
      />
    </div>
  );
}
