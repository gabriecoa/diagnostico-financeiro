// Dados estruturados do questionário
const QUESTIONNAIRE_DATA = {
    sections: [
        {
            id: 1,
            title: "Benefícios Corporativos",
            description: "Vamos avaliar a necessidade de implementação ou melhoria de benefícios para seus funcionários.",
            questions: [
                {
                    id: "funcionarios",
                    text: "Quantos funcionários a empresa possui?",
                    type: "radio",
                    options: [
                        { value: "menos_10", text: "Menos de 10" },
                        { value: "10_50", text: "10 a 50" },
                        { value: "mais_50", text: "Mais de 50" }
                    ],
                    required: true
                },
                {
                    id: "turnover",
                    text: "Qual é a taxa de turnover anual da empresa?",
                    type: "radio",
                    options: [
                        { value: "menos_5", text: "Menos de 5%" },
                        { value: "5_10", text: "5% a 10%" },
                        { value: "mais_10", text: "Mais de 10%" }
                    ],
                    required: true
                },
                {
                    id: "plano_saude",
                    text: "A empresa oferece plano de saúde?",
                    type: "radio",
                    options: [
                        { value: "completo", text: "Sim, completo" },
                        { value: "basico", text: "Sim, básico" },
                        { value: "nao", text: "Não oferece" }
                    ],
                    required: true
                },
                {
                    id: "previdencia",
                    text: "A empresa oferece plano de previdência privada?",
                    type: "radio",
                    options: [
                        { value: "sim", text: "Sim" },
                        { value: "nao", text: "Não" }
                    ],
                    required: true
                },
                {
                    id: "reclamacoes",
                    text: "Há reclamações frequentes sobre benefícios?",
                    type: "radio",
                    options: [
                        { value: "frequentes", text: "Sim, frequentes" },
                        { value: "ocasionais", text: "Ocasionais" },
                        { value: "nao", text: "Não há reclamações" }
                    ],
                    required: true
                }
            ],
            classification: {
                alta: {
                    conditions: [
                        { field: "funcionarios", values: ["mais_50"] },
                        { field: "turnover", values: ["mais_10"] },
                        { field: "plano_saude", values: ["nao"] },
                        { field: "reclamacoes", values: ["frequentes"] }
                    ],
                    operator: "OR"
                },
                media: {
                    conditions: [
                        { field: "funcionarios", values: ["10_50"] },
                        { field: "plano_saude", values: ["basico"] },
                        { field: "reclamacoes", values: ["ocasionais"] }
                    ],
                    operator: "OR"
                }
            },
            recommendations: {
                alta: "Priorize implementação de planos de saúde e previdência. Considere benefícios flexíveis para reduzir turnover.",
                media: "Avalie expansão dos benefícios atuais e pesquise satisfação dos funcionários.",
                baixa: "Mantenha os benefícios atuais e monitore satisfação anualmente."
            }
        },
        {
            id: 2,
            title: "Seguros em Geral",
            description: "Vamos identificar suas necessidades de proteção patrimonial e de responsabilidade civil.",
            questions: [
                {
                    id: "ativos",
                    text: "Qual o valor estimado dos ativos da empresa?",
                    type: "radio",
                    options: [
                        { value: "ate_100k", text: "Até R$ 100.000" },
                        { value: "100k_500k", text: "R$ 100.001 a R$ 500.000" },
                        { value: "mais_500k", text: "Mais de R$ 500.000" }
                    ],
                    required: true
                },
                {
                    id: "sinistros",
                    text: "A empresa já teve sinistros nos últimos 3 anos?",
                    type: "radio",
                    options: [
                        { value: "multiplos", text: "Sim, múltiplos" },
                        { value: "poucos", text: "Sim, um ou dois" },
                        { value: "nao", text: "Não" }
                    ],
                    required: true
                },
                {
                    id: "setor",
                    text: "Qual o setor de atuação da empresa?",
                    type: "radio",
                    options: [
                        { value: "alto_risco", text: "Alto risco (construção, química, etc.)" },
                        { value: "medio_risco", text: "Médio risco (comércio, serviços)" },
                        { value: "baixo_risco", text: "Baixo risco (consultoria, TI)" }
                    ],
                    required: true
                },
                {
                    id: "seguros_atuais",
                    text: "A empresa possui seguros atualmente?",
                    type: "radio",
                    options: [
                        { value: "completa", text: "Sim, cobertura completa" },
                        { value: "basica", text: "Sim, cobertura básica" },
                        { value: "nao", text: "Não possui" }
                    ],
                    required: true
                },
                {
                    id: "riscos_cyber",
                    text: "Há exposição a riscos cibernéticos?",
                    type: "radio",
                    options: [
                        { value: "alta", text: "Alta (dados sensíveis, e-commerce)" },
                        { value: "media", text: "Média (sistemas internos)" },
                        { value: "baixa", text: "Baixa (operação offline)" }
                    ],
                    required: true
                }
            ],
            classification: {
                alta: {
                    conditions: [
                        { field: "ativos", values: ["mais_500k"] },
                        { field: "sinistros", values: ["multiplos", "poucos"] },
                        { field: "setor", values: ["alto_risco"] },
                        { field: "seguros_atuais", values: ["nao"] }
                    ],
                    operator: "OR"
                },
                media: {
                    conditions: [
                        { field: "ativos", values: ["100k_500k"] },
                        { field: "seguros_atuais", values: ["basica"] },
                        { field: "setor", values: ["medio_risco"] }
                    ],
                    operator: "OR"
                }
            },
            recommendations: {
                alta: "Implemente seguros personalizados urgentemente. Priorize responsabilidade civil e patrimonial.",
                media: "Revise coberturas atuais e considere seguros específicos para seu setor.",
                baixa: "Mantenha seguros atuais e revise anualmente as coberturas."
            }
        },
        {
            id: 3,
            title: "Consórcio",
            description: "Vamos avaliar a viabilidade de aquisição de bens através de consórcio.",
            questions: [
                {
                    id: "frota",
                    text: "A empresa possui frota de veículos?",
                    type: "radio",
                    options: [
                        { value: "mais_5", text: "Sim, mais de 5 veículos" },
                        { value: "1_5", text: "Sim, 1 a 5 veículos" },
                        { value: "nao", text: "Não possui" }
                    ],
                    required: true
                },
                {
                    id: "aquisicao",
                    text: "Como a empresa adquire veículos/equipamentos?",
                    type: "radio",
                    options: [
                        { value: "financiamento", text: "Financiamento bancário" },
                        { value: "vista", text: "À vista" },
                        { value: "leasing", text: "Leasing" },
                        { value: "nao_adquire", text: "Não adquire" }
                    ],
                    required: true
                },
                {
                    id: "expansao",
                    text: "Há planos de expansão da frota nos próximos 2 anos?",
                    type: "radio",
                    options: [
                        { value: "significativa", text: "Sim, expansão significativa" },
                        { value: "parcial", text: "Sim, renovação parcial" },
                        { value: "nao", text: "Não há planos" }
                    ],
                    required: true
                },
                {
                    id: "restricoes_credito",
                    text: "A empresa tem restrições de crédito?",
                    type: "radio",
                    options: [
                        { value: "significativas", text: "Sim, significativas" },
                        { value: "algumas", text: "Sim, algumas" },
                        { value: "nao", text: "Não tem restrições" }
                    ],
                    required: true
                },
                {
                    id: "fluxo_caixa",
                    text: "Qual a importância do fluxo de caixa na decisão de compra?",
                    type: "radio",
                    options: [
                        { value: "muito_importante", text: "Muito importante" },
                        { value: "importante", text: "Importante" },
                        { value: "pouco_importante", text: "Pouco importante" }
                    ],
                    required: true
                }
            ],
            classification: {
                alta: {
                    conditions: [
                        { field: "frota", values: ["mais_5"] },
                        { field: "expansao", values: ["significativa", "parcial"] },
                        { field: "restricoes_credito", values: ["significativas", "algumas"] }
                    ],
                    operator: "OR"
                },
                media: {
                    conditions: [
                        { field: "frota", values: ["1_5"] },
                        { field: "expansao", values: ["parcial"] },
                        { field: "restricoes_credito", values: ["algumas"] }
                    ],
                    operator: "OR"
                }
            },
            recommendations: {
                alta: "Consórcios são ideais para PMEs com restrições de crédito. Considere para renovação da frota.",
                media: "Avalie consórcios como alternativa ao financiamento tradicional.",
                baixa: "Mantenha método atual de aquisição, monitore oportunidades."
            }
        },
        {
            id: 4,
            title: "Câmbio",
            description: "Vamos identificar sua exposição cambial e necessidade de proteção (hedge).",
            questions: [
                {
                    id: "faturamento_internacional",
                    text: "Qual percentual do faturamento vem de operações internacionais?",
                    type: "radio",
                    options: [
                        { value: "mais_20", text: "Mais de 20%" },
                        { value: "5_20", text: "5% a 20%" },
                        { value: "menos_5", text: "Menos de 5%" },
                        { value: "zero", text: "0% (apenas nacional)" }
                    ],
                    required: true
                },
                {
                    id: "importacoes",
                    text: "A empresa importa insumos/produtos?",
                    type: "radio",
                    options: [
                        { value: "regularmente", text: "Sim, regularmente" },
                        { value: "ocasionalmente", text: "Sim, ocasionalmente" },
                        { value: "nao", text: "Não importa" }
                    ],
                    required: true
                },
                {
                    id: "hedge",
                    text: "A empresa possui contratos de hedge cambial?",
                    type: "radio",
                    options: [
                        { value: "completa", text: "Sim, cobertura completa" },
                        { value: "parcial", text: "Sim, cobertura parcial" },
                        { value: "nao", text: "Não possui" }
                    ],
                    required: true
                },
                {
                    id: "monitoramento",
                    text: "Como a empresa monitora variações cambiais?",
                    type: "radio",
                    options: [
                        { value: "diario", text: "Monitoramento diário" },
                        { value: "periodico", text: "Monitoramento semanal/mensal" },
                        { value: "nao_monitora", text: "Não monitora" }
                    ],
                    required: true
                },
                {
                    id: "impacto_cambial",
                    text: "Há impacto significativo da variação cambial no resultado?",
                    type: "radio",
                    options: [
                        { value: "muito_significativo", text: "Sim, muito significativo" },
                        { value: "moderado", text: "Sim, moderado" },
                        { value: "nao", text: "Não há impacto" }
                    ],
                    required: true
                }
            ],
            classification: {
                alta: {
                    conditions: [
                        { field: "faturamento_internacional", values: ["mais_20"] },
                        { field: "importacoes", values: ["regularmente"] },
                        { field: "hedge", values: ["nao"] },
                        { field: "impacto_cambial", values: ["muito_significativo"] }
                    ],
                    operator: "OR"
                },
                media: {
                    conditions: [
                        { field: "faturamento_internacional", values: ["5_20"] },
                        { field: "importacoes", values: ["ocasionalmente"] },
                        { field: "hedge", values: ["parcial"] },
                        { field: "monitoramento", values: ["periodico"] }
                    ],
                    operator: "OR"
                }
            },
            recommendations: {
                alta: "Implemente contratos de hedge urgentemente. Considere forward e opções cambiais.",
                media: "Avalie instrumentos de proteção cambial e melhore monitoramento.",
                baixa: "Mantenha estratégia atual, monitore mudanças no negócio."
            }
        },
        {
            id: 5,
            title: "Mercado Livre de Energia",
            description: "Vamos avaliar sua elegibilidade e viabilidade de migração para o mercado livre de energia.",
            questions: [
                {
                    id: "consumo",
                    text: "Qual o consumo mensal de energia da empresa?",
                    type: "radio",
                    options: [
                        { value: "mais_1000", text: "Mais de 1.000 kWh" },
                        { value: "500_1000", text: "500 a 1.000 kWh" },
                        { value: "menos_500", text: "Menos de 500 kWh" }
                    ],
                    required: true
                },
                {
                    id: "demanda",
                    text: "Qual a demanda contratada da empresa?",
                    type: "radio",
                    options: [
                        { value: "mais_500", text: "Mais de 500 kW" },
                        { value: "100_500", text: "100 a 500 kW" },
                        { value: "menos_100", text: "Menos de 100 kW" }
                    ],
                    required: true
                },
                {
                    id: "migracao",
                    text: "A empresa já migrou para o mercado livre?",
                    type: "radio",
                    options: [
                        { value: "sim", text: "Sim, já migrada" },
                        { value: "processo", text: "Em processo de migração" },
                        { value: "nao", text: "Não migrou" }
                    ],
                    required: true
                },
                {
                    id: "energia_renovavel",
                    text: "Há interesse em energia renovável?",
                    type: "radio",
                    options: [
                        { value: "muito", text: "Sim, muito interesse" },
                        { value: "algum", text: "Sim, algum interesse" },
                        { value: "nao", text: "Não há interesse" }
                    ],
                    required: true
                },
                {
                    id: "monitoramento_custos",
                    text: "A empresa monitora custos de energia?",
                    type: "radio",
                    options: [
                        { value: "detalhado", text: "Sim, detalhadamente" },
                        { value: "basico", text: "Sim, basicamente" },
                        { value: "nao", text: "Não monitora" }
                    ],
                    required: true
                }
            ],
            classification: {
                alta: {
                    conditions: [
                        { field: "consumo", values: ["mais_1000"] },
                        { field: "demanda", values: ["mais_500"] },
                        { field: "migracao", values: ["nao"] }
                    ],
                    operator: "AND"
                },
                media: {
                    conditions: [
                        { field: "consumo", values: ["500_1000"] },
                        { field: "demanda", values: ["100_500"] },
                        { field: "energia_renovavel", values: ["muito", "algum"] }
                    ],
                    operator: "OR"
                }
            },
            recommendations: {
                alta: "Avalie migração imediatamente. Potencial de economia significativa.",
                media: "Monitore elegibilidade e compare custos com mercado cativo.",
                baixa: "Mantenha situação atual, reavalie conforme crescimento."
            }
        },
        {
            id: 6,
            title: "M&A (Fusões e Aquisições)",
            description: "Vamos identificar o potencial para operações de fusões, aquisições ou vendas.",
            questions: [
                {
                    id: "faturamento",
                    text: "Qual o faturamento anual da empresa?",
                    type: "radio",
                    options: [
                        { value: "mais_20m", text: "Mais de R$ 20 milhões" },
                        { value: "5_20m", text: "R$ 5 a 20 milhões" },
                        { value: "menos_5m", text: "Menos de R$ 5 milhões" }
                    ],
                    required: true
                },
                {
                    id: "crescimento",
                    text: "A empresa tem planos de crescimento?",
                    type: "radio",
                    options: [
                        { value: "agressivo", text: "Sim, expansão agressiva" },
                        { value: "moderado", text: "Sim, crescimento moderado" },
                        { value: "organico", text: "Crescimento orgânico apenas" }
                    ],
                    required: true
                },
                {
                    id: "interesse_aquisicoes",
                    text: "Há interesse em adquirir concorrentes/fornecedores?",
                    type: "radio",
                    options: [
                        { value: "muito", text: "Sim, muito interesse" },
                        { value: "algum", text: "Sim, algum interesse" },
                        { value: "nao", text: "Não há interesse" }
                    ],
                    required: true
                },
                {
                    id: "venda",
                    text: "Os sócios consideram venda da empresa?",
                    type: "radio",
                    options: [
                        { value: "proximos_anos", text: "Sim, nos próximos anos" },
                        { value: "futuro", text: "Talvez, no futuro" },
                        { value: "nao", text: "Não consideram" }
                    ],
                    required: true
                },
                {
                    id: "experiencia_ma",
                    text: "A empresa já participou de operações de M&A?",
                    type: "radio",
                    options: [
                        { value: "multiplas", text: "Sim, múltiplas vezes" },
                        { value: "uma_vez", text: "Sim, uma vez" },
                        { value: "nunca", text: "Nunca participou" }
                    ],
                    required: true
                }
            ],
            classification: {
                alta: {
                    conditions: [
                        { field: "faturamento", values: ["mais_20m"] },
                        { field: "crescimento", values: ["agressivo"] },
                        { field: "interesse_aquisicoes", values: ["muito"] }
                    ],
                    operator: "OR"
                },
                media: {
                    conditions: [
                        { field: "faturamento", values: ["5_20m"] },
                        { field: "crescimento", values: ["moderado"] },
                        { field: "interesse_aquisicoes", values: ["algum"] },
                        { field: "venda", values: ["futuro"] }
                    ],
                    operator: "OR"
                }
            },
            recommendations: {
                alta: "Inicie com valuation da empresa. Considere assessoria especializada em M&A.",
                media: "Monitore oportunidades do mercado e prepare documentação corporativa.",
                baixa: "Foque no crescimento orgânico, reavalie M&A conforme evolução."
            }
        },
        {
            id: 7,
            title: "Antecipação de Recebíveis",
            description: "Vamos avaliar sua necessidade de antecipação de recebíveis para capital de giro.",
            questions: [
                {
                    id: "prazo_recebimento",
                    text: "Qual o prazo médio de recebimento da empresa?",
                    type: "radio",
                    options: [
                        { value: "mais_60", text: "Mais de 60 dias" },
                        { value: "30_60", text: "30 a 60 dias" },
                        { value: "menos_30", text: "Menos de 30 dias" },
                        { value: "vista", text: "À vista" }
                    ],
                    required: true
                },
                {
                    id: "volume_recebiveis",
                    text: "Qual o volume mensal de recebíveis?",
                    type: "radio",
                    options: [
                        { value: "mais_1m", text: "Mais de R$ 1 milhão" },
                        { value: "100k_1m", text: "R$ 100 mil a R$ 1 milhão" },
                        { value: "menos_100k", text: "Menos de R$ 100 mil" }
                    ],
                    required: true
                },
                {
                    id: "necessidade_capital",
                    text: "A empresa tem necessidade de capital de giro?",
                    type: "radio",
                    options: [
                        { value: "constante", text: "Sim, constante" },
                        { value: "sazonal", text: "Sim, sazonal" },
                        { value: "raramente", text: "Raramente" },
                        { value: "nao", text: "Não tem necessidade" }
                    ],
                    required: true
                },
                {
                    id: "uso_antecipacao",
                    text: "A empresa já utiliza antecipação de recebíveis?",
                    type: "radio",
                    options: [
                        { value: "regularmente", text: "Sim, regularmente" },
                        { value: "ocasionalmente", text: "Sim, ocasionalmente" },
                        { value: "nunca", text: "Nunca utilizou" }
                    ],
                    required: true
                },
                {
                    id: "setor_atuacao",
                    text: "Qual o setor de atuação da empresa?",
                    type: "radio",
                    options: [
                        { value: "agro_imobiliario", text: "Agronegócio/Imobiliário" },
                        { value: "industria_comercio", text: "Indústria/Comércio" },
                        { value: "servicos", text: "Serviços/Consultoria" }
                    ],
                    required: true
                }
            ],
            classification: {
                alta: {
                    conditions: [
                        { field: "prazo_recebimento", values: ["mais_60"] },
                        { field: "volume_recebiveis", values: ["mais_1m"] },
                        { field: "necessidade_capital", values: ["constante"] }
                    ],
                    operator: "OR"
                },
                media: {
                    conditions: [
                        { field: "prazo_recebimento", values: ["30_60"] },
                        { field: "volume_recebiveis", values: ["100k_1m"] },
                        { field: "necessidade_capital", values: ["sazonal"] },
                        { field: "uso_antecipacao", values: ["ocasionalmente"] }
                    ],
                    operator: "OR"
                }
            },
            recommendations: {
                alta: "Priorize CRI/CRA para setores específicos. Considere factoring para capital de giro.",
                media: "Avalie antecipação para momentos sazonais ou oportunidades de investimento.",
                baixa: "Mantenha fluxo atual, monitore mudanças no prazo de recebimento."
            }
        }
    ]
};

