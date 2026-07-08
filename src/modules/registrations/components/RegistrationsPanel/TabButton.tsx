import type { ReactNode } from "react";

type TabButtonProps = {
  active: boolean;
  children: ReactNode;
  controls: string;
  id: string;
  onClick: () => void;
};

export function TabButton({ active, children, controls, id, onClick }: TabButtonProps) {
  return (
    <button
      aria-controls={controls}
      aria-selected={active}
      className={active ? "rounded bg-white px-3 py-2 text-sm font-semibold shadow-sm" : "px-3 py-2 text-sm"}
      id={id}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {children}
    </button>
  );
}
