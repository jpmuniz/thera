import { z } from "zod";

export const schema = z.object({
    customerId: z.string().min(1, "Selecione o cliente"),
    transportTypeId: z.string().min(1, "Selecione o transporte"),
    itemId: z.string().min(1, "Selecione um item"),
    quantity: z.coerce.number().positive("Quantidade deve ser maior que zero")
  });
  
  export type FormData = z.infer<typeof schema>;
  