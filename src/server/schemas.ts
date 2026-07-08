import { z } from "zod";
import { ORDER_STATUSES } from "@/shared/status";
import type { OrderStatus } from "@/shared/types";

export const customerSchema = z.object({
  name: z.string().min(3, "Informe o nome do cliente"),
  document: z.string().min(5, "Informe o documento"),
  authorizedTransportTypeIds: z.array(z.string()).min(1, "Autorize ao menos um tipo de transporte")
});

export const transportTypeSchema = z.object({
  name: z.string().min(3, "Informe o nome"),
  active: z.boolean().default(true)
});

export const itemSchema = z.object({
  sku: z.string().min(3, "Informe o SKU"),
  description: z.string().min(3, "Informe a descrição"),
  unit: z.string().min(1, "Informe a unidade")
});

export const salesOrderSchema = z.object({
  customerId: z.string().min(1),
  transportTypeId: z.string().min(1),
  items: z
    .array(
      z.object({
        itemId: z.string().min(1),
        quantity: z.coerce.number().positive()
      })
    )
    .min(1, "Informe ao menos um item")
});

export const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES as [OrderStatus, ...OrderStatus[]])
});

export const scheduleSchema = z
  .object({
    deliveryDate: z.string().min(10),
    windowStart: z.string().min(5),
    windowEnd: z.string().min(5),
    confirmed: z.boolean().default(false)
  })
  .refine((data) => data.windowEnd > data.windowStart, {
    message: "Janela final deve ser maior que a inicial",
    path: ["windowEnd"]
  });

export const transportChangeSchema = z.object({
  transportTypeId: z.string().min(1)
});
