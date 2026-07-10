import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";

import { SalesOrderForm } from "../SalesOrderForm";
import type { FormData } from "../../helpers/salesOrderForm.schema";

function Wrapper(props: Partial<React.ComponentProps<typeof SalesOrderForm>>) {
  const form = useForm<FormData>({
    defaultValues: {
      customerId: "",
      transportTypeId: "",
      itemId: "",
      quantity: 1,
    },
  });

  return (
    <SalesOrderForm
      form={form}
      customers={[
        {
          id: "customer-1",
          name: "João Pedro",
          document: "123",
          authorizedTransportTypeIds: [],
        },
      ]}
      transportTypes={[
        {
          id: "truck",
          name: "Caminhão",
          active: true,
        },
        {
          id: "ship",
          name: "Navio",
          active: true,
        },
      ]}
      items={[
        {
          id: "item-1",
          sku: "SKU001",
          description: "Notebook",
          unit: "UN",
        },
      ]}
      createSalesOrder={{
        isPending: false,
        error: null,
      } as any}
      lastEvent=""
      onSubmit={vi.fn()}
      {...props}
    />
  );
}

describe("SalesOrderForm", () => {
  it("deve renderizar todos os campos", () => {
    render(<Wrapper />);

    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument();

    expect(
      screen.getByLabelText(/tipo de transporte/i)
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/item/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/qtd/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Criar ordem de venda/i,
      })
    ).toBeInTheDocument();
  });

  it("deve enviar o formulário", async () => {
    const user = userEvent.setup();

    const onSubmit = vi.fn();

    render(<Wrapper onSubmit={onSubmit} />);

    await user.selectOptions(
      screen.getByLabelText(/cliente/i),
      "customer-1"
    );

    await user.selectOptions(
      screen.getByLabelText(/tipo de transporte/i),
      "truck"
    );

    await user.selectOptions(
      screen.getByLabelText(/item/i),
      "item-1"
    );

    await user.clear(screen.getByLabelText(/qtd/i));

    await user.type(
      screen.getByLabelText(/qtd/i),
      "5"
    );

    await user.click(
      screen.getByRole("button", {
        name: /Criar ordem de venda/i,
      })
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit.mock.calls[0][0]).toEqual({
    customerId: "customer-1",
    transportTypeId: "truck",
    itemId: "item-1",
    quantity: 5,
    });
  });

  it("deve exibir erro da mutation", () => {
    render(
      <Wrapper
        createSalesOrder={{
          isPending: false,
          error: {
            message: "Erro ao criar OV",
          },
        } as any}
      />
    );

    expect(
      screen.getByText("Erro ao criar OV")
    ).toBeInTheDocument();
  });

  it("deve desabilitar o botão enquanto cria a ordem", () => {
    render(
      <Wrapper
        createSalesOrder={{
          isPending: true,
          error: null,
        } as any}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /Criar ordem de venda/i,
      })
    ).toBeDisabled();
  });

  it("deve exibir o último evento", () => {
    render(
      <Wrapper lastEvent="OV OV-001 criada" />
    );

    expect(
      screen.getByText("OV OV-001 criada")
    ).toBeInTheDocument();
  });

  it("não deve renderizar alerta de evento quando não existir", () => {
    render(<Wrapper />);

    expect(
      screen.queryByText(/OV-001 criada/i)
    ).not.toBeInTheDocument();
  });
});