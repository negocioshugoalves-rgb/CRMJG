'use client'

import { Download, Printer } from 'lucide-react'

export function PrintButton({ label = 'Baixar PDF' }: { label?: string }) {
  return (
    <button className="btn-primary" type="button" onClick={() => window.print()}>
      <Download className="h-4 w-4" />
      {label}
    </button>
  )
}

export function PrintHint() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <Printer className="h-4 w-4" />
      <span>Na janela de impressão, escolha "Salvar como PDF" para baixar o arquivo.</span>
    </div>
  )
}

