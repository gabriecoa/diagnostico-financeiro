// Sistema de classificação e análise

class ClassificationEngine {
    constructor() {
        this.rules = this.loadClassificationRules();
    }
    
    /**
     * Carrega regras de classificação dos dados
     */
    loadClassificationRules() {
        const rules = {};
        
        QUESTIONNAIRE_DATA.sections.forEach(section => {
            rules[section.id] = {
                title: section.title,
                classification: section.classification,
                recommendations: section.recommendations
            };
        });
        
        return rules;
    }
    
    /**
     * Classifica todas as seções baseado nas respostas
     */
    classifyAll(responses) {
        const results = {};
        
        Object.keys(this.rules).forEach(sectionId => {
            const sectionResponses = responses[`section_${sectionId}`] || {};
            results[sectionId] = this.classifySection(sectionId, sectionResponses);
        });
        
        return results;
    }
    
    /**
     * Classifica uma seção específica
     */
    classifySection(sectionId, responses) {
        const rule = this.rules[sectionId];
        if (!rule) {
            return { classification: 'baixa', score: 1 };
        }
        
        // Verifica classificação alta
        if (this.evaluateConditions(rule.classification.alta, responses)) {
            return {
                classification: 'alta',
                score: SCORING_CONFIG.alta,
                recommendation: rule.recommendations.alta
            };
        }
        
        // Verifica classificação média
        if (this.evaluateConditions(rule.classification.media, responses)) {
            return {
                classification: 'media',
                score: SCORING_CONFIG.media,
                recommendation: rule.recommendations.media
            };
        }
        
        // Classificação baixa (padrão)
        return {
            classification: 'baixa',
            score: SCORING_CONFIG.baixa,
            recommendation: rule.recommendations.baixa
        };
    }
    
    /**
     * Avalia condições de classificação
     */
    evaluateConditions(classificationRule, responses) {
        if (!classificationRule || !classificationRule.conditions) {
            return false;
        }
        
        const { conditions, operator } = classificationRule;
        
        if (operator === 'OR') {
            return conditions.some(condition => 
                this.evaluateCondition(condition, responses)
            );
        } else if (operator === 'AND') {
            return conditions.every(condition => 
                this.evaluateCondition(condition, responses)
            );
        }
        
        return false;
    }
    
    /**
     * Avalia uma condição específica
     */
    evaluateCondition(condition, responses) {
        const { field, values } = condition;
        const responseValue = responses[field];
        
        return values.includes(responseValue);
    }
    
    /**
     * Calcula pontuação total
     */
    calculateTotalScore(classifications) {
        let totalScore = 0;
        
        Object.values(classifications).forEach(result => {
            totalScore += result.score;
        });
        
        return totalScore;
    }
    
    /**
     * Determina classificação geral baseada na pontuação
     */
    getGeneralClassification(totalScore) {
        if (totalScore >= SCORING_CONFIG.thresholds.alta) {
            return 'alta';
        } else if (totalScore >= SCORING_CONFIG.thresholds.media) {
            return 'media';
        } else {
            return 'baixa';
        }
    }
    
    /**
     * Gera relatório completo
     */
    generateReport(responses) {
        const classifications = this.classifyAll(responses);
        const totalScore = this.calculateTotalScore(classifications);
        const generalClassification = this.getGeneralClassification(totalScore);
        const generalRecommendation = GENERAL_RECOMMENDATIONS[generalClassification];
        
        // Prepara dados das seções
        const sectionsData = Object.keys(classifications).map(sectionId => {
            const section = QUESTIONNAIRE_DATA.sections.find(s => s.id == sectionId);
            const result = classifications[sectionId];
            
            return {
                id: sectionId,
                title: section.title,
                classification: result.classification,
                score: result.score,
                recommendation: result.recommendation,
                responses: this.formatSectionResponses(section, responses[`section_${sectionId}`] || {})
            };
        });
        
        return {
            timestamp: new Date().toISOString(),
            summary: {
                totalScore: totalScore,
                maxScore: SCORING_CONFIG.maxScore,
                percentage: Math.round((totalScore / SCORING_CONFIG.maxScore) * 100),
                classification: generalClassification,
                sectionsCount: sectionsData.length
            },
            general: {
                classification: generalClassification,
                recommendation: generalRecommendation
            },
            sections: sectionsData,
            rawResponses: responses
        };
    }
    
