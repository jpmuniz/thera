import type { ApiErrorPayload } from "@/shared/types";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string[]>
  ) {
    super(message);
  }
}

export async function http<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({ message: "Erro inesperado" }))) as ApiErrorPayload;
    throw new ApiError(payload.message, response.status, payload.details);
  }

  return (await response.json()) as T;
}
