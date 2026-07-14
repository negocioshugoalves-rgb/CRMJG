import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import type { Empresa, Projeto } from '@/lib/types'
import { createRelatorio } from '@/app/dashboard/relatorios/actions'

export const dynamic = 'force-dynamic'
type ProjetoCompleto = Projeto & { empresas?: Pick<Empresa, 'id' | 'nome'> | null }

export default async function NovoRelatorioPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('projetos').select('*, empresas(id,nome)').eq('id', params.id).single()
  if (!data) notFound()
  const projeto = data as ProjetoCompleto

  return (
    <>
      <PageHeader title={`Novo relatorio - ${projeto.nome}`} description="Registre atividades realizadas, resultados e proximos passos." />
      <form action={createRelatorio} className="document-page space-y-6">
        <input type="hidden" name="projeto_id" value={projeto.id} />
        <div className="space-y-1.5"><label className="label" htmlFor="titulo">Título</label><input className="document-field" id="titulo" name="titulo" required /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-1.5"><label className="label" htmlFor="periodo_inicio">Início</label><input className="document-field" id="periodo_inicio" name="periodo_inicio" type="date" /></div><div className="space-y-1.5"><label className="label" htmlFor="periodo_fim">Fim</label><input className="document-field" id="periodo_fim" name="periodo_fim" type="date" /></div></div>
        <div className="space-y-1.5"><label className="label" htmlFor="atividades_realizadas">Atividades realizadas</label><textarea className="document-field min-h-48" id="atividades_realizadas" name="atividades_realizadas" required /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="resultados_obtidos">Resultados obtidos</label><textarea className="document-field min-h-40" id="resultados_obtidos" name="resultados_obtidos" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="pontos_atencao">Pontos de atenção</label><textarea className="document-field min-h-40" id="pontos_atencao" name="pontos_atencao" /></div>
        <div className="space-y-1.5"><label className="label" htmlFor="proximos_passos">Próximos passos</label><textarea className="document-field min-h-40" id="proximos_passos" name="proximos_passos" /></div>
        <div className="flex flex-col gap-3 sm:flex-row"><button className="btn-primary" type="submit">Salvar relatorio</button><Link className="btn-secondary" href={`/dashboard/projetos/${projeto.id}/relatorios`}>Cancelar</Link></div>
      </form>
    </>
  )
}

