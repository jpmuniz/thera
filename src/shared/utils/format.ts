import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTime(value: string) {
  return format(new Date(value), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function formatDate(value?: string) {
  if (!value) return "-";
  return format(new Date(`${value}T00:00:00`), "dd/MM/yyyy", { locale: ptBR });
}
