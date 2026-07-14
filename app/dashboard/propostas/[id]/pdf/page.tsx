import { notFound } from 'next/navigation'
import { SETOR_LABELS, STATUS_ACAO_LABELS } from '@/lib/constants'
import { PrintButton, PrintHint } from '@/components/print-button'
import { createClient } from '@/lib/supabase/server'
import type { ConfiguracaoEmpresa, Diagnostico, Empresa, PlanoAcao, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

type PropostaCompleta = Proposta & { empresas?: Empresa | null }
type CoresProposta = {
  primaria: string
  secundaria: string
  destaque: string
}

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

function safeColor(value: string | null | undefined, fallback: string) {
  return value && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
}

function tipoInvestimentoLabel(value: string | null | undefined) {
  return value === 'mensal' ? 'Mensal' : 'Por projeto'
}

function periodoProjetoLabel(proposta: Proposta) {
  if (proposta.periodo_tipo === 'indeterminado') return 'Indeterminado'
  const inicio = formatDate(proposta.periodo_inicio)
  const fim = formatDate(proposta.periodo_fim)
  if (inicio === 'A definir' && fim === 'A definir') return 'A definir'
  return `${inicio} até ${fim}`
}
function SectionTitle({ number, title, colors }: { number: string; title: string; colors: CoresProposta }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: colors.secundaria }}>{number}</span>
      <h2 className="text-xl font-bold" style={{ color: colors.primaria }}>{title}</h2>
    </div>
  )
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
  const colors: CoresProposta = {
    primaria: safeColor(config?.cor_primaria, '#1f2933'),
    secundaria: safeColor(config?.cor_secundaria, '#9a6a2f'),
    destaque: safeColor(config?.cor_destaque, '#d9b46c'),
  }

  return (
    <main className="min-h-screen bg-stone-100 p-6 print:bg-white print:p-0">
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          .no-print { display: none; }
          .doc { box-shadow: none; margin: 0; max-width: none; }
          .page-break { break-before: page; }
          .avoid-break { break-inside: avoid; }
          body { background: white; }
        }
      `}</style>

      <div className="no-print mx-auto mb-4 flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PrintHint />
        <PrintButton label="Baixar proposta em PDF" />
      </div>

      <article className="doc mx-auto max-w-5xl bg-white shadow-sm">
        <section className="relative flex min-h-[1040px] flex-col overflow-hidden px-12 py-12 text-white" style={{ backgroundColor: colors.primaria }}>
          <div className="absolute inset-y-0 right-0 w-4" style={{ backgroundColor: colors.destaque }} />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-20" style={{ backgroundColor: colors.secundaria }} />
          <div className="absolute -bottom-28 left-8 h-80 w-80 rounded-full opacity-20" style={{ backgroundColor: colors.destaque }} />

          <header className="relative flex items-start justify-between gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em]" style={{ color: colors.destaque }}>Proposta comercial</p>
              <p className="mt-3 text-sm text-white/75">Consultoria empresarial</p>
            </div>
            <div className="min-w-56 text-right">
              {config?.logo_url ? <img alt={consultoriaNome} className="mb-4 ml-auto max-h-20 max-w-48 object-contain" src={config.logo_url} /> : null}
              <p className="text-xl font-bold">{consultoriaNome}</p>
              {config?.cnpj ? <p className="mt-1 text-sm text-white/70">CNPJ {config.cnpj}</p> : null}
            </div>
          </header>

          <div className="relative mt-40 max-w-3xl">
            <h1 className="text-5xl font-bold leading-tight">{proposta.titulo}</h1>
            <p className="mt-6 text-2xl text-white/85">Preparada para {cliente?.nome || 'empresa cliente'}</p>
          </div>

          <div className="relative mt-auto grid gap-4 text-sm sm:grid-cols-3">
            <div className="border-t border-white/25 pt-4"><p className="text-white/65">Cliente</p><p className="mt-1 font-semibold">{cliente?.nome || '-'}</p></div>
            <div className="border-t border-white/25 pt-4"><p className="text-white/65">Investimento</p><p className="mt-1 font-semibold">{money(proposta.valor)} / {tipoInvestimentoLabel(proposta.tipo_investimento)}</p></div>
            <div className="border-t border-white/25 pt-4"><p className="text-white/65">Validade</p><p className="mt-1 font-semibold">{formatDate(proposta.data_validade)}</p></div>
          </div>
        </section>

        <section className="page-break grid gap-6 border-b border-stone-200 px-10 py-8 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: colors.secundaria }}>Consultoria responsÃƒÂ¡vel</h2>
            <p className="mt-3 text-xl font-bold" style={{ color: colors.primaria }}>{consultoriaNome}</p>
            {config?.razao_social ? <p className="mt-1 text-sm text-stone-600">{config.razao_social}</p> : null}
            {config?.endereco ? <p className="mt-3 text-sm leading-6 text-stone-700">{config.endereco}</p> : null}
            {config?.cidade_estado ? <p className="text-sm leading-6 text-stone-700">{config.cidade_estado}</p> : null}
            {contatoConsultoria(config) ? <p className="mt-3 text-sm leading-6 text-stone-700">{contatoConsultoria(config)}</p> : null}
            {config?.responsavel ? <p className="mt-3 text-sm leading-6 text-stone-700"><strong>ResponsÃƒÂ¡vel:</strong> {config.responsavel}{config.cargo_responsavel ? `, ${config.cargo_responsavel}` : ''}</p> : null}
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: colors.secundaria }}>Empresa cliente</h2>
            <p className="mt-3 text-xl font-bold" style={{ color: colors.primaria }}>{cliente?.nome || '-'}</p>
            <div className="mt-3 grid gap-2 text-sm text-stone-700">
              <p><strong>CNPJ:</strong> {cliente?.cnpj || '-'}</p>
              <p><strong>Segmento:</strong> {cliente?.segmento || '-'}</p>
              <p><strong>Porte:</strong> {cliente?.porte || '-'}</p>
              <p><strong>Contato:</strong> {cliente?.contato_nome || '-'}</p>
              <p><strong>E-mail:</strong> {cliente?.contato_email || '-'}</p>
              <p><strong>Telefone:</strong> {cliente?.contato_telefone || '-'}</p>
              <p><strong>Origem:</strong> {cliente?.origem_prospeccao || '-'}</p>
              {cliente?.observacoes ? <p><strong>ObservaÃƒÂ§ÃƒÂµes:</strong> {cliente.observacoes}</p> : null}
            </div>
          </div>
        </section>

        {config?.descricao ? (
          <section className="px-10 py-8">
            <SectionTitle number="0" title="ApresentaÃƒÂ§ÃƒÂ£o da consultoria" colors={colors} />
            <p className="whitespace-pre-line text-sm leading-7 text-stone-700">{config.descricao}</p>
          </section>
        ) : null}

        <section className="px-10 py-8">
          <SectionTitle number="1" title="Resumo executivo" colors={colors} />
          <p className="whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.resumo_diagnostico || 'Resumo a definir.'}</p>
        </section>

        <section className="px-10 py-8">
          <SectionTitle number="2" title="DiagnÃƒÂ³stico por ÃƒÂ¡rea" colors={colors} />
          <div className="grid gap-4">
            {diagnosticos.length ? diagnosticos.map((diagnostico) => (
              <div className="avoid-break rounded-md border border-stone-200 p-5" key={diagnostico.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold" style={{ color: colors.primaria }}>{SETOR_LABELS[diagnostico.setor]}</h3>
                  <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${colors.destaque}33`, color: colors.secundaria }}>Prioridade {diagnostico.prioridade}</span>
                </div>
                {diagnostico.situacao_atual ? <p className="mt-3 text-sm leading-6 text-stone-700"><strong>SituaÃƒÂ§ÃƒÂ£o atual:</strong> {diagnostico.situacao_atual}</p> : null}
                {diagnostico.problemas_identificados ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Problemas identificados:</strong> {diagnostico.problemas_identificados}</p> : null}
                <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Parecer consultivo:</strong> {diagnostico.parecer}</p>
                {diagnostico.pontos_fortes ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Pontos fortes:</strong> {diagnostico.pontos_fortes}</p> : null}
                {diagnostico.pontos_fracos ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Pontos fracos:</strong> {diagnostico.pontos_fracos}</p> : null}
                {diagnostico.recomendacoes ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>RecomendaÃƒÂ§ÃƒÂµes:</strong> {diagnostico.recomendacoes}</p> : null}
              </div>
            )) : <p className="text-sm text-stone-600">Nenhum diagnÃƒÂ³stico vinculado ainda.</p>}
          </div>
        </section>

        <section className="px-10 py-8">
          <SectionTitle number="3" title="Escopo e plano de aÃƒÂ§ÃƒÂ£o" colors={colors} />
          {proposta.descricao ? <p className="mb-5 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.descricao}</p> : null}
          <div className="grid gap-4">
            {planos.length ? planos.map((plano) => (
              <div className="avoid-break rounded-md border border-stone-200 p-5" key={plano.id}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold" style={{ color: colors.primaria }}>{plano.ordem}. {plano.titulo}</h3>
                  <span className="text-xs font-semibold" style={{ color: colors.secundaria }}>{STATUS_ACAO_LABELS[plano.status]}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-stone-700"><strong>O que serÃƒÂ¡ feito:</strong> {plano.descricao}</p>
                {plano.justificativa ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Justificativa:</strong> {plano.justificativa}</p> : null}
                {plano.resultado_esperado ? <p className="mt-2 text-sm leading-6 text-stone-700"><strong>Resultado esperado:</strong> {plano.resultado_esperado}</p> : null}
                <p className="mt-3 text-sm text-stone-600">ÃƒÂrea: {SETOR_LABELS[plano.setor]} | Prioridade: {plano.prioridade} | ResponsÃƒÂ¡vel: {plano.responsavel || 'A definir'} | Prazo: {formatDate(plano.prazo)}</p>
              </div>
            )) : <p className="text-sm text-stone-600">Nenhuma aÃƒÂ§ÃƒÂ£o planejada ainda.</p>}
          </div>
        </section>

        <section className="grid gap-6 px-10 py-8 md:grid-cols-2">
          <div>
            <SectionTitle number="4" title="Metodologia" colors={colors} />
            <p className="whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.metodologia || 'Metodologia a definir.'}</p>
          </div>
          <div>
            <SectionTitle number="5" title="Cronograma" colors={colors} />
            <p className="whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.cronograma || 'Cronograma a definir.'}</p>
          </div>
        </section>

        <section className="mx-10 my-8 rounded-md border p-6" style={{ backgroundColor: `${colors.destaque}22`, borderColor: colors.destaque }}>
          <SectionTitle number="6" title="Investimento e condiÃƒÂ§ÃƒÂµes comerciais" colors={colors} />
          <p className="text-3xl font-bold" style={{ color: colors.primaria }}>{money(proposta.valor)}</p><p className="mt-1 text-sm font-semibold text-stone-700">Investimento {tipoInvestimentoLabel(proposta.tipo_investimento).toLowerCase()}</p>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-stone-700">{proposta.condicoes_comerciais || 'CondiÃƒÂ§ÃƒÂµes comerciais a definir.'}</p>
          <div className="mt-5 grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
            <p><strong>Data de envio:</strong> {formatDate(proposta.data_envio)}</p>
            <p><strong>Validade:</strong> {formatDate(proposta.data_validade)}</p>
          </div>
        </section>

        <section className="grid gap-8 px-10 pb-12 pt-8 md:grid-cols-2">
          <div>
            <div className="mt-12 border-t border-stone-400 pt-3 text-sm text-stone-700">
              <p className="font-semibold" style={{ color: colors.primaria }}>{consultoriaNome}</p>
              <p>{config?.responsavel || 'ResponsÃƒÂ¡vel pela proposta'}</p>
            </div>
          </div>
          <div>
            <div className="mt-12 border-t border-stone-400 pt-3 text-sm text-stone-700">
              <p className="font-semibold" style={{ color: colors.primaria }}>{cliente?.nome || 'Empresa cliente'}</p>
              <p>Aceite da proposta</p>
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}