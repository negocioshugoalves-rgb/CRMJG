import { notFound } from 'next/navigation'
import { SETOR_LABELS, STATUS_ACAO_LABELS } from '@/lib/constants'
import { PrintButton, PrintHint } from '@/components/print-button'
import { createClient } from '@/lib/supabase/server'
import type { ConfiguracaoEmpresa, Diagnostico, Empresa, PlanoAcao, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

type PropostaCompleta = Proposta & { empresas?: Empresa | null }

function money(value: number | null) {
  return value ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'A definir'
}

function formatDate(value: string | null) {
  if (!value) return 'A definir'
  return new Date(`${value}T00:00:00`).toLocaleDateString('pt-BR')
}

function contatoConsultoria(config: ConfiguracaoEmpresa | null) {
  return [config?.telefone, config?.email, config?.site].filter(Boolean).join(' | ')
}

export default async function PropostaPdfPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const [{ data: propostaData }, { data: configData }] = await Promise.all([
    supabase.from('propostas').select('*, empresas(*)').eq('id', params.id).single(),
    supabase.from('configuracoes_empresa').select('*').eq('id', 1).maybeSingle(),
  ])

  if (!propostaData) notFound()

  const proposta = propostaData as PropostaCompleta
  const config = (configData ?? null) as ConfiguracaoEmpresa | null
  const [{ data: diagnosticosData }, { data: planosData }] = await Promise.all([
    supabase.from('diagnosticos').select('*').eq('empresa_id', proposta.empresa_id).order('avaliado_em'),
    supabase.from('planos_acao').select('*').eq('empresa_id', proposta.empresa_id).order('ordem'),
  ])
  const diagnosticos = (diagnosticosData ?? []) as Diagnostico[]
  const planos = (planosData ?? []) as PlanoAcao[]
  const consultoriaNome = config?.nome_fantasia || config?.razao_social || 'Empresa consultora'
  const cliente = proposta.empresas

  return (
    <main className="min-h-screen bg-stone-100 p-6 print:bg-white print:p-0">
      <style>{`
        @page { size: A4; margin: 14mm; }
        @media print {
          .no-print { display: none; }
          .doc { box-shadow: none; margin: 0; max-width: none; }
          .page-break { break-before: page; }
          body { background: white; }
        }
      `}</style>

      <div className="no-print mx-auto mb-4 flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PrintHint />
        <PrintButton label="Baixar proposta em PDF" />
      </div>

      <article className="doc mx-auto max-w-5xl bg-white shadow-sm">
        <section className="relative overflow-hidden bg-brand-ink px-10 py-12 text-white">
          <div className="absolute right-0 top-0 h-full w-2 bg-brand-gold" />
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">Proposta comercial</p>
              <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight">{proposta.titulo}</h1>
              <p className="mt-4 text-lg text-stone-200">Preparada para {cliente?.nome || 'cliente'}</p>
            </div>
            <div className="min-w-56 text-left sm:text-right">
              {config?.logo_url ? <img alt={consultoriaNome} className="mb-4 ml-auto max-h-16 max-w-44 object-contain" src={config.logo_url} /> : null}
              <p className="text-lg font-bold">{consultoriaNome}</p>
              {config?.cnpj ? <p className="mt-1 text-sm text-stone-300">CNPJ {config.cnpj}</p> : null}
            </div>
          </div>

          <div className="mt-12 grid gap-4 text-sm sm:grid-cols-3">
            <div className="border-t border-white/20 pt-4"><p className="text-stone-300">Cliente</p><p className="mt-1 font-semibold">{cliente?.nome || '-'}</p></div>
            <div className="border-t border-white/20 pt-4"><p className="text-stone-300">Investimento</p><p className="mt-1 font-semibold">{money(proposta.valor)}</p></div>
            <div className="border-t border-white/20 pt-4"><p className="text-stone-300">Validade</p><p className="mt-1 font-semibold">{formatDate(proposta.data_validade)}</p></div>
          </div>
        </section>

        <section className="grid gap-6 border-b border-stone-200 px-10 py-8 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-bronze">Consultoria responsável</h2>
            <p className="mt-3 text-xl font-bold text-brand-ink">{consultoriaNome}</p>
            {config?.razao_social ? <p className="mt-1 text-sm text-stone-600">{config.razao_social}</p> : null}
            {config?.endereco ? <p className="mt-3 text-sm leading-6 text-stone-700">{config.endereco}</p> : null}
            {config?.cidade_estado ? <p className="text-sm leading-6 text-stone-700">{config.cidade_estado}</p> : null}
            {contatoConsultoria(config) ? <p className="mt-3 text-sm leading-6 text-stone-700">{contatoConsultoria(config)}</p> : null}
            {config?.responsavel ? <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Responsável:</strong> {config.responsavel}{config.cargo_responsavel ? `, ${config.cargo_responsavel}` : ''}</p> : null}
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-bronze">Empresa cliente</h2>
            <p className="mt-3 text-xl font-bold text-brand-ink">{cliente?.nome || '-'}</p>
            <div className="mt-3 grid gap-2 text-sm text-stone-700">
              <p><strong>CNPJ:</strong> {cliente?.cnpj || '-'}</p>
              <p><strong>Segmento:</strong> {cliente?.segmento || '-'}</p>
              <p><strong>Porte:</strong> {cliente?.porte || '-'}</p>
              <p><strong>Contato:</strong> {cliente?.contato_nome || '-'}</p>
              <p><strong>E-mail/telefone:</strong> {cliente?.contato_email || cliente?.contato_telefone || '-'}</p>
            </div>
          </div>
        </section>

        {config?.descricao ? (
          <section className="px-10 py-8">
            <h2 className="text-xl font-bold text-brand-ink">Apresentação da consultoria</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{config.descricao}</p>
          </section>
        ) : null}

        <section className="px-10 py-8">
          <h2 className="text-xl font-bold text-brand-ink">1. Resumo executivo</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.resumo_diagnostico || 'Resumo a definir.'}</p>
        </section>

        <section className="px-10 py-8">
          <h2 className="text-xl font-bold text-brand-ink">2. Diagnóstico por área</h2>
          <div className="mt-5 grid gap-4">
            {diagnosticos.length ? diagnosticos.map((diagnostico) => (
              <div className="rounded-md border border-stone-200 p-5" key={diagnostico.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-brand-ink">{SETOR_LABELS[diagnostico.setor]}</h3>
                  <span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">Prioridade {diagnostico.prioridade}</span>
                </div>
                {diagnostico.situacao_atual ? <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Situação atual:</strong> {diagnostico.situacao_atual}</p> : null}
                {diagnostico.problemas_identificados ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Pontos de atenção:</strong> {diagnostico.problemas_identificados}</p> : null}
                <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Parecer consultivo:</strong> {diagnostico.parecer}</p>
                {diagnostico.recomendacoes ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Recomendação:</strong> {diagnostico.recomendacoes}</p> : null}
              </div>
            )) : <p className="text-sm text-stone-600">Nenhum diagnóstico vinculado ainda.</p>}
          </div>
        </section>

        <section className="px-10 py-8">
          <h2 className="text-xl font-bold text-brand-ink">3. Escopo e plano de ação</h2>
          {proposta.descricao ? <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.descricao}</p> : null}
          <div className="mt-5 grid gap-4">
            {planos.length ? planos.map((plano) => (
              <div className="rounded-md border border-stone-200 p-5" key={plano.id}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-brand-ink">{plano.ordem}. {plano.titulo}</h3>
                  <span className="text-xs font-semibold text-brand-bronze">{STATUS_ACAO_LABELS[plano.status]}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-700">{plano.descricao}</p>
                {plano.resultado_esperado ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Resultado esperado:</strong> {plano.resultado_esperado}</p> : null}
                <p className="mt-3 text-sm text-stone-600">Área: {SETOR_LABELS[plano.setor]} | Responsável: {plano.responsavel || 'A definir'} | Prazo: {formatDate(plano.prazo)}</p>
              </div>
            )) : <p className="text-sm text-stone-600">Nenhuma ação planejada ainda.</p>}
          </div>
        </section>

        <section className="grid gap-6 px-10 py-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-brand-ink">4. Metodologia</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.metodologia || 'Metodologia a definir.'}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-ink">5. Cronograma</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.cronograma || 'Cronograma a definir.'}</p>
          </div>
        </section>

        <section className="mx-10 my-8 rounded-md border border-brand-gold bg-brand-paper p-6">
          <h2 className="text-xl font-bold text-brand-ink">6. Investimento e condições comerciais</h2>
          <p className="mt-4 text-3xl font-bold text-brand-ink">{money(proposta.valor)}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.condicoes_comerciais || 'Condições comerciais a definir.'}</p>
        </section>

        <section className="grid gap-8 px-10 pb-12 pt-8 md:grid-cols-2">
          <div>
            <div className="mt-12 border-t border-stone-400 pt-3 text-sm text-stone-700">
              <p className="font-semibold text-brand-ink">{consultoriaNome}</p>
              <p>{config?.responsavel || 'Responsável pela proposta'}</p>
            </div>
          </div>
          <div>
            <div className="mt-12 border-t border-stone-400 pt-3 text-sm text-stone-700">
              <p className="font-semibold text-brand-ink">{cliente?.nome || 'Empresa cliente'}</p>
              <p>Aceite da proposta</p>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}
