import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Interacao } from '@/lib/types'

export const dynamic = 'force-dynamic'

type InteracaoComEmpresa = Interacao & { empresas?: Pick<Empresa, 'id' | 'nome' | 'segmento'> | null }

type GrupoInteracao = {
  empresa: Pick<Empresa, 'id' | 'nome' | 'segmento'>
  total: number
  ultimaData: string
  ultimoTipo: string
  ultimaDescricao: string
  proximoFollowup: string | null
}

function agruparPorEmpresa(interacoes: InteracaoComEmpresa[]) {
  const grupos = new Map<string, GrupoInteracao>()

  interacoes.forEach((interacao) => {
    if (!interacao.empresas?.id) return
    const atual = grupos.get(interacao.empresas.id)

    if (!atual) {
      grupos.set(interacao.empresas.id, {
        empresa: interacao.empresas,
        total: 1,
        ultimaData: interacao.data,
        ultimoTipo: interacao.tipo,
        ultimaDescricao: interacao.descricao,
        proximoFollowup: interacao.proximo_followup,
      })
      return
    }

    atual.total += 1
    if (new Date(interacao.data) > new Date(atual.ultimaData)) {
      atual.ultimaData = interacao.data
      atual.ultimoTipo = interacao.tipo
      atual.ultimaDescricao = interacao.descricao
    }
    if (!atual.proximoFollowup || (interacao.proximo_followup && interacao.proximo_followup < atual.proximoFollowup)) atual.proximoFollowup = interacao.proximo_followup
  })

  return Array.from(grupos.values())
}

export default async function InteracoesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('interacoes')
    .select('*, empresas(id,nome,segmento)')
    .order('data', { ascending: false })

  const grupos = agruparPorEmpresa((data ?? []) as InteracaoComEmpresa[])

  return (
    <>
      <PageHeader title="Interações" description="Uma visão por empresa. Clique no card para abrir todo o histórico de contatos do dossiê." />
      <div className="mb-6 flex justify-end"><Link className="btn-primary" href="/dashboard/interacoes/novo"><Plus className="h-4 w-4" /> Nova interação</Link></div>
      {grupos.length ? <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{grupos.map((grupo) => <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-md" href={`/dashboard/empresas/${grupo.empresa.id}/interacoes`} key={grupo.empresa.id}><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-brand-ink">{grupo.empresa.nome}</h3><p className="mt-1 text-sm text-stone-500">{grupo.empresa.segmento}</p></div><ArrowRight className="h-4 w-4 text-stone-400" /></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-brand-paper px-3 py-1 text-xs font-semibold text-brand-bronze">{grupo.total} interação{grupo.total === 1 ? '' : 'es'}</span><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold capitalize text-stone-700">Última: {grupo.ultimoTipo}</span></div><p className="mt-4 text-sm text-stone-500">{new Date(grupo.ultimaData).toLocaleString('pt-BR')}</p><p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-700">{grupo.ultimaDescricao}</p>{grupo.proximoFollowup ? <p className="mt-3 text-sm font-semibold text-brand-bronze">Próximo follow-up: {grupo.proximoFollowup}</p> : null}</Link>)}</section> : <EmptyState message="Nenhuma interação cadastrada. Registre o primeiro contato." />}
    </>
  )
}
