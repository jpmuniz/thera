type ListProps = {
  emptyMessage?: string;
  label: string;
  rows: string[];
};

export function List({ emptyMessage = "Nenhum registro encontrado.", label, rows }: ListProps) {
  return (
    <div aria-label={label} className="max-h-64 overflow-auto rounded-md border border-line">
      {rows.length === 0 ? (
        <p className="px-3 py-3 text-sm text-muted">{emptyMessage}</p>
      ) : (
        rows.map((row) => (
          <div key={row} className="border-b border-line px-3 py-2 text-sm last:border-b-0">
            {row}
          </div>
        ))
      )}
    </div>
  );
}
