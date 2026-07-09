import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ItemsForm } from "../ItemsForm";
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";

vi.mock("@/modules/registrations/hooks/useRegistrations");

const mockedUseRegistrations = vi.mocked(useRegistrations);

describe("ItemsForm", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseRegistrations.mockReturnValue({
      items: {
        data: [
          {
            id: "1",
            sku: "SKU001",
            description: "Notebook Dell",
            unit: "UN",
          },
          {
            id: "2",
            sku: "SKU002",
            description: "Mouse Logitech",
            unit: "CX",
          },
        ],
      },

      createItem: {
        mutateAsync,
        isPending: false,
        error: null,
      },
    } as any);
  });

  it("deve enviar os dados do item corretamente", async () => {
    mutateAsync.mockResolvedValue(undefined);

    const user = userEvent.setup();

    render(<ItemsForm />);

    await user.type(screen.getByLabelText(/sku/i), "SKU100");
    await user.type(screen.getByLabelText(/descrição/i), "Teclado Mecânico");
    await user.type(screen.getByLabelText(/unidade/i), "UN");

    await user.click(
      screen.getByRole("button", {
        name: /criar item/i,
      })
    );

    expect(mutateAsync).toHaveBeenCalledTimes(1);

    expect(mutateAsync).toHaveBeenCalledWith({
      sku: "SKU100",
      description: "Teclado Mecânico",
      unit: "UN",
    });
  });

  it("deve limpar o formulário após criar um item", async () => {
    mutateAsync.mockResolvedValue(undefined);

    const user = userEvent.setup();

    render(<ItemsForm />);

    const sku = screen.getByLabelText(/sku/i);
    const description = screen.getByLabelText(/descrição/i);
    const unit = screen.getByLabelText(/unidade/i);

    await user.type(sku, "SKU100");
    await user.type(description, "Teclado Mecânico");
    await user.type(unit, "UN");

    await user.click(
      screen.getByRole("button", {
        name: /criar item/i,
      })
    );

    expect(sku).toHaveValue("");
    expect(description).toHaveValue("");
    expect(unit).toHaveValue("");
  });

  it("deve exibir mensagem de erro quando o cadastro falhar", () => {
    mockedUseRegistrations.mockReturnValue({
      items: {
        data: [],
      },

      createItem: {
        mutateAsync,
        isPending: false,
        error: new Error("Item já cadastrado"),
      },
    } as any);

    render(<ItemsForm />);

    expect(
      screen.getByText("Item já cadastrado")
    ).toBeInTheDocument();
  });

  it("deve desabilitar o botão durante o cadastro", () => {
    mockedUseRegistrations.mockReturnValue({
      items: {
        data: [],
      },

      createItem: {
        mutateAsync,
        isPending: true,
        error: null,
      },
    } as any);

    render(<ItemsForm />);

    expect(
      screen.getByRole("button", {
        name: /criar item/i,
      })
    ).toBeDisabled();
  });

  it("deve renderizar os itens cadastrados", () => {
    render(<ItemsForm />);

    expect(
      screen.getByText("SKU001 - Notebook Dell (UN)")
    ).toBeInTheDocument();

    expect(
      screen.getByText("SKU002 - Mouse Logitech (CX)")
    ).toBeInTheDocument();
  });
});