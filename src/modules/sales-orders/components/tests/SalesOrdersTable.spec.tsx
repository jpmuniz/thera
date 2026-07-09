import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";


import { ORDER_STATUSES } from "@/shared/status";
import { SalesOrdersTable } from "../SalesOrdersTable";

describe("SalesOrdersTable", () => {
    const FIRST_STATUS = ORDER_STATUSES[0];
    const LAST_STATUS = ORDER_STATUSES.at(-1)!;

    const orders = [
        {
          id: "1",
          code: "OV-001",
          customerId: "customer-1",
          transportTypeId: "truck",
          status: FIRST_STATUS, 
          createdAt: "2026-01-01T10:00:00Z",
          items: [],
        },
        {
          id: "2",
          code: "OV-002",
          customerId: "customer-2",
          transportTypeId: "ship",
          status: LAST_STATUS, 
          createdAt: "2026-01-01T10:00:00Z",
          items: [],
        },
      ] as any;

  const customers = [
    {
      id: "customer-1",
      name: "João",
    },
    {
      id: "customer-2",
      name: "Maria",
    },
  ] as any;

  const transportTypes = [
    {
      id: "truck",
      name: "Caminhão",
    },
    {
      id: "ship",
      name: "Navio",
    },
  ] as any;

  function renderComponent(
    props?: Partial<React.ComponentProps<typeof SalesOrdersTable>>
  ) {
    return render(
      <SalesOrdersTable
        orders={orders}
        customers={customers}
        transportTypes={transportTypes}
        isUpdating={false}
        onSelect={vi.fn()}
        onAdvance={vi.fn()}
        {...props}
      />
    );
  }

  it("deve renderizar as ordens de venda", () => {
    renderComponent();

    expect(screen.getByText("OV-001")).toBeInTheDocument();
    expect(screen.getByText("OV-002")).toBeInTheDocument();

    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("Maria")).toBeInTheDocument();

    expect(screen.getByText("Caminhão")).toBeInTheDocument();
    expect(screen.getByText("Navio")).toBeInTheDocument();
  });

  it("deve selecionar uma ordem", async () => {
    const user = userEvent.setup();

    const onSelect = vi.fn();

    renderComponent({
      onSelect,
    });

    await user.click(screen.getByRole("button", { name: "OV-001" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("1");
  });

  it("deve avançar o status da ordem", async () => {
    const user = userEvent.setup();

    const onAdvance = vi.fn().mockResolvedValue(undefined);

    renderComponent({
      onAdvance,
    });

    await user.click(
      screen.getByRole("button", {
        name: /Avançar status da OV-001/i,
      })
    );

    expect(onAdvance).toHaveBeenCalledTimes(1);
    expect(onAdvance).toHaveBeenCalledWith(orders[0]);
  });

  it("deve desabilitar os botões enquanto atualiza", () => {
    renderComponent({
      isUpdating: true,
    });

    const buttons = screen.getAllByRole("button", {
      name: /Avançar status/i,
    });

    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("deve desabilitar o botão quando não existir próximo status", () => {
    renderComponent();

    const deliveredButton = screen.getByRole("button", {
      name: /Avançar status da OV-002/i,
    });

    expect(deliveredButton).toBeDisabled();
  });
});