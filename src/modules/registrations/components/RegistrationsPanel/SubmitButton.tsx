import { Plus } from "lucide-react";

type SubmitButtonProps = {
  disabled?: boolean;
  label: string;
};

export function SubmitButton({ disabled = false, label }: SubmitButtonProps) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      type="submit"
    >
      <Plus aria-hidden="true" size={16} />
      {label}
    </button>
  );
}
