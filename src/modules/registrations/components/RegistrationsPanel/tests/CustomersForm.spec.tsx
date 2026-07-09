import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CustomersForm } from "../CustomersForm";
import { useRegistrations } from "@/modules/registrations/hooks/useRegistrations";

vi.mock("@/modules/registrations/hooks/useRegistrations");

const mockedUseRegistrations = vi.mocked(useRegistrations);

describe("CustomersForm", () => {
  const mutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseRegistrations.mockReturnValue({
      customers: {
        data: [
          {
            id: "1",
            name: "Empresa XPTO",
            document: "123456789",
          },
        ],
      },

      transportTypes: {
        data: [
          {
            id: "truck",
            name: "Caminhão",
          },
          {
            id: "ship",
            name: "Navio",
          },
        ],
      },

      createCustomer: {
        mutateAsync,
        isPending: false,
        error: null,
      },
    } as any);
  });

  it("deve enviar os dados do formulário corretamente", async () => {
    mutateAsync.mockResolvedValue(undefined);

    const user = userEvent.setup();

    render(<CustomersForm />);

    await user.type(
      screen.getByLabelText(/nome do cliente/i),
      "João Pedro"
    );

    await user.type(
      screen.getByLabelText(/documento/i),
      "12345678900"
    );

    await user.click(screen.getByLabelText(/caminhão/i));

    await user.click(
      screen.getByRole("button", {
        name: /criar cliente/i,
      })
    );

    expect(mutateAsync).toHaveBeenCalledTimes(1);

    expect(mutateAsync).toHaveBeenCalledWith({
      name: "João Pedro",
      document: "12345678900",
      authorizedTransportTypeIds: ["truck"],
    });
  });

  it("deve limpar o formulário após cadastrar um cliente", async () => {
    mutateAsync.mockResolvedValue(undefined);

    const user = userEvent.setup();

    render(<CustomersForm />);

    const nameInput = screen.getByLabelText(/nome do cliente/i);
    const documentInput = screen.getByLabelText(/documento/i);

    await user.type(nameInput, "João Pedro");
    await user.type(documentInput, "12345678900");

    await user.click(
      screen.getByRole("button", {
        name: /criar cliente/i,
      })
    );

    expect(nameInput).toHaveValue("");
    expect(documentInput).toHaveValue("");
  });

  it("deve exibir uma mensagem de erro quando o cadastro falhar", () => {
    mockedUseRegistrations.mockReturnValue({
      customers: { data: [] },

      transportTypes: { data: [] },

      createCustomer: {
        mutateAsync,
        isPending: false,
        error: new Error("Cliente já cadastrado"),
      },
    } as any);

    render(<CustomersForm />);

    expect(
      screen.getByText("Cliente já cadastrado")
    ).toBeInTheDocument();
  });

  it("deve desabilitar o botão durante o envio", () => {
    mockedUseRegistrations.mockReturnValue({
      customers: { data: [] },

      transportTypes: { data: [] },

      createCustomer: {
        mutateAsync,
        isPending: true,
        error: null,
      },
    } as any);

    render(<CustomersForm />);

    expect(
      screen.getByRole("button", {
        name: /criar cliente/i,
      })
    ).toBeDisabled();
  });

  it("deve renderizar os clientes cadastrados", () => {
    render(<CustomersForm />);

    expect(
      screen.getByText("Empresa XPTO - 123456789")
    ).toBeInTheDocument();
  });
});