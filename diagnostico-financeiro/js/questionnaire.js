// Gerenciador do questionário

class QuestionnaireManager {
    constructor() {
        this.currentSection = 1;
        this.totalSections = QUESTIONNAIRE_DATA.sections.length;
        this.responses = {};
        this.isInitialized = false;
        
        this.init();
    }
    
    /**
     * Inicializa o questionário
     */
    init() {
        if (this.isInitialized) return;
        
        // Carrega dados salvos
        this.loadSavedData();
        
        // Configura event listeners
        this.setupEventListeners();
        
        // Gera formulários
        this.generateAllForms();
        
        this.isInitialized = true;
        console.log('Questionário inicializado');
    }
    
    /**
     * Carrega dados salvos do localStorage
     */
    loadSavedData() {
        const savedData = Storage.load();
        if (savedData && savedData.responses) {
            this.responses = savedData.responses;
            this.currentSection = savedData.currentSection || 1;
            console.log('Dados carregados:', savedData);
        }
    }
    
    /**
     * Salva dados no localStorage
     */
    saveData() {
        const data = {
            responses: this.responses,
            currentSection: this.currentSection,
            timestamp: new Date().toISOString(),
            completed: false
        };
        
        Storage.save(data);
    }
    
    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Botão iniciar diagnóstico
        DOM.on('start-diagnosis', 'click', () => {
            this.startDiagnosis();
        });
        
        // Botões de navegação
        DOM.on('btn-previous', 'click', () => {
            this.previousSection();
        });
        
        DOM.on('btn-next', 'click', () => {
            this.nextSection();
        });
        
        DOM.on('btn-finish', 'click', () => {
            this.finishDiagnosis();
        });
        
        // Botão reiniciar
        DOM.on('btn-restart', 'click', () => {
            this.restart();
        });
        
