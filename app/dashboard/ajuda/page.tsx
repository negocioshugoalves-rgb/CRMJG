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
      'Cadastre cada empresa cliente ou prospect com os dados principais de contato, segmento, porte e origem da prospecção.',
    details: [
      'Esta etapa cria a base do relacionamento comercial.',
      'O status do funil mostra se a empresa está em prospecção, diagnóstico, proposta, projeto ou encerrada.',
      'Os dados da empresa aparecem depois nas propostas, projetos e relatórios.',
      'Preencha com cuidado nome, CNPJ, contato responsável, telefone, e-mail e observações importantes.',
    ],
  },
  {
    title: '2. Diagnóstico empresarial',
    icon: ClipboardList,
    description:
      'Registre a análise das áreas da empresa cliente, identificando situação atual, problemas, pontos fortes, pontos fracos e recomendações.',
    details: [
      'Avalie áreas como comercial, financeiro, RH, liderança, processos, marketing, operacional, comunicação e qualidade.',
      'Use o campo situação atual para descrever como a empresa funciona hoje.',
      'Use problemas identificados para apontar gargalos, perdas, falhas, riscos e oportunidades.',
      'Defina a prioridade para separar o que é urgente do que pode ser tratado depois.',
      'O diagnóstico é a justificativa técnica para o plano de ação e para a proposta.',
    ],
  },
  {
    title: '3. Plano de ação',
    icon: ListChecks,
    description:
      'Transforme o diagnóstico em ações práticas, com etapas, responsáveis, prazos, prioridades e resultados esperados.',
    details: [
      'Cada ação deve responder: o que será feito, por que será feito, quem participa e qual resultado se espera.',
      'Organize as ações em ordem lógica para mostrar a sequência da consultoria.',
      'Ações bem descritas facilitam a aprovação da proposta e a execução do projeto.',
      'O plano de ação também ajuda o cliente a visualizar o valor da consultoria antes do investimento.',
    ],
  },
  {
    title: '4. Propostas',
    icon: FileText,
    description:
      'Monte a proposta consultiva reunindo resumo do diagnóstico, escopo, plano de ação, metodologia, cronograma, investimento e condições comerciais.',
    details: [
      'A proposta deve explicar o problema, a solução, o caminho de execução e o investimento.',
      'Depois de salvar a proposta, ela aparece na lista da própria tela Propostas.',
      'Clique em Abrir PDF ou Baixar PDF para abrir a versão de apresentação.',
      'Na tela do PDF, clique em Baixar proposta em PDF e escolha Salvar como PDF na janela de impressão.',
    ],
  },
  {
    title: '5. Projetos',
    icon: Briefcase,
    description:
      'Depois do aceite da proposta, crie um projeto para acompanhar a execução do trabalho contratado.',
    details: [
      'Vincule o projeto à empresa e, quando possível, à proposta aceita.',
      'Informe objetivo, data de início, previsão de término e status.',
      'Esta etapa separa oportunidades comerciais de trabalhos em andamento.',
      'Tudo que for executado deve ser acompanhado depois em relatórios e indicadores.',
    ],
  },
  {
    title: '6. Relatórios e indicadores',
    icon: BarChart3,
    description:
      'Registre a evolução do projeto com atividades realizadas, resultados obtidos, pontos de atenção, próximos passos e indicadores.',
    details: [
      'Cadastre indicadores com valor inicial, valor atual, meta e unidade de medida.',
      'Use os relatórios para prestar contas ao cliente durante a execução da consultoria.',
      'Relatórios devem mostrar o que foi feito, o que melhorou, o que ainda exige atenção e qual será o próximo passo.',
      'Compare os indicadores com o diagnóstico inicial para demonstrar evolução e impacto.',
    ],
  },
]

