import { Inbox } from 'lucide-react'

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="panel flex min-h-48 flex-col items-center justify-center p-8 text-center">
      <Inbox className="h-8 w-8 text-brand-bronze" />
      <p className="mt-3 text-sm text-stone-600">{message}</p>
    </div>
  )
}