        // Auto-save nas respostas
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.handleResponseChange(e.target);
            }
        });
    }
    
    /**
     * Inicia o diagnóstico
     */
    startDiagnosis() {
        DOM.hide('welcome-screen');
        DOM.show('questionnaire-container');
        DOM.show('progress-container');
        
        this.showSection(this.currentSection);
        this.updateProgress();
        
        Animation.slideInFromTop('questionnaire-container');
    }
    
    /**
     * Gera todos os formulários
     */
    generateAllForms() {
        QUESTIONNAIRE_DATA.sections.forEach(section => {
            this.generateSectionForm(section);
        });
    }
    
    /**
     * Gera formulário de uma seção
     */
    generateSectionForm(section) {
        const form = DOM.get(`form-section-${section.id}`);
        if (!form) return;
        
        let html = '';
        
        section.questions.forEach((question, index) => {
            html += this.generateQuestionHTML(question, section.id, index);
        });
        
        DOM.setHTML(form, html);
        
        // Restaura respostas salvas
        this.restoreSectionResponses(section.id);
    }
    
    /**
     * Gera HTML de uma pergunta
     */
    generateQuestionHTML(question, sectionId, questionIndex) {
        const questionId = `section_${sectionId}_${question.id}`;
        const name = `section_${sectionId}_${question.id}`;
        
        let optionsHTML = '';
        
        if (question.type === 'radio') {
            question.options.forEach((option, optionIndex) => {
                const optionId = `${questionId}_${optionIndex}`;
                optionsHTML += `
                    <label class="option-item" for="${optionId}">
                        <input 
                            type="radio" 
                            id="${optionId}"
                            name="${name}"
                            value="${option.value}"
                            ${question.required ? 'required' : ''}
                        >
                        <span class="option-text">${option.text}</span>
                    </label>
                `;
            });
        }
        
        return `
            <div class="question-group" data-question="${question.id}">
                <label class="question-label">
                    ${questionIndex + 1}. ${question.text}
                    ${question.required ? '<span class="required">*</span>' : ''}
                </label>
                <div class="question-options">
                    ${optionsHTML}
                </div>
            </div>
        `;
    }
    
    /**
     * Restaura respostas salvas de uma seção
     */
    restoreSectionResponses(sectionId) {
        const sectionResponses = this.responses[`section_${sectionId}`];
        if (!sectionResponses) return;
        
        Object.keys(sectionResponses).forEach(questionId => {
            const value = sectionResponses[questionId];
            const input = document.querySelector(`input[name="section_${sectionId}_${questionId}"][value="${value}"]`);
            if (input) {
                input.checked = true;
                this.updateOptionSelection(input);
            }
        });
    }
    
    /**
     * Manipula mudança de resposta
     */
    handleResponseChange(input) {
        const [, sectionId, questionId] = input.name.split('_');
        
        // Salva resposta
        if (!this.responses[`section_${sectionId}`]) {
            this.responses[`section_${sectionId}`] = {};
        }
        this.responses[`section_${sectionId}`][questionId] = input.value;
        
        // Atualiza visual
        this.updateOptionSelection(input);
        
        // Salva dados
        this.saveData();
        
        // Remove erro de validação se existir
        Validation.clearError(input.closest('.question-group'));
    }
    
    /**
     * Atualiza seleção visual da opção
     */
    updateOptionSelection(input) {
        // Remove seleção anterior
        const questionGroup = input.closest('.question-group');
        const options = questionGroup.querySelectorAll('.option-item');
        options.forEach(option => option.classList.remove('selected'));
        
        // Adiciona seleção atual
        if (input.checked) {
            input.closest('.option-item').classList.add('selected');
        }
    }
    
    /**
     * Mostra seção específica
     */
    showSection(sectionNumber) {
        // Esconde todas as seções
        for (let i = 1; i <= this.totalSections; i++) {
            DOM.hide(`section-${i}`);
        }
        
        // Mostra seção atual
        DOM.show(`section-${sectionNumber}`);
        
        // Atualiza botões de navegação
        this.updateNavigationButtons();
        
        // Anima entrada
        Animation.slideInFromTop(`section-${sectionNumber}`);
    }
    
    /**
     * Atualiza botões de navegação
     */
    updateNavigationButtons() {
        const btnPrevious = DOM.get('btn-previous');
        const btnNext = DOM.get('btn-next');
        const btnFinish = DOM.get('btn-finish');
        
        // Botão anterior
        if (this.currentSection === 1) {
            DOM.hide(btnPrevious);
        } else {
            DOM.show(btnPrevious);
        }
        
        // Botão próximo/finalizar
        if (this.currentSection === this.totalSections) {
            DOM.hide(btnNext);
            DOM.show(btnFinish);
        } else {
            DOM.show(btnNext);
            DOM.hide(btnFinish);
        }
    }
    
    /**
     * Atualiza barra de progresso
     */
    updateProgress() {
        const progressFill = DOM.get('progress-fill');
        const progressText = DOM.get('progress-text');
        
        const percentage = (this.currentSection / this.totalSections) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            DOM.setText(progressText, `${this.currentSection} / ${this.totalSections}`);
        }
    }
    
    /**
     * Valida seção atual
     */
    validateCurrentSection() {
        const section = QUESTIONNAIRE_DATA.sections.find(s => s.id === this.currentSection);
        if (!section) return false;
        
        let isValid = true;
        const errors = [];
        
        section.questions.forEach(question => {
            if (question.required) {
                const name = `section_${section.id}_${question.id}`;
                
                if (!Validation.radioGroup(name)) {
                    isValid = false;
                    errors.push({
                        question: question.id,
                        message: 'Esta pergunta é obrigatória'
                    });
                }
            }
        });
        
        // Mostra erros
        errors.forEach(error => {
            const questionGroup = document.querySelector(`[data-question="${error.question}"]`);
            if (questionGroup) {
                Validation.showError(questionGroup, error.message);
            }
        });
        
        if (!isValid) {
            Notification.error('Por favor, responda todas as perguntas obrigatórias antes de continuar.');
        }
        
        return isValid;
    }
    
    /**
     * Vai para seção anterior
     */
    previousSection() {
        if (this.currentSection > 1) {
            this.currentSection--;
            this.showSection(this.currentSection);
            this.updateProgress();
            this.saveData();
        }
    }
    
    /**
     * Vai para próxima seção
     */
    nextSection() {
        if (!this.validateCurrentSection()) {
            return;
        }
        
        if (this.currentSection < this.totalSections) {
            this.currentSection++;
            this.showSection(this.currentSection);
            this.updateProgress();
            this.saveData();
        }
    }
    
    /**
     * Finaliza diagnóstico
     */
    finishDiagnosis() {
        if (!this.validateCurrentSection()) {
            return;
        }
        
        // Marca como completo
        const data = Storage.load() || {};
        data.completed = true;
        data.completedAt = new Date().toISOString();
        Storage.save(data);
        
        // Esconde questionário
        DOM.hide('questionnaire-container');
        DOM.hide('progress-container');
        
        // Mostra resultados
        this.showResults();
    }
    
    /**
     * Mostra tela de resultados
     */
    showResults() {
        // Gera resultados
        const results = this.generateResults();
        
        // Renderiza resultados
        this.renderResults(results);
        
        // Mostra tela de resultados
        DOM.show('results-screen');
        Animation.slideInFromTop('results-screen');
    }
    
    /**
     * Gera resultados do diagnóstico
     */
    generateResults() {
        const results = {
            sections: [],
            totalScore: 0,
            classification: '',
            recommendation: null
        };
        
        // Processa cada seção
        QUESTIONNAIRE_DATA.sections.forEach(section => {
            const sectionResponses = this.responses[`section_${section.id}`] || {};
            const classification = this.classifySection(section, sectionResponses);
            const score = SCORING_CONFIG[classification];
            
            results.sections.push({
                id: section.id,
                title: section.title,
                classification: classification,
                score: score,
                recommendation: section.recommendations[classification]
            });
            
            results.totalScore += score;
        });
        
        // Classifica resultado geral
        if (results.totalScore >= SCORING_CONFIG.thresholds.alta) {
            results.classification = 'alta';
        } else if (results.totalScore >= SCORING_CONFIG.thresholds.media) {
            results.classification = 'media';
        } else {
            results.classification = 'baixa';
        }
        
        results.recommendation = GENERAL_RECOMMENDATIONS[results.classification];
        
        return results;
    }
    
    /**
     * Classifica uma seção baseada nas respostas
     */
    classifySection(section, responses) {
        // Verifica condições para classificação alta
        if (this.checkConditions(section.classification.alta, responses)) {
            return 'alta';
        }
        
        // Verifica condições para classificação média
        if (this.checkConditions(section.classification.media, responses)) {
            return 'media';
        }
        
        // Caso contrário, é baixa
        return 'baixa';
    }
    
    /**
     * Verifica se condições são atendidas
     */
    checkConditions(classificationRule, responses) {
        if (!classificationRule || !classificationRule.conditions) {
            return false;
        }
        
        const { conditions, operator } = classificationRule;
        
        if (operator === 'OR') {
            return conditions.some(condition => 
                condition.values.includes(responses[condition.field])
            );
        } else if (operator === 'AND') {
            return conditions.every(condition => 
                condition.values.includes(responses[condition.field])
            );
        }
        
        return false;
    }
    
    /**
     * Renderiza resultados na tela
     */
    renderResults(results) {
        const resultsContent = DOM.get('results-screen').querySelector('.results-content');
        
        let html = `
            <div class="results-summary">
                <div class="score-card">
                    <h3>Pontuação Total</h3>
                    <div class="score-value">${results.totalScore} / ${SCORING_CONFIG.maxScore}</div>
                    <div class="score-classification classification-${results.classification}">
                        ${Format.capitalize(results.classification)} Prioridade
                    </div>
                </div>
            </div>
            
            <div class="general-recommendation">
                <h3>${results.recommendation.title}</h3>
                <p>${results.recommendation.description}</p>
                <ul class="recommendation-actions">
                    ${results.recommendation.actions.map(action => `<li>${action}</li>`).join('')}
                </ul>
            </div>
            
            <div class="sections-results">
                <h3>Resultados por Área</h3>
                <div class="sections-grid">
                    ${results.sections.map(section => this.renderSectionResult(section)).join('')}
                </div>
            </div>
        `;
        
        DOM.setHTML(resultsContent, html);
    }
    
    /**
     * Renderiza resultado de uma seção
     */
    renderSectionResult(section) {
        return `
            <div class="section-result">
                <div class="section-result-header">
                    <h4>${section.title}</h4>
                    <span class="classification-badge classification-${section.classification}">
                        ${Format.capitalize(section.classification)}
                    </span>
                </div>
                <div class="section-result-content">
                    <div class="section-score">
                        Pontuação: ${section.score} / 3
                    </div>
                    <div class="section-recommendation">
                        ${section.recommendation}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Reinicia o diagnóstico
     */
    restart() {
        if (confirm('Tem certeza que deseja reiniciar o diagnóstico? Todos os dados serão perdidos.')) {
            // Limpa dados
            Storage.clear();
            this.responses = {};
            this.currentSection = 1;
            
            // Esconde resultados
            DOM.hide('results-screen');
            
            // Mostra tela inicial
            DOM.show('welcome-screen');
            DOM.hide('progress-container');
            
            // Limpa formulários
            this.clearAllForms();
            
            Animation.fadeIn('welcome-screen');
        }
    }
    
    /**
     * Limpa todos os formulários
     */
    clearAllForms() {
        const forms = DOM.getAll('.questions-form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[type="radio"]');
            inputs.forEach(input => {
                input.checked = false;
                this.updateOptionSelection(input);
            });
        });
    }
    
    /**
     * Obtém dados para exportação
     */
    getExportData() {
        const results = this.generateResults();
        
        return {
            timestamp: new Date().toISOString(),
            responses: this.responses,
            results: results,
            summary: {
                totalScore: results.totalScore,
                maxScore: SCORING_CONFIG.maxScore,
                classification: results.classification,
                sectionsCount: results.sections.length
            }
        };
    }
}

// Instância global do questionário
let questionnaireManager;

