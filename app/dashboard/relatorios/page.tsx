import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto, Relatorio } from '@/lib/types'

export const dynamic = 'force-dynamic'

type ProjetoComEmpresa = Projeto & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }
type RelatorioComProjeto = Relatorio & { projetos?: Pick<Projeto, 'id' | 'nome'> & { empresas?: Pick<Empresa, 'id' | 'nome'> | null } }

export default async function RelatoriosPage() {
  const supabase = createClient()
  const [{ data: projetosData }, { data: relatoriosData }] = await Promise.all([
    supabase.from('projetos').select('*, empresas(id,nome)').order('criado_em', { ascending: false }),
    supabase.from('relatorios').select('*, projetos(id,nome, empresas(id,nome))').order('criado_em', { ascending: false }).limit(10),
  ])

  const projetos = (projetosData ?? []) as ProjetoComEmpresa[]
  const relatorios = (relatoriosData ?? []) as RelatorioComProjeto[]

  return (
    <>
      <PageHeader title="Relatórios" description="Escolha um projeto para ver indicadores, relatórios e cadastrar novos acompanhamentos." />
      {projetos.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projetos.map((projeto) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={`/dashboard/projetos/${projeto.id}/relatorios`} key={projeto.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{projeto.nome}</h3><p className="mt-1 text-sm text-stone-500">{projeto.empresas?.nome || 'Empresa'}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><p className="mt-4 text-sm text-stone-600">Acessar indicadores e relatórios do projeto.</p></Link>)}</section> : <EmptyState message="Nenhum projeto cadastrado. Crie um projeto a partir do dossiê da empresa." />}
      {relatorios.length ? <section className="mt-8"><h3 className="mb-4 text-lg font-bold text-brand-ink">Relatórios recentes</h3><div className="grid gap-4">{relatorios.map((relatorio) => <Link className="panel p-5 transition hover:bg-stone-50" href={relatorio.projetos?.id ? `/dashboard/projetos/${relatorio.projetos.id}/relatorios` : '/dashboard/relatorios'} key={relatorio.id}><h4 className="font-semibold text-brand-ink">{relatorio.titulo}</h4><p className="mt-1 text-sm text-stone-500">{relatorio.projetos?.empresas?.nome || 'Empresa'} · {relatorio.projetos?.nome || 'Projeto'}</p><p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-700">{relatorio.atividades_realizadas}</p></Link>)}</div></section> : null}
    </>
  )
}