const exemplo = {
  empresa: 'Mercado Boa Safra Ltda.',
  segmento: 'Varejo alimentício',
  contato: 'Mariana Alves, gerente administrativa',
  diagnosticos: [
    {
      area: 'Financeiro',
      problema: 'A empresa não separa despesas fixas, variáveis e retiradas dos sócios.',
      acao: 'Implantar fluxo de caixa semanal, classificação de despesas e rotina de fechamento mensal.',
      indicador: 'Margem líquida: sair de 4% para 9% em 6 meses.',
    },
    {
      area: 'Comercial',
      problema: 'As vendas dependem de promoções pontuais e não há acompanhamento de ticket médio.',
      acao: 'Criar metas por categoria, acompanhar ticket médio e treinar equipe para venda complementar.',
      indicador: 'Ticket médio: sair de R$ 42 para R$ 55.',
    },
    {
      area: 'Processos',
      problema: 'Compras e estoque são controlados manualmente, gerando ruptura e excesso de produtos parados.',
      acao: 'Definir curva ABC, rotina de inventário e ponto de reposição para itens principais.',
      indicador: 'Ruptura de estoque: reduzir de 18% para 6%.',
    },
  ],
}

export default function AjudaPage() {
  return (
    <>
      <PageHeader
        title="Ajuda"
        description="Entenda o fluxo completo do CRM e como cada etapa ajuda a conduzir a consultoria do primeiro contato até os relatórios de resultado."
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
          <li>1. Entre em Empresas e abra o dossiê da empresa desejada. Depois acesse a aba Propostas.</li>
          <li>2. Cadastre ou localize a proposta dessa empresa.</li>
          <li>3. No card da proposta, clique em Abrir PDF ou Baixar PDF.</li>
          <li>4. Na página de PDF, clique em Baixar proposta em PDF.</li>
          <li>5. Na janela do navegador, selecione Salvar como PDF.</li>
        </ol>
      </section>

      <section className="panel mt-6 p-5">
        <h3 className="text-lg font-bold text-brand-ink">Exemplo completo de uso</h3>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Imagine que a consultoria está atendendo a empresa fictícia <strong>{exemplo.empresa}</strong>,
          do segmento de {exemplo.segmento}. O contato responsável é {exemplo.contato}.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {exemplo.diagnosticos.map((item) => (
            <article className="rounded-md border border-stone-200 bg-stone-50 p-4" key={item.area}>
              <h4 className="font-semibold text-brand-ink">{item.area}</h4>
              <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Diagnóstico:</strong> {item.problema}</p>
              <p className="mt-3 text-sm leading-6 text-stone-700"><strong>Plano de ação:</strong> {item.acao}</p>
              <p className="mt-3 text-sm leading-6 text-brand-bronze"><strong>Indicador:</strong> {item.indicador}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 rounded-md border border-brand-light bg-brand-paper p-4 text-sm leading-6 text-stone-700">
          <p><strong>Proposta:</strong> o CRM junta o resumo do diagnóstico, as ações acima, a metodologia, o cronograma de 6 meses e o investimento da consultoria.</p>
          <p className="mt-2"><strong>Projeto:</strong> depois do aceite, a proposta vira um projeto ativo chamado Reestruturação Gerencial - Mercado Boa Safra.</p>
          <p className="mt-2"><strong>Relatório:</strong> a cada mês, a consultoria registra o que foi executado, atualiza os indicadores e informa os próximos passos para a empresa cliente.</p>
        </div>
      </section>

      <section className="panel mt-6 p-5">
        <h3 className="text-lg font-bold text-brand-ink">Fluxo recomendado</h3>
        <p className="mt-3 text-sm leading-6 text-stone-700">
          Comece cadastrando a empresa e abrindo o dossiê dela. Dentro desse dossiê, registre o diagnóstico por área, crie o plano
          de ação, monte a proposta em PDF e, após o aceite, acompanhe tudo em
          projetos, relatórios e indicadores. Assim o CRM documenta tanto a venda
          quanto a entrega da consultoria.
        </p>
      </section>
    </>
  )
}
