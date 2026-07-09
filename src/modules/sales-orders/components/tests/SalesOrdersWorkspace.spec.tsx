import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { SalesOrdersWorkspace } from "../SalesOrdersWorkspace";

import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";
import { useSalesOrders } from "@/modules/sales-orders/hooks/useSalesOrders";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

vi.mock("@/modules/registrations/hooks/useRegistrations");
vi.mock("@/modules/sales-orders/hooks/useSalesOrders");
vi.mock("@/store/hooks");

const dispatch = vi.fn();

describe("SalesOrdersWorkspace", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppDispatch).mockReturnValue(dispatch);

    vi.mocked(useAppSelector).mockImplementation((selector: any) =>
      selector({
        monitoring: {},
        ui: {
          selectedSalesOrderId: "1",
          lastEvent: "OV criada",
        },
      })
    );

    vi.mocked(useRegistrations).mockReturnValue({
      customers: {
        data: [
          {
            id: "customer-1",
            name: "João",
            document: "123",
          },
        ],
      },
      transportTypes: {
        data: [
          {
            id: "truck",
            name: "Caminhão",
            active: true,
          },
        ],
      },
      items: {
        data: [
          {
            id: "item-1",
            sku: "SKU001",
            description: "Notebook",
            unit: "UN",
          },
        ],
      },
    } as any);

    vi.mocked(useSalesOrders).mockReturnValue({
      salesOrders: {
        data: [
          {
            id: "1",
            code: "OV-001",
            customerId: "customer-1",
            transportTypeId: "truck",
            status: "CRIADA",
            createdAt: new Date().toISOString(),
            items: [
              {
                itemId: "item-1",
                quantity: 1,
              },
            ],
          },
        ],
      },

      createSalesOrder: {
        mutateAsync: vi.fn(),
        isPending: false,
        error: null,
      },

      updateStatus: {
        mutateAsync: vi.fn(),
        isPending: false,
        error: null,
      },

      updateTransport: {
        mutateAsync: vi.fn(),
        isPending: false,
        error: null,
      },
    } as any);
  });

  it("deve renderizar o painel de gestão", () => {
    render(<SalesOrdersWorkspace />);

    expect(
      screen.getByRole("heading", {
        name: /Gestão de Ordens de Venda/i,
      })
    ).toBeInTheDocument();
  });

  it("deve renderizar o formulário de criação", () => {
    render(<SalesOrdersWorkspace />);

    expect(
      screen.getByRole("heading", {
        name: /Nova Ordem de Venda/i,
      })
    ).toBeInTheDocument();
  });

  it("deve renderizar os detalhes quando existir uma ordem selecionada", () => {
    render(<SalesOrdersWorkspace />);

    expect(
      screen.getByRole("combobox", {
        name: /Alterar tipo de transporte/i,
      })
    ).toBeInTheDocument();
  });

  it("não deve renderizar detalhes quando não existir ordem", () => {
    vi.mocked(useSalesOrders).mockReturnValue({
      salesOrders: {
        data: [],
      },

      createSalesOrder: {
        mutateAsync: vi.fn(),
        isPending: false,
        error: null,
      },

      updateStatus: {
        mutateAsync: vi.fn(),
        isPending: false,
        error: null,
      },

      updateTransport: {
        mutateAsync: vi.fn(),
        isPending: false,
        error: null,
      },
    } as any);

    render(<SalesOrdersWorkspace />);

    expect(
      screen.queryByRole("combobox", {
        name: /Alterar tipo de transporte/i,
      })
    ).not.toBeInTheDocument();
  });
});