import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SalesOrderDetails } from "../SalesOrderDetails";

describe("SalesOrderDetails", () => {
  const order = {
    id: "1",
    code: "OV-001",
    customerId: "customer-1",
    transportTypeId: "truck",
    status: "PENDING",
    createdAt: "2026-01-10T10:00:00.000Z",
    items: [
      {
        itemId: "item-1",
        quantity: 3,
      },
    ],
  } as any;

  const items = [
    {
      id: "item-1",
      sku: "SKU001",
      description: "Notebook Dell",
      unit: "UN",
    },
  ];

  const transportTypes = [
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
  ];

  it("deve renderizar os detalhes da ordem", () => {
    render(
      <SalesOrderDetails
        order={order}
        items={items}
        transportTypes={transportTypes}
        updateTransport={{ error: null }}
        updateStatus={{ error: null }}
        onChangeTransport={vi.fn()}
      />
    );

    expect(screen.getByText("OV-001")).toBeInTheDocument();

    expect(
      screen.getByText(/Criada em/i)
    ).toBeInTheDocument();
  });

  it("deve renderizar os itens da ordem", () => {
    render(
      <SalesOrderDetails
        order={order}
        items={items}
        transportTypes={transportTypes}
        updateTransport={{ error: null }}
        updateStatus={{ error: null }}
        onChangeTransport={vi.fn()}
      />
    );

    expect(
      screen.getByText(/SKU001/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Notebook Dell/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Qtd. 3/i)
    ).toBeInTheDocument();
  });

  it("deve alterar o tipo de transporte", async () => {
    const user = userEvent.setup();

    const onChangeTransport = vi.fn().mockResolvedValue(undefined);

    render(
      <SalesOrderDetails
        order={order}
        items={items}
        transportTypes={transportTypes}
        updateTransport={{ error: null }}
        updateStatus={{ error: null }}
        onChangeTransport={onChangeTransport}
      />
    );

    await user.selectOptions(
      screen.getByRole("combobox"),
      "ship"
    );

    expect(onChangeTransport).toHaveBeenCalledTimes(1);

    expect(onChangeTransport).toHaveBeenCalledWith(
      order,
      "ship"
    );
  });

  it("deve exibir erro da atualização de transporte", () => {
    render(
      <SalesOrderDetails
        order={order}
        items={items}
        transportTypes={transportTypes}
        updateTransport={{
          error: {
            message: "Erro ao atualizar transporte",
          },
        }}
        updateStatus={{ error: null }}
        onChangeTransport={vi.fn()}
      />
    );

    expect(
      screen.getByText("Erro ao atualizar transporte")
    ).toBeInTheDocument();
  });

  it("deve exibir erro da atualização de status quando não existir erro de transporte", () => {
    render(
      <SalesOrderDetails
        order={order}
        items={items}
        transportTypes={transportTypes}
        updateTransport={{ error: null }}
        updateStatus={{
          error: {
            message: "Erro ao atualizar status",
          },
        }}
        onChangeTransport={vi.fn()}
      />
    );

    expect(
      screen.getByText("Erro ao atualizar status")
    ).toBeInTheDocument();
  });
});