import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { CompanyNav } from '@/components/company-nav'
import { PageHeader } from '@/components/page-header'
import { STATUS_PROJETO_LABELS } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto, Proposta } from '@/lib/types'
import { updateProjetoStatus } from '../actions'

export const dynamic = 'force-dynamic'

type ProjetoCompleto = Projeto & { propostas?: Pick<Proposta, 'titulo'> | null }

export default async function ProjetoDetalhePage({ params }: { params: { id: string; projetoId: string } }) {
  const supabase = createClient()
  const [{ data: empresaData }, { data: projetoData }] = await Promise.all([
    supabase.from('empresas').select('*').eq('id', params.id).single(),
    supabase.from('projetos').select('*, propostas(titulo)').eq('id', params.projetoId).eq('empresa_id', params.id).single(),
  ])
  if (!empresaData || !projetoData) notFound()
  const empresa = empresaData as Empresa
  const projeto = projetoData as ProjetoCompleto

  return (
    <>
      <PageHeader title={projeto.nome} description={`Projeto de ${empresa.nome}.`} />
      <CompanyNav empresaId={empresa.id} />
      <article className="document-page space-y-6"><div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{STATUS_PROJETO_LABELS[projeto.status]}</span><form action={updateProjetoStatus}><input type="hidden" name="empresa_id" value={empresa.id} /><input type="hidden" name="projeto_id" value={projeto.id} /><input type="hidden" name="status" value="ativo" /><button className="btn-secondary" type="submit">Marcar ativo</button></form><form action={updateProjetoStatus}><input type="hidden" name="empresa_id" value={empresa.id} /><input type="hidden" name="projeto_id" value={projeto.id} /><input type="hidden" name="status" value="concluido" /><button className="btn-secondary" type="submit">Marcar finalizado</button></form><Link className="btn-primary" href={`/dashboard/projetos/${projeto.id}/relatorios`}><BarChart3 className="h-4 w-4" /> Relatórios</Link></div>{projeto.objetivo ? <section><h3 className="font-semibold text-brand-ink">Objetivo</h3><p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-700">{projeto.objetivo}</p></section> : null}<div className="grid gap-4 sm:grid-cols-3"><div><p className="label">Proposta</p><p className="mt-1 text-sm text-stone-700">{projeto.propostas?.titulo || '-'}</p></div><div><p className="label">Início</p><p className="mt-1 text-sm text-stone-700">{projeto.data_inicio || '-'}</p></div><div><p className="label">Fim previsto</p><p className="mt-1 text-sm text-stone-700">{projeto.data_fim_prevista || '-'}</p></div></div><Link className="btn-secondary w-fit" href={`/dashboard/empresas/${empresa.id}/projetos`}>Voltar</Link></article>
    </>
  )
}

