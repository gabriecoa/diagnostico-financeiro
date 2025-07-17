// Sistema de resultados e geração de relatórios

class ResultsManager {
    constructor() {
        this.setupEventListeners();
    }
    
    /**
     * Configura event listeners para ações de resultados
     */
    setupEventListeners() {
        // Download PDF
        DOM.on('btn-download-pdf', 'click', () => {
            this.downloadPDF();
        });
        
        // Enviar por email
        DOM.on('btn-send-email', 'click', () => {
            this.sendEmail();
        });
    }
    
    /**
     * Renderiza resultados completos
     */
    renderResults(report) {
        const resultsContent = document.querySelector('.results-content');
        if (!resultsContent) return;
        
        // Gera análises adicionais
        const patterns = classificationEngine.analyzePatterns(report);
        const insights = classificationEngine.generateInsights(report);
        const roiEstimate = classificationEngine.calculateEstimatedROI(report);
        
        const html = `
            ${this.renderSummaryCard(report)}
            ${this.renderGeneralRecommendation(report)}
            ${this.renderROIEstimate(roiEstimate)}
            ${this.renderInsights(insights)}
            ${this.renderSectionsResults(report.sections)}
            ${this.renderPatternAnalysis(patterns)}
            ${this.renderActionPlan(report)}
        `;
        
        DOM.setHTML(resultsContent, html);
    }
    
