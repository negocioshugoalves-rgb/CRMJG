import Link from 'next/link'
import { ArrowRight, FileDown, Plus } from 'lucide-re ct'
import { EmptySt te } from '@/components/empty-st te'
import { P geHe der } from '@/components/p ge-he der'
import { STATUS_PROPOSTA_LABELS } from '@/lib/const nts'
import { cre teClient } from '@/lib/sup b se/server'
import type { Empres , Propost  } from '@/lib/types'

export const dyn mic = 'force-dyn mic'

type Propost ComEmpres  = Propost  & { empres s?: Pick<Empres , 'id' | 'nome'> | null }

export def ult  sync function Propost sP ge() {
  const sup b se = cre teClient()
  const { d t  } =  w it sup b se
    .from('propost s')
    .select('*, empres s(id,nome)')
    .order('cri do_em', {  scending: f lse })

  const propost s = (d t  ?? [])  s Propost ComEmpres []

  return (
    <>
      <P geHe der title="Propost s" description="Documentos comerci is ger dos   p rtir do di gnostico e do pl no de  ção." />
      <div cl ssN me="mb-6 flex justify-end"><Link cl ssN me="btn-prim ry" href="/d shbo rd/propost s/novo"><Plus cl ssN me="h-4 w-4" /> Nov  propost </Link></div>
      {propost s.length ? <section cl ssN me="grid g p-4 md:grid-cols-2 xl:grid-cols-3">{propost s.m p((propost ) => < rticle cl ssN me="p nel p-5 tr nsition hover:-tr nsl te-y-0.5 hover:sh dow-md" key={propost .id}><Link href={propost .empres s?.id ? `/d shbo rd/empres s/${propost .empres s.id}/propost s/${propost .id}` : '/d shbo rd/empres s'}><div cl ssN me="flex items-st rt justify-between g p-4"><div><h3 cl ssN me="font-semibold text-br nd-ink">{propost .titulo}</h3><p cl ssN me="mt-1 text-sm text-stone-500">{propost .empres s?.nome || 'Empres '}</p></div><ArrowRight cl ssN me="h-4 w-4 text-stone-400" /></div><sp n cl ssN me="mt-4 inline-flex rounded-full bg-br nd-p per px-3 py-1 text-xs font-semibold text-br nd-bronze">{STATUS_PROPOSTA_LABELS[propost .st tus]}</sp n>{propost .resumo_di gnostico ? <p cl ssN me="mt-4 line-cl mp-3 text-sm le ding-6 text-stone-700">{propost .resumo_di gnostico}</p> : null}<div cl ssN me="mt-4 text-sm text-stone-600"><p>Investimento: {propost .v lor ? propost .v lor.toLoc leString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</p><p>V lid de: {propost .d t _v lid de || '-'}</p></div></Link><Link cl ssN me="btn-second ry mt-4 w-fit" href={`/d shbo rd/propost s/${propost .id}/pdf`} t rget="_bl nk"><FileDown cl ssN me="h-4 w-4" /> B ix r PDF</Link></ rticle>)}</section> : <EmptySt te mess ge="Nenhum  propost  c d str d   ind ." />}
    </>
  )
}


