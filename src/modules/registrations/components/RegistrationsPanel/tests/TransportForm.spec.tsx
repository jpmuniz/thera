import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TransportForm } from "../TransportForm";
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";

vi.mock("@/modules/registrations/hooks/useRegistrations");

const mockedUseRegistrations = vi.mocked(useRegistrations);

describe("TransportForm", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseRegistrations.mockReturnValue({
      transportTypes: {
        data: [
          {
            id: "truck",
            name: "Caminhão",
            active: true,
          },
          {
            id: "ship",
            name: "Navio",
            active: false,
          },
        ],
      },

      createTransportType: {
        mutateAsync,
        isPending: false,
        error: null,
      },
    } as any);
  });

  it("deve enviar os dados do formulário", async () => {
    mutateAsync.mockResolvedValue(undefined);

    const user = userEvent.setup();

    render(<TransportForm />);

    await user.type(
      screen.getByLabelText(/nome do transporte/i),
      "Avião"
    );

    await user.click(
      screen.getByRole("button", {
        name: /criar transporte/i,
      })
    );

    expect(mutateAsync).toHaveBeenCalledTimes(1);

    expect(mutateAsync).toHaveBeenCalledWith({
      name: "Avião",
      active: true,
    });
  });

  it("deve limpar o formulário após criar um transporte", async () => {
    mutateAsync.mockResolvedValue(undefined);

    const user = userEvent.setup();

    render(<TransportForm />);

    const input = screen.getByLabelText(/nome do transporte/i);

    await user.type(input, "Avião");

    await user.click(
      screen.getByRole("button", {
        name: /criar transporte/i,
      })
    );

    expect(input).toHaveValue("");

    expect(
      screen.getByLabelText(/ativo/i)
    ).toBeChecked();
  });

  it("deve exibir mensagem de erro quando a criação falhar", () => {
    mockedUseRegistrations.mockReturnValue({
      transportTypes: {
        data: [],
      },

      createTransportType: {
        mutateAsync,
        isPending: false,
        error: new Error("Transporte já cadastrado"),
      },
    } as any);

    render(<TransportForm />);

    expect(
      screen.getByText("Transporte já cadastrado")
    ).toBeInTheDocument();
  });

  it("deve desabilitar o botão enquanto cria o transporte", () => {
    mockedUseRegistrations.mockReturnValue({
      transportTypes: {
        data: [],
      },

      createTransportType: {
        mutateAsync,
        isPending: true,
        error: null,
      },
    } as any);

    render(<TransportForm />);

    expect(
      screen.getByRole("button", {
        name: /criar transporte/i,
      })
    ).toBeDisabled();
  });

  it("deve renderizar os transportes cadastrados", () => {
    render(<TransportForm />);

    expect(
      screen.getByText("Caminhão - ativo")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Navio - inativo")
    ).toBeInTheDocument();
  });
});