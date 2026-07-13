import { Suspense } from 'react'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-brand-paper lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-bronze">
              JG Represent
            </p>
            <h1 className="mt-3 text-4xl font-bold text-brand-ink">
              CRM Conecta Valores
            </h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Acesse o painel para acompanhar prospeccao, diagnosticos, propostas
              e follow-ups.
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </section>

      <section className="hidden bg-brand-ink p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="max-w-lg">
          <div className="h-1 w-24 rounded-full bg-brand-gold" />
          <h2 className="mt-8 text-5xl font-bold leading-tight">
            Diagnostico antes da proposta.
          </h2>
          <p className="mt-5 text-base leading-7 text-stone-300">
            Uma base interna para organizar cada empresa, registrar pareceres por
            setor e transformar relacionamento em fechamento.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-stone-300">
          <div>
            <strong className="block text-2xl text-brand-light">6</strong>
            setores avaliados
          </div>
          <div>
            <strong className="block text-2xl text-brand-light">360</strong>
            visao consultiva
          </div>
          <div>
            <strong className="block text-2xl text-brand-light">CRM</strong>
            sob medida
          </div>
        </div>
      </section>
    </main>
  )
}
