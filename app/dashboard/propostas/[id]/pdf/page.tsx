import { notFound } from 'next/navigation'
import { SETOR_LABELS, STATUS_ACAO_LABELS } from '@/lib/constants'
import { PrintButton, PrintHint } from '@/components/print-button'
import { createClient } from '@/lib/supabase/server'
import type { Diagnostico, Empresa, PlanoAcao, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

type PropostaCompleta = Proposta & { empresas?: Empresa | null }

function money(value: number | null) {
  return value ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A definir'
}

export default async function PropostaPdfPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: propostaData } = await supabase.from('propostas').select('*, empresas(*)').eq('id', params.id).single()
  if (!propostaData) notFound()

  const proposta = propostaData as PropostaCompleta
  const [{ data: diagnosticosData }, { data: planosData }] = await Promise.all([
    supabase.from('diagnosticos').select('*').eq('empresa_id', proposta.empresa_id).order('avaliado_em'),
    supabase.from('planos_acao').select('*').eq('empresa_id', proposta.empresa_id).order('ordem'),
  ])
  const diagnosticos = (diagnosticosData ?? []) as Diagnostico[]
  const planos = (planosData ?? []) as PlanoAcao[]

  return (
    <main className="min-h-screen bg-stone-100 p-6 print:bg-white print:p-0">
      <style>{`@page { size: A4; margin: 16mm; } @media print { .no-print { display: none; } .doc { box-shadow: none; padding: 0; } body { background: white; } }`}</style>
      <div className="no-print mx-auto mb-4 flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PrintHint />
        <PrintButton label="Baixar proposta em PDF" />
      </div>
      <article className="doc mx-auto max-w-4xl bg-white p-10 shadow-sm">
        <header className="border-b-4 border-brand-gold pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-bronze">JG Represent</p>
          <h1 className="mt-4 text-4xl font-bold text-brand-ink">{proposta.titulo}</h1>
          <p className="mt-3 text-lg text-stone-600">Proposta consultiva para {proposta.empresas?.nome}</p>
          <div className="mt-6 grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
            <span><strong>Cliente:</strong> {proposta.empresas?.nome}</span>
            <span><strong>CNPJ:</strong> {proposta.empresas?.cnpj}</span>
            <span><strong>Validade:</strong> {proposta.data_validade || 'A definir'}</span>
          </div>
        </header>

        <section className="mt-8"><h2 className="text-xl font-bold text-brand-ink">1. Resumo do diagnostico</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.resumo_diagnostico || 'Resumo a definir.'}</p></section>

        <section className="mt-8"><h2 className="text-xl font-bold text-brand-ink">2. Analise por area</h2><div className="mt-4 grid gap-4">{diagnosticos.length ? diagnosticos.map((diagnostico) => <div className="rounded-md border border-stone-200 p-4" key={diagnostico.id}><h3 className="font-semibold text-brand-bronze">{SETOR_LABELS[diagnostico.setor]}</h3>{diagnostico.situacao_atual ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Situacao atual:</strong> {diagnostico.situacao_atual}</p> : null}<p className="mt-2 text-sm leading-6 text-stone-700"><strong>Parecer:</strong> {diagnostico.parecer}</p>{diagnostico.recomendacoes ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Recomendacao:</strong> {diagnostico.recomendacoes}</p> : null}</div>) : <p className="text-sm text-stone-600">Nenhum diagnostico vinculado ainda.</p>}</div></section>

        <section className="mt-8"><h2 className="text-xl font-bold text-brand-ink">3. Plano de acao proposto</h2><div className="mt-4 grid gap-3">{planos.length ? planos.map((plano) => <div className="rounded-md border border-stone-200 p-4" key={plano.id}><div className="flex items-start justify-between gap-4"><h3 className="font-semibold text-brand-ink">{plano.ordem}. {plano.titulo}</h3><span className="text-xs font-semibold text-brand-bronze">{STATUS_ACAO_LABELS[plano.status]}</span></div><p className="mt-2 text-sm leading-6 text-stone-700">{plano.descricao}</p>{plano.resultado_esperado ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Resultado esperado:</strong> {plano.resultado_esperado}</p> : null}<p className="mt-2 text-sm text-stone-600">Area: {SETOR_LABELS[plano.setor]} · Prazo: {plano.prazo || 'A definir'}</p></div>) : <p className="text-sm text-stone-600">Nenhuma acao planejada ainda.</p>}</div></section>

        <section className="mt-8"><h2 className="text-xl font-bold text-brand-ink">4. Metodologia</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.metodologia || 'Metodologia a definir.'}</p></section>
        <section className="mt-8"><h2 className="text-xl font-bold text-brand-ink">5. Cronograma</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.cronograma || 'Cronograma a definir.'}</p></section>
        <section className="mt-8"><h2 className="text-xl font-bold text-brand-ink">6. Investimento e condicoes</h2><p className="mt-3 text-2xl font-bold text-brand-ink">{money(proposta.valor)}</p><p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.condicoes_comerciais || 'Condicoes comerciais a definir.'}</p></section>
      </article>
    </main>
  )
}



