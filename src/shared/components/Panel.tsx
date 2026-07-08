import { clsx } from "clsx";

export function Panel({
  title,
  action,
  children,
  className
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const titleId = `panel-${title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <section aria-labelledby={titleId} className={clsx("rounded-lg border border-line bg-white shadow-soft", className)}>
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h2 id={titleId} className="text-base font-semibold text-ink">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}
