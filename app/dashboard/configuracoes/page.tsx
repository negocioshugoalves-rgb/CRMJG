import { PageHeader } from '@/components/page-header'
import { createClient } from '@/lib/supabase/server'
import { salvarConfiguracaoEmpresa } from './actions'

export const dynamic = 'force-dynamic'

type ConfiguracaoEmpresa = {
  nome_fantasia: string | null
  razao_social: string | null
  cnpj: string | null
  endereco: string | null
  cidade_estado: string | null
  telefone: string | null
  email: string | null
  site: string | null
  responsavel: string | null
  cargo_responsavel: string | null
  logo_url: string | null
  descricao: string | null
}

export default async function ConfiguracoesPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('configuracoes_empresa')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  const config = (data ?? {}) as Partial<ConfiguracaoEmpresa>

  return (
    <>
      <PageHeader
        title="Configuracoes"
        description="Cadastre os dados da empresa consultora que aparecerao nas propostas comerciais em PDF."
      />

      <form action={salvarConfiguracaoEmpresa} className="document-page space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-brand-ink">Empresa consultora</h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Essas informacoes identificam quem esta enviando a proposta para o cliente.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><label className="label" htmlFor="nome_fantasia">Nome fantasia</label><input className="document-field" id="nome_fantasia" name="nome_fantasia" defaultValue={config.nome_fantasia ?? ''} required /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="razao_social">Razao social</label><input className="document-field" id="razao_social" name="razao_social" defaultValue={config.razao_social ?? ''} /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="cnpj">CNPJ</label><input className="document-field" id="cnpj" name="cnpj" defaultValue={config.cnpj ?? ''} /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="telefone">Telefone</label><input className="document-field" id="telefone" name="telefone" defaultValue={config.telefone ?? ''} /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="email">E-mail</label><input className="document-field" id="email" name="email" type="email" defaultValue={config.email ?? ''} /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="site">Site</label><input className="document-field" id="site" name="site" defaultValue={config.site ?? ''} /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="responsavel">Responsavel pela proposta</label><input className="document-field" id="responsavel" name="responsavel" defaultValue={config.responsavel ?? ''} /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="cargo_responsavel">Cargo do responsavel</label><input className="document-field" id="cargo_responsavel" name="cargo_responsavel" defaultValue={config.cargo_responsavel ?? ''} /></div>
          <div className="space-y-1.5 sm:col-span-2"><label className="label" htmlFor="endereco">Endereco</label><input className="document-field" id="endereco" name="endereco" defaultValue={config.endereco ?? ''} /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="cidade_estado">Cidade / Estado</label><input className="document-field" id="cidade_estado" name="cidade_estado" defaultValue={config.cidade_estado ?? ''} /></div>
          <div className="space-y-1.5"><label className="label" htmlFor="logo_url">URL do logo</label><input className="document-field" id="logo_url" name="logo_url" defaultValue={config.logo_url ?? ''} /></div>
        </div>

        <div className="space-y-1.5">
          <label className="label" htmlFor="descricao">Apresentacao curta da consultoria</label>
          <textarea className="document-field min-h-36" id="descricao" name="descricao" defaultValue={config.descricao ?? ''} />
        </div>

        <button className="btn-primary" type="submit">Salvar configuracoes</button>
      </form>
    </>
  )
}
