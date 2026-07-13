import Link from 'next/link'
import { ArrowRight, FileDown, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROPOSTA_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Proposta } from '@/lib/types'

export const dynamic = 'force-dynamic'

type PropostaComEmpresa = Proposta & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

export default async function PropostasPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('propostas')
    .select('*, empresas(id,nome)')
    .order('criado_em', { ascending: false })

  const propostas = (data ?? []) as PropostaComEmpresa[]

  return (
    <>
      <PageHeader title="Propostas" description="Documentos comerciais gerados a partir do diagnostico e do plano de acao." />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href="/dashboard/propostas/novo"><Plus className="h-4 w-4" /> Nova proposta</Link></div>
      {propostas.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{propostas.map((proposta) => <article className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" key={proposta.id}><Link href={proposta.empresas?.id ? `/dashboard/empresas/${proposta.empresas.id}/propostas/${proposta.id}` : '/dashboard/empresas'}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{proposta.titulo}</h3><p className="mt-1 text-sm text-stone-500">{proposta.empresas?.nome || 'Empresa'}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><span className="mt-4 inline-flex rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_PROPOSTA_LABELS[proposta.status]}</span>{proposta.resumo_diagnostico ? <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">{proposta.resumo_diagnostico}</p> : null}<div className="mt-4 text-sm text-stone-600"><p>Investimento: {proposta.valor ? proposta.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</p><p>Validade: {proposta.data_validade || '-'}</p></div></Link><Link className="btn-secondary mt-4 w-fit" href={`/dashboard/propostas/${proposta.id}/pdf`} target="_blank"><FileDown className="h-4 w-4" /> Baixar PDF</Link></article>)}</section> : <EmptyState message="Nenhuma proposta cadastrada ainda." />}
    </>
  )
}