    /**
     * Formata respostas de uma seção para exibição
     */
    formatSectionResponses(section, responses) {
        const formatted = [];
        
        section.questions.forEach(question => {
            const responseValue = responses[question.id];
            let responseText = 'Não respondido';
            
            if (responseValue) {
                const option = question.options.find(opt => opt.value === responseValue);
                responseText = option ? option.text : responseValue;
            }
            
            formatted.push({
                question: question.text,
                answer: responseText,
                value: responseValue
            });
        });
        
        return formatted;
    }
    
    /**
     * Analisa tendências e padrões
     */
    analyzePatterns(report) {
        const analysis = {
            highPriorityAreas: [],
            mediumPriorityAreas: [],
            lowPriorityAreas: [],
            criticalFindings: [],
            recommendations: []
        };
        
        // Categoriza áreas por prioridade
        report.sections.forEach(section => {
            switch (section.classification) {
                case 'alta':
                    analysis.highPriorityAreas.push(section.title);
                    break;
                case 'media':
                    analysis.mediumPriorityAreas.push(section.title);
                    break;
                case 'baixa':
                    analysis.lowPriorityAreas.push(section.title);
                    break;
            }
        });
        
        // Identifica achados críticos
        if (analysis.highPriorityAreas.length >= 4) {
            analysis.criticalFindings.push('Múltiplas áreas com necessidade alta identificadas');
        }
        
        if (report.summary.percentage < 40) {
            analysis.criticalFindings.push('Pontuação geral baixa indica necessidade de atenção imediata');
        }
        
        // Gera recomendações específicas
        if (analysis.highPriorityAreas.length > 0) {
            analysis.recommendations.push(`Priorize implementação nas áreas: ${analysis.highPriorityAreas.join(', ')}`);
        }
        
        if (analysis.mediumPriorityAreas.length > 0) {
            analysis.recommendations.push(`Monitore e planeje melhorias em: ${analysis.mediumPriorityAreas.join(', ')}`);
        }
        
        return analysis;
    }
    
    /**
     * Gera insights personalizados
     */
    generateInsights(report) {
        const insights = [];
        
        // Insight sobre distribuição de pontuação
        const highCount = report.sections.filter(s => s.classification === 'alta').length;
        const mediumCount = report.sections.filter(s => s.classification === 'media').length;
        const lowCount = report.sections.filter(s => s.classification === 'baixa').length;
        
        if (highCount > mediumCount + lowCount) {
            insights.push({
                type: 'warning',
                title: 'Múltiplas Necessidades Críticas',
                description: 'Sua empresa apresenta necessidades altas em várias áreas. Recomendamos priorizar as implementações mais urgentes.'
            });
        }
        
        if (lowCount === report.sections.length) {
            insights.push({
                type: 'success',
                title: 'Gestão Financeira Sólida',
                description: 'Parabéns! Sua empresa demonstra uma gestão financeira bem estruturada em todas as áreas avaliadas.'
            });
        }
        
        // Insights específicos por área
        report.sections.forEach(section => {
            if (section.classification === 'alta') {
                insights.push({
                    type: 'action',
                    title: `${section.title} - Ação Necessária`,
                    description: section.recommendation
                });
            }
        });
        
        return insights;
    }
    
    /**
     * Calcula ROI estimado das implementações
     */
    calculateEstimatedROI(report) {
        const roiEstimates = {
            alta: { min: 15, max: 35 }, // 15-35% de ROI
            media: { min: 8, max: 20 }, // 8-20% de ROI
            baixa: { min: 3, max: 10 }  // 3-10% de ROI
        };
        
        let totalMinROI = 0;
        let totalMaxROI = 0;
        let implementationAreas = 0;
        
        report.sections.forEach(section => {
            if (section.classification !== 'baixa') {
                const roi = roiEstimates[section.classification];
                totalMinROI += roi.min;
                totalMaxROI += roi.max;
                implementationAreas++;
            }
        });
        
        return {
            minROI: Math.round(totalMinROI / Math.max(implementationAreas, 1)),
            maxROI: Math.round(totalMaxROI / Math.max(implementationAreas, 1)),
            implementationAreas: implementationAreas,
            description: implementationAreas > 0 
                ? `Implementando as recomendações, sua empresa pode obter um retorno estimado entre ${Math.round(totalMinROI / implementationAreas)}% e ${Math.round(totalMaxROI / implementationAreas)}%.`
                : 'Sua empresa já possui uma gestão financeira otimizada.'
        };
    }
}

// Instância global do motor de classificação
const classificationEngine = new ClassificationEngine();

