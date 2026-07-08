import { clsx } from "clsx";
import type { ReactNode } from "react";
import { alertStyles } from "./styles";

type AlertVariant = keyof typeof alertStyles;

type AlertProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  live?: "assertive" | "polite" | "off";
  variant?: AlertVariant;
};

export function Alert({ children, className, id, live, variant = "error" }: AlertProps) {
  const isError = variant === "error";

  return (
    <p
      aria-live={live}
      className={clsx("rounded-md border px-3 py-2 text-sm", alertStyles[variant], className)}
      id={id}
      role={isError ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