// Configurações de pontuação
const SCORING_CONFIG = {
    alta: 3,
    media: 2,
    baixa: 1,
    maxScore: 21, // 7 seções × 3 pontos máximos
    thresholds: {
        alta: 15, // 15-21 pontos
        media: 10 // 10-14 pontos
        // baixa: < 10 pontos
    }
};

// Recomendações gerais baseadas na pontuação total
const GENERAL_RECOMMENDATIONS = {
    alta: {
        title: "Alta Prioridade - Múltiplas Contratações Recomendadas",
        description: "Sua empresa apresenta necessidades significativas em várias áreas financeiras. Recomendamos ação imediata para otimizar sua gestão financeira.",
        actions: [
            "Priorize as áreas com classificação 'Alta' para implementação imediata",
            "Desenvolva um cronograma de implementação para as próximas 6 semanas",
            "Considere contratar consultoria especializada para acelerar o processo",
            "Estabeleça métricas de acompanhamento para cada área implementada"
        ]
    },
    media: {
        title: "Necessidades Moderadas - Foque em 2-3 Áreas Prioritárias",
        description: "Sua empresa tem oportunidades de melhoria em algumas áreas específicas. Uma abordagem focada trará os melhores resultados.",
        actions: [
            "Selecione 2-3 áreas com maior impacto no seu negócio",
            "Implemente soluções de forma gradual nos próximos 3 meses",
            "Monitore resultados antes de expandir para outras áreas",
            "Mantenha acompanhamento trimestral das demais áreas"
        ]
    },
    baixa: {
        title: "Baixa Urgência - Monitoramento Anual Recomendado",
        description: "Sua empresa está bem estruturada financeiramente. Mantenha o monitoramento regular para identificar futuras oportunidades.",
        actions: [
            "Realize revisão anual de todas as áreas avaliadas",
            "Monitore mudanças no negócio que possam alterar as necessidades",
            "Mantenha-se atualizado sobre novas soluções do mercado",
            "Considere otimizações pontuais nas áreas com classificação 'Média'"
        ]
    }
};

