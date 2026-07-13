import { PageHeader } from '@/components/page-header'

const passos = [
  'Cadastre uma empresa em Empresas.',
  'Registre os pareceres por setor em Diagnosticos.',
  'Monte uma proposta vinculada a empresa.',
  'Acompanhe contatos e follow-ups em Interacoes.',
]

export default function AjudaPage() {
  return (
    <>
      <PageHeader
        title="Ajuda"
        description="Fluxo recomendado para usar o CRM no processo comercial da JG Represent."
      />

      <section className="panel p-5">
        <ol className="space-y-4">
          {passos.map((passo, index) => (
            <li className="flex gap-4" key={passo}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-ink text-sm font-bold text-white">
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-6 text-stone-700">{passo}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
