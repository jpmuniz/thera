import { useForm } from "react-hook-form";
import { Alert } from "@/shared/components/Alert";
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";
import { List } from "./List";
import { SubmitButton } from "./SubmitButton";

type CustomerFormData = {
  name: string;
  document: string;
  authorizedTransportTypeIds: string[];
};

export function CustomersForm() {
  const { customers, transportTypes, createCustomer } = useRegistrations();

  const form = useForm<CustomerFormData>({
    defaultValues: {
      name: "",
      document: "",
      authorizedTransportTypeIds: []
    }
  });

  async function onSubmit(data: CustomerFormData) {
    try {
      await createCustomer.mutateAsync(data);
  
      form.reset({
        name: "",
        document: "",
        authorizedTransportTypeIds: []
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Erro ao criar cliente:", error);
      }
    }
  }

  return (
    <div aria-labelledby="tab-customers" className="grid gap-4 md:grid-cols-[0.8fr_1fr]" id="panel-customers" role="tabpanel">
      <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Nome do cliente</span>
          <input
            aria-describedby={createCustomer.error ? "customer-form-error" : undefined}
            className="rounded-md border border-line px-3 py-2"
            {...form.register("name")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Documento</span>
          <input
            aria-describedby={createCustomer.error ? "customer-form-error" : undefined}
            className="rounded-md border border-line px-3 py-2"
            {...form.register("document")}
          />
        </label>

        <fieldset className="grid gap-2 rounded-md border border-line bg-surface p-3 text-sm">
          <legend className="px-1 font-medium text-ink">Transportes autorizados</legend>
          {(transportTypes.data ?? []).map((transport) => (
            <label key={transport.id} className="inline-flex items-center gap-2">
              <input type="checkbox" value={transport.id} {...form.register("authorizedTransportTypeIds")} />
              {transport.name}
            </label>
          ))}
        </fieldset>

        {createCustomer.error && <Alert id="customer-form-error">{createCustomer.error.message}</Alert>}

        <SubmitButton disabled={createCustomer.isPending} label="Criar cliente" />
      </form>

      <List label="Clientes cadastrados" rows={(customers.data ?? []).map((customer) => `${customer.name} - ${customer.document}`)} />
    </div>
  );
}