    /**
     * Renderiza card de resumo
     */
    renderSummaryCard(report) {
        const { summary } = report;
        
        return `
            <div class="results-summary">
                <div class="summary-cards">
                    <div class="summary-card score-card">
                        <div class="card-icon">📊</div>
                        <div class="card-content">
                            <h3>Pontuação Total</h3>
                            <div class="score-value">${summary.totalScore} / ${summary.maxScore}</div>
                            <div class="score-percentage">${summary.percentage}%</div>
                        </div>
                    </div>
                    
                    <div class="summary-card classification-card">
                        <div class="card-icon">🎯</div>
                        <div class="card-content">
                            <h3>Classificação Geral</h3>
                            <div class="classification-badge classification-${summary.classification}">
                                ${Format.capitalize(summary.classification)} Prioridade
                            </div>
                        </div>
                    </div>
                    
                    <div class="summary-card areas-card">
                        <div class="card-icon">📋</div>
                        <div class="card-content">
                            <h3>Áreas Avaliadas</h3>
                            <div class="areas-count">${summary.sectionsCount}</div>
                            <div class="areas-label">Seções Analisadas</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza recomendação geral
     */
    renderGeneralRecommendation(report) {
        const { general } = report;
        
        return `
            <div class="general-recommendation">
                <div class="recommendation-header">
                    <h3>${general.recommendation.title}</h3>
                </div>
                <div class="recommendation-content">
                    <p class="recommendation-description">${general.recommendation.description}</p>
                    <div class="recommendation-actions">
                        <h4>Próximos Passos:</h4>
                        <ul>
                            ${general.recommendation.actions.map(action => `<li>${action}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza estimativa de ROI
     */
    renderROIEstimate(roiEstimate) {
        if (roiEstimate.implementationAreas === 0) {
            return `
                <div class="roi-estimate success">
                    <div class="roi-header">
                        <h3>💰 Análise de Retorno</h3>
                    </div>
                    <div class="roi-content">
                        <p>${roiEstimate.description}</p>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="roi-estimate">
                <div class="roi-header">
                    <h3>💰 Retorno Estimado do Investimento</h3>
                </div>
                <div class="roi-content">
                    <div class="roi-range">
                        <span class="roi-min">${roiEstimate.minROI}%</span>
                        <span class="roi-separator">-</span>
                        <span class="roi-max">${roiEstimate.maxROI}%</span>
                        <span class="roi-label">ROI Estimado</span>
                    </div>
                    <p class="roi-description">${roiEstimate.description}</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza insights personalizados
     */
    renderInsights(insights) {
        if (insights.length === 0) return '';
        
        return `
            <div class="insights-section">
                <h3>💡 Insights Personalizados</h3>
                <div class="insights-grid">
                    ${insights.map(insight => this.renderInsight(insight)).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza um insight individual
     */
    renderInsight(insight) {
        const icons = {
            success: '✅',
            warning: '⚠️',
            action: '🎯',
            info: 'ℹ️'
        };
        
        return `
            <div class="insight-card insight-${insight.type}">
                <div class="insight-icon">${icons[insight.type] || icons.info}</div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza resultados das seções
     */
    renderSectionsResults(sections) {
        return `
            <div class="sections-results">
                <h3>📊 Resultados Detalhados por Área</h3>
                <div class="sections-grid">
                    ${sections.map(section => this.renderSectionResult(section)).join('')}
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza resultado de uma seção
     */
    renderSectionResult(section) {
        const icons = {
            'Benefícios Corporativos': '👥',
            'Seguros em Geral': '🛡️',
            'Consórcio': '🚗',
            'Câmbio': '💱',
            'Mercado Livre de Energia': '⚡',
            'M&A (Fusões e Aquisições)': '🤝',
            'Antecipação de Recebíveis': '💰'
        };
        
        return `
            <div class="section-result">
                <div class="section-result-header">
                    <div class="section-icon">${icons[section.title] || '📋'}</div>
                    <div class="section-info">
                        <h4>${section.title}</h4>
                        <span class="classification-badge classification-${section.classification}">
                            ${Format.capitalize(section.classification)}
                        </span>
                    </div>
                    <div class="section-score">
                        ${section.score}/3
                    </div>
                </div>
                <div class="section-result-content">
                    <div class="section-recommendation">
                        <strong>Recomendação:</strong>
                        <p>${section.recommendation}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza análise de padrões
     */
    renderPatternAnalysis(patterns) {
        return `
            <div class="pattern-analysis">
                <h3>🔍 Análise de Padrões</h3>
                <div class="patterns-grid">
                    ${this.renderPriorityAreas(patterns)}
                    ${this.renderCriticalFindings(patterns)}
                </div>
            </div>
        `;
    }
    
    /**
     * Renderiza áreas por prioridade
     */
    renderPriorityAreas(patterns) {
        return `
            <div class="priority-areas">
                <h4>Distribuição por Prioridade</h4>
                
                ${patterns.highPriorityAreas.length > 0 ? `
                    <div class="priority-group high-priority">
                        <h5>🔴 Alta Prioridade (${patterns.highPriorityAreas.length})</h5>
                        <ul>
                            ${patterns.highPriorityAreas.map(area => `<li>${area}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${patterns.mediumPriorityAreas.length > 0 ? `
                    <div class="priority-group medium-priority">
                        <h5>🟡 Média Prioridade (${patterns.mediumPriorityAreas.length})</h5>
                        <ul>
                            ${patterns.mediumPriorityAreas.map(area => `<li>${area}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${patterns.lowPriorityAreas.length > 0 ? `
                    <div class="priority-group low-priority">
                        <h5>🟢 Baixa Prioridade (${patterns.lowPriorityAreas.length})</h5>
                        <ul>
                            ${patterns.lowPriorityAreas.map(area => `<li>${area}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    /**
     * Renderiza achados críticos
     */
    renderCriticalFindings(patterns) {
        if (patterns.criticalFindings.length === 0) {
            return `
                <div class="critical-findings">
                    <h4>✅ Status Geral</h4>
                    <p class="no-critical">Nenhum achado crítico identificado. Sua empresa apresenta uma gestão financeira equilibrada.</p>
                </div>
            `;
        }
        
        return `
            <div class="critical-findings">
                <h4>⚠️ Achados Críticos</h4>
                <ul class="critical-list">
                    ${patterns.criticalFindings.map(finding => `<li>${finding}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    /**
     * Renderiza plano de ação
     */
    renderActionPlan(report) {
        const highPrioritySections = report.sections.filter(s => s.classification === 'alta');
        const mediumPrioritySections = report.sections.filter(s => s.classification === 'media');
        
        return `
            <div class="action-plan">
                <h3>📅 Plano de Ação Recomendado</h3>
                
                ${highPrioritySections.length > 0 ? `
                    <div class="action-phase">
                        <h4>Fase 1 - Implementação Imediata (0-30 dias)</h4>
                        <div class="action-items">
                            ${highPrioritySections.map(section => `
                                <div class="action-item high">
                                    <strong>${section.title}</strong>
                                    <p>${section.recommendation}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                ${mediumPrioritySections.length > 0 ? `
                    <div class="action-phase">
                        <h4>Fase 2 - Implementação Gradual (30-90 dias)</h4>
                        <div class="action-items">
                            ${mediumPrioritySections.map(section => `
                                <div class="action-item medium">
                                    <strong>${section.title}</strong>
                                    <p>${section.recommendation}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="action-phase">
                    <h4>Fase 3 - Monitoramento Contínuo (90+ dias)</h4>
                    <div class="action-items">
                        <div class="action-item monitoring">
                            <strong>Acompanhamento Regular</strong>
                            <p>Realize revisões trimestrais para monitorar o progresso das implementações e identificar novas oportunidades de otimização.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Gera dados para PDF
     */
    generatePDFData() {
        const exportData = questionnaireManager.getExportData();
        const report = classificationEngine.generateReport(exportData.responses);
        
        return {
            title: 'Relatório de Diagnóstico Financeiro Empresarial',
            date: Format.date(new Date()),
            report: report,
            exportData: exportData
        };
    }
    
    /**
     * Download do relatório em PDF
     */
    downloadPDF() {
        try {
            const pdfData = this.generatePDFData();
            
            // Cria conteúdo HTML para PDF
            const htmlContent = this.generatePDFHTML(pdfData);
            
            // Abre em nova janela para impressão/save as PDF
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
            // Aguarda carregamento e inicia impressão
            printWindow.onload = function() {
                printWindow.print();
            };
            
            Notification.success('Relatório PDF gerado com sucesso!');
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            Notification.error('Erro ao gerar relatório PDF. Tente novamente.');
        }
    }
    
    /**
     * Gera HTML para PDF
     */
    generatePDFHTML(pdfData) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${pdfData.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 20px; }
                    .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
                    .section { margin-bottom: 25px; }
                    .section h3 { color: #2563eb; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
                    .classification-alta { color: #dc2626; font-weight: bold; }
                    .classification-media { color: #d97706; font-weight: bold; }
                    .classification-baixa { color: #059669; font-weight: bold; }
                    .score { font-size: 24px; font-weight: bold; color: #2563eb; }
                    @media print { body { margin: 0; } .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${pdfData.title}</h1>
                    <p>Gerado em: ${pdfData.date}</p>
                </div>
                
                <div class="summary">
                    <h2>Resumo Executivo</h2>
                    <p><strong>Pontuação Total:</strong> <span class="score">${pdfData.report.summary.totalScore}/${pdfData.report.summary.maxScore}</span> (${pdfData.report.summary.percentage}%)</p>
                    <p><strong>Classificação Geral:</strong> <span class="classification-${pdfData.report.summary.classification}">${Format.capitalize(pdfData.report.summary.classification)} Prioridade</span></p>
                </div>
                
                <div class="section">
                    <h2>Recomendação Geral</h2>
                    <h3>${pdfData.report.general.recommendation.title}</h3>
                    <p>${pdfData.report.general.recommendation.description}</p>
                    <ul>
                        ${pdfData.report.general.recommendation.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="section">
                    <h2>Resultados por Área</h2>
                    ${pdfData.report.sections.map(section => `
                        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e2e8f0; border-radius: 5px;">
                            <h3>${section.title}</h3>
                            <p><strong>Classificação:</strong> <span class="classification-${section.classification}">${Format.capitalize(section.classification)}</span></p>
                            <p><strong>Pontuação:</strong> ${section.score}/3</p>
                            <p><strong>Recomendação:</strong> ${section.recommendation}</p>
                        </div>
                    `).join('')}
                </div>
            </body>
            </html>
        `;
    }
    
    /**
     * Envio por email
     */
    sendEmail() {
        const email = prompt('Digite seu email para receber o relatório:');
        
        if (!email) return;
        
        if (!Validation.email(email)) {
            Notification.error('Por favor, digite um email válido.');
            return;
        }
        
        try {
            const pdfData = this.generatePDFData();
            const subject = encodeURIComponent('Relatório de Diagnóstico Financeiro Empresarial');
            const body = encodeURIComponent(`
Segue em anexo seu Relatório de Diagnóstico Financeiro Empresarial.

Resumo:
- Pontuação Total: ${pdfData.report.summary.totalScore}/${pdfData.report.summary.maxScore} (${pdfData.report.summary.percentage}%)
- Classificação: ${Format.capitalize(pdfData.report.summary.classification)} Prioridade
- Data: ${pdfData.date}

Para visualizar o relatório completo, acesse novamente a ferramenta de diagnóstico.

Atenciosamente,
Sistema de Diagnóstico Financeiro Empresarial
            `);
            
            const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            Notification.success('Email preparado! Verifique seu cliente de email.');
            
        } catch (error) {
            console.error('Erro ao preparar email:', error);
            Notification.error('Erro ao preparar email. Tente novamente.');
        }
    }
}

// Instância global do gerenciador de resultados
const resultsManager = new ResultsManager();

