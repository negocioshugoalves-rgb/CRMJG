import { PageHeader } from '@/components/page-header'

export default function ConfiguracoesPage() {
  return (
    <>
      <PageHeader
        title="Configuracoes"
        description="Dados institucionais usados nos documentos, propostas e relatorios do CRM."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel p-5">
          <h3 className="font-semibold text-brand-ink">Identidade visual</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Dourado principal</dt>
              <dd className="font-semibold text-brand-bronze">#F2B138</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Dourado claro</dt>
              <dd className="font-semibold text-brand-bronze">#F2D377</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-stone-500">Preto institucional</dt>
              <dd className="font-semibold text-brand-bronze">#0D0D0D</dd>
            </div>
          </dl>
        </div>

        <div className="panel p-5">
          <h3 className="font-semibold text-brand-ink">Ambiente</h3>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Configure as variaveis NEXT_PUBLIC_SUPABASE_URL e
            NEXT_PUBLIC_SUPABASE_ANON_KEY no painel da Vercel antes do deploy de
            producao.
          </p>
        </div>
      </section>
    </>
  )
}
