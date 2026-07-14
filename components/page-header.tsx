export function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-bronze">
        CRM Consultivo
      </p>
      <h2 className="mt-2 text-3xl font-bold text-brand-ink">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{description}</p>
    </div>
  )
}