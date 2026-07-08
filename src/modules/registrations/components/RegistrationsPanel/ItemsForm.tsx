import { useForm } from "react-hook-form";
import { Alert } from "@/shared/components/Alert";
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";
import { List } from "./List";
import { SubmitButton } from "./SubmitButton";

type ItemFormData = {
  sku: string;
  description: string;
  unit: string;
};

export function ItemsForm() {
  const { items, createItem } = useRegistrations();

  const form = useForm<ItemFormData>({
    defaultValues: {
      sku: "",
      description: "",
      unit: ""
    }
  });

  async function onSubmit(data: ItemFormData) {
    await createItem.mutateAsync(data);
    form.reset({
      sku: "",
      description: "",
      unit: ""
    });
  }

  return (
    <div aria-labelledby="tab-items" className="grid gap-4 md:grid-cols-[0.8fr_1fr]" id="panel-items" role="tabpanel">
      <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>SKU</span>
          <input
            aria-describedby={createItem.error ? "item-form-error" : undefined}
            className="rounded-md border border-line px-3 py-2"
            {...form.register("sku")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Descrição</span>
          <input
            aria-describedby={createItem.error ? "item-form-error" : undefined}
            className="rounded-md border border-line px-3 py-2"
            {...form.register("description")}
          />
        </label>

        <label className="grid gap-1 text-sm font-medium text-ink">
          <span>Unidade</span>
          <input
            aria-describedby={createItem.error ? "item-form-error" : undefined}
            className="rounded-md border border-line px-3 py-2"
            {...form.register("unit")}
          />
        </label>

        {createItem.error && <Alert id="item-form-error">{createItem.error.message}</Alert>}

        <SubmitButton disabled={createItem.isPending} label="Criar item" />
      </form>

      <List label="Itens cadastrados" rows={(items.data ?? []).map((item) => `${item.sku} - ${item.description} (${item.unit})`)} />
    </div>
  );
}
