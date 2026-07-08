import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message: string, error?: ZodError) {
  return NextResponse.json(
    {
      message,
      details: error?.flatten().fieldErrors
    },
    { status: 400 }
  );
}

export function notFound(message = "Registro não encontrado") {
  return NextResponse.json({ message }, { status: 404 });
}
