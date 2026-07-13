import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  ClipboardList,
  FileText,
  ListChecks,
  MessageSquare,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { STATUS_FUNIL_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa } from '@/lib/types'

export const dynamic = 'force-dynamic'

const sections = [
  {
    href: 'diagnostico',
    title: 'Diagnostico',
    description: 'Analise das areas da empresa, problemas e recomendacoes.',
    icon: ClipboardList,
  },
  {
    href: 'plano-acao',
    title: 'Plano de acao',
    description: 'Acoes propostas, prioridades, prazos e resultados esperados.',
    icon: ListChecks,
  },
  {
    href: 'propostas',
    title: 'Propostas',
    description: 'Documentos comerciais e versao pronta para salvar em PDF.',
    icon: FileText,
  },
  {
    href: 'projetos',
    title: 'Projetos',
    description: 'Trabalhos aceitos e em execucao para esta empresa.',
    icon: Briefcase,
  },
  {
    href: 'interacoes',
    title: 'Interacoes',
    description: 'Historico de contatos, reunioes e follow-ups.',
    icon: MessageSquare,
  },
  {
    href: '/dashboard/relatorios',
    title: 'Relatorios',
    description: 'Acompanhamento dos projetos com indicadores.',
    icon: BarChart3,
    absolute: true,
  },
]

async function countRows(table: string, empresaId: string) {
  const supabase = createClient()
  const { count } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('empresa_id', empresaId)

  return count ?? 0
}

export default async function EmpresaDetalhePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('empresas').select('*').eq('id', params.id).single()

  if (!data) notFound()

  const empresa = data as Empresa
  const [diagnosticos, planos, propostas, projetos, interacoes] = await Promise.all([
    countRows('diagnosticos', empresa.id),
    countRows('planos_acao', empresa.id),
    countRows('propostas', empresa.id),
    countRows('projetos', empresa.id),
    countRows('interacoes', empresa.id),
  ])

  const counters = [
    { label: 'Diagnosticos', value: diagnosticos },
    { label: 'Acoes', value: planos },
    { label: 'Propostas', value: propostas },
    { label: 'Projetos', value: projetos },
    { label: 'Interacoes', value: interacoes },
  ]

  return (
    <>
      <PageHeader
        title={empresa.nome}
        description="Dossie da empresa com todo o processo consultivo organizado por etapa."
      />

      <section className="panel p-5">
        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="label">Empresa</p>
            <p className="mt-1 font-semibold text-brand-ink">{empresa.nome}</p>
            <p className="text-sm text-stone-500">{empresa.cnpj}</p>
          </div>
          <div>
            <p className="label">Contato</p>
            <p className="mt-1 font-semibold text-brand-ink">{empresa.contato_nome}</p>
            <p className="text-sm text-stone-500">
              {empresa.contato_email || empresa.contato_telefone || '-'}
            </p>
          </div>
          <div>
            <p className="label">Status</p>
            <span className="mt-2 inline-flex rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">
              {STATUS_FUNIL_LABELS[empresa.status_funil]}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {counters.map((item) => (
          <div className="panel p-4" key={item.label}>
            <p className="text-sm text-stone-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-brand-ink">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon
          const href = section.absolute
            ? section.href
            : `/dashboard/empresas/${empresa.id}/${section.href}`

          return (
            <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={href} key={section.title}>
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-brand-bronze" />
                <ArrowRight className="h-4 w-4 text-stone-400" />
              </div>
              <h3 className="mt-5 font-semibold text-brand-ink">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{section.description}</p>
            </Link>
          )
        })}
      </section>
    </>
  )
}
