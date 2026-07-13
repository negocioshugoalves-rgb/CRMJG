import {
  BarChart3,
  Briefcase,
  Building2,
  ClipboardList,
  Download,
  FileText,
  ListChecks,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'

const etapas = [
  {
    title: '1. Empresas',
    icon: Building2,
    description:
      'Cadastre cada empresa cliente ou prospect com os dados principais de contato, segmento, porte e origem da prospeccao.',
    details: [
      'Esta etapa cria a base do relacionamento comercial.',
      'O status do funil mostra se a empresa esta em prospeccao, diagnostico, proposta, projeto ou encerrada.',
      'Os dados da empresa aparecem depois nas propostas, projetos e relatorios.',
      'Preencha com cuidado nome, CNPJ, contato responsavel, telefone, e-mail e observacoes importantes.',
    ],
  },
  {
    title: '2. Diagnostico empresarial',
    icon: ClipboardList,
    description:
      'Registre a analise das areas da empresa cliente, identificando situacao atual, problemas, pontos fortes, pontos fracos e recomendacoes.',
    details: [
      'Avalie areas como comercial, financeiro, RH, lideranca, processos, marketing, operacional, comunicacao e qualidade.',
      'Use o campo situacao atual para descrever como a empresa funciona hoje.',
      'Use problemas identificados para apontar gargalos, perdas, falhas, riscos e oportunidades.',
      'Defina a prioridade para separar o que e urgente do que pode ser tratado depois.',
      'O diagnostico e a justificativa tecnica para o plano de acao e para a proposta.',
    ],
  },
  {
    title: '3. Plano de acao',
    icon: ListChecks,
    description:
      'Transforme o diagnostico em acoes praticas, com etapas, responsaveis, prazos, prioridades e resultados esperados.',
    details: [
      'Cada acao deve responder: o que sera feito, por que sera feito, quem participa e qual resultado se espera.',
      'Organize as acoes em ordem logica para mostrar a sequencia da consultoria.',
      'Acoes bem descritas facilitam a aprovacao da proposta e a execucao do projeto.',
      'O plano de acao tambem ajuda o cliente a visualizar o valor da consultoria antes do investimento.',
    ],
  },
  {
    title: '4. Propostas',
    icon: FileText,
    description:
      'Monte a proposta consultiva reunindo resumo do diagnostico, escopo, plano de acao, metodologia, cronograma, investimento e condicoes comerciais.',
    details: [
      'A proposta deve explicar o problema, a solucao, o caminho de execucao e o investimento.',
      'Depois de salvar a proposta, ela aparece na lista da propria tela Propostas.',
      'Clique em Abrir PDF ou Baixar PDF para abrir a versao de apresentacao.',
      'Na tela do PDF, clique em Baixar proposta em PDF e escolha Salvar como PDF na janela de impressao.',
    ],
  },
  {
    title: '5. Projetos',
    icon: Briefcase,
    description:
      'Depois do aceite da proposta, crie um projeto para acompanhar a execucao do trabalho contratado.',
    details: [
      'Vincule o projeto a empresa e, quando possivel, a proposta aceita.',
      'Informe objetivo, data de inicio, previsao de termino e status.',
      'Esta etapa separa oportunidades comerciais de trabalhos em andamento.',
      'Tudo que for executado deve ser acompanhado depois em relatorios e indicadores.',
    ],
  },
  {
    title: '6. Relatorios e indicadores',
    icon: BarChart3,
    description:
      'Registre a evolucao do projeto com atividades realizadas, resultados obtidos, pontos de atencao, proximos passos e indicadores.',
    details: [
      'Cadastre indicadores com valor inicial, valor atual, meta e unidade de medida.',
      'Use os relatorios para prestar contas ao cliente durante a execucao da consultoria.',
      'Relatorios devem mostrar o que foi feito, o que melhorou, o que ainda exige atencao e qual sera o proximo passo.',
      'Compare os indicadores com o diagnostico inicial para demonstrar evolucao e impacto.',
    ],
  },
]

const exemplo = {
  empresa: 'Mercado Boa Safra Ltda.',
  segmento: 'Varejo alimenticio',
  contato: 'Mariana Alves, gerente administrativa',
  diagnosticos: [
    {
      area: 'Financeiro',
      problema: 'A empresa nao separa despesas fixas, variaveis e retiradas dos socios.',
      acao: 'Implantar fluxo de caixa semanal, classificacao de despesas e rotina de fechamento mensal.',
      indicador: 'Margem liquida: sair de 4% para 9% em 6 meses.',
    },
    {
      area: 'Comercial',
      problema: 'As vendas dependem de promocoes pontuais e nao ha acompanhamento de ticket medio.',
      acao: 'Criar metas por categoria, acompanhar ticket medio e treinar equipe para venda complementar.',
      indicador: 'Ticket medio: sair de R$ 42 para R$ 55.',
    },
    {
      area: 'Processos',
      problema: 'Compras e estoque sao controlados manualmente, gerando ruptura e excesso de produtos parados.',
      acao: 'Definir curva ABC, rotina de inventario e ponto de reposicao para itens principais.',
      indicador: 'Ruptura de estoque: reduzir de 18% para 6%.',
    },
  ],
}

export default function AjudaPage() {
  return (
    <>
      <PageHeader
        title="Ajuda"
        description="Entenda o fluxo completo do CRM e como cada etapa ajuda a conduzir a consultoria do primeiro contato ate os relatorios de resultado."
      />

      <section className="grid gap-4">
        {etapas.map((etapa) => {
          const Icon = etapa.icon
          return (
            <article className="panel p-5" key={etapa.title}>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-ink text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-ink">{etapa.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-700">{etapa.description}</p>
                  <ul className="mt-4 space-y-2">
                    {etapa.details.map((detail) => (
                      <li className="flex gap-2 text-sm leading-6 text-stone-600" key={detail}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      <section className="panel mt-6 p-5">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-brand-bronze" />
          <h3 className="text-lg font-bold text-brand-ink">Onde baixar o PDF da proposta</h3>
        </div>
        <ol className="mt-4 space-y-2 text-sm leading-6 text-stone-700">
          <li>1. Entre em Empresas e abra o dossie da empresa desejada. Depois acesse a aba Propostas.</li>
          <li>2. Cadastre ou localize a proposta dessa empresa.</li>
          <li>3. No card da proposta, clique em Abrir PDF ou Baixar PDF.</li>
          <li>4. Na pagina de PDF, clique em Baixar proposta em PDF.</li>
          <li>5. Na janela do navegador, selecione Salvar como PDF.</li>
        </ol>
      </section>

      <section className="panel mt-6 p-5">
        <h3 className="text-lg font-bold text-brand-ink">Exemplo completo de uso</h3>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Imagine que a consultoria esta atendendo a empresa ficticia <strong>{exemplo.empresa}</strong>,
          do segmento de {exemplo.segmento}. O contato responsavel e {exemplo.contato}.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {exemplo.diagnosticos.map((item) => (
            <article className="rounded-md border border-stone-200 bg-stone-50 p-4" key={item.area}>
              <h4 className="font-semibold text-brand-ink">{item.area}</h4>
              <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Diagnostico:</strong> {item.problema}</p>
              <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Plano de acao:</strong> {item.acao}</p>
              <p className="mt-3 text-sm leading-6 text-brand-bronze"><strong>Indicador:</strong> {item.indicador}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-md border border-brand-light bg-brand-paper p-4 text-sm leading-6 text-stone-700">
          <p><strong>Proposta:</strong> o CRM junta o resumo do diagnostico, as acoes acima, a metodologia, o cronograma de 6 meses e o investimento da consultoria.</p>
          <p className="mt-2"><strong>Projeto:</strong> depois do aceite, a proposta vira um projeto ativo chamado Reestruturacao Gerencial - Mercado Boa Safra.</p>
          <p className="mt-2"><strong>Relatorio:</strong> a cada mes, a consultoria registra o que foi executado, atualiza os indicadores e informa os proximos passos para a empresa cliente.</p>
        </div>
      </section>

      <section className="panel mt-6 p-5">
        <h3 className="text-lg font-bold text-brand-ink">Fluxo recomendado</h3>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Comece cadastrando a empresa e abrindo o dossie dela. Dentro desse dossie, registre o diagnostico por area, crie o plano
          de acao, monte a proposta em PDF e, apos o aceite, acompanhe tudo em
          projetos, relatorios e indicadores. Assim o CRM documenta tanto a venda
          quanto a entrega da consultoria.
        </p>
      </section>
    </>
  )
}

