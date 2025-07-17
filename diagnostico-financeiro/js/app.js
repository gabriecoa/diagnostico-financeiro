// Aplicação principal - Diagnóstico Financeiro Empresarial

class DiagnosticoFinanceiroApp {
    constructor() {
        this.isInitialized = false;
        this.components = {};
        
        this.init();
    }
    
    /**
     * Inicializa a aplicação
     */
    init() {
        if (this.isInitialized) return;
        
        console.log('Inicializando Diagnóstico Financeiro Empresarial...');
        
        // Aguarda DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }
    
    /**
     * Inicia a aplicação
     */
    start() {
        try {
            // Mostra loading
            this.showLoading();
            
            // Inicializa componentes
            this.initializeComponents();
            
            // Configura event listeners globais
            this.setupGlobalEventListeners();
            
            // Verifica dados salvos
            this.checkSavedData();
            
            // Esconde loading após delay
            setTimeout(() => {
                this.hideLoading();
                this.isInitialized = true;
                console.log('Aplicação inicializada com sucesso!');
            }, 1500);
            
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            this.handleInitializationError(error);
        }
    }
    
    /**
     * Mostra tela de loading
     */
    showLoading() {
        const loadingScreen = DOM.get('loading-screen');
        if (loadingScreen) {
            DOM.show(loadingScreen);
        }
    }
    
    /**
     * Esconde tela de loading
     */
    hideLoading() {
        const loadingScreen = DOM.get('loading-screen');
        if (loadingScreen) {
            Animation.fadeOut(loadingScreen, 500);
        }
    }
    
    /**
     * Inicializa componentes da aplicação
     */
    initializeComponents() {
        // Inicializa gerenciador do questionário
        this.components.questionnaire = new QuestionnaireManager();
        
        // Inicializa gerenciador de resultados
        this.components.results = new ResultsManager();
        
        console.log('Componentes inicializados:', Object.keys(this.components));
    }
    
    /**
     * Configura event listeners globais
     */
    setupGlobalEventListeners() {
        // Previne envio de formulários
        document.addEventListener('submit', (e) => {
            e.preventDefault();
        });
        
        // Salva dados antes de sair da página
        window.addEventListener('beforeunload', (e) => {
            if (this.components.questionnaire && this.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
                return e.returnValue;
            }
        });
        
        // Trata erros globais
        window.addEventListener('error', (e) => {
            console.error('Erro global capturado:', e.error);
            this.handleGlobalError(e.error);
        });
        
        // Trata promessas rejeitadas
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejeitada:', e.reason);
            this.handleGlobalError(e.reason);
        });
        
        // Monitora mudanças de conectividade
        window.addEventListener('online', () => {
            Notification.success('Conexão restaurada!');
        });
        
        window.addEventListener('offline', () => {
            Notification.info('Você está offline. Os dados serão salvos localmente.');
        });
        
        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }
    
    /**
     * Verifica se há dados salvos
     */
    checkSavedData() {
        const savedData = Storage.load();
        
        if (savedData && savedData.responses && Object.keys(savedData.responses).length > 0) {
            console.log('Dados salvos encontrados:', savedData);
            
            // Mostra notificação sobre dados salvos
            setTimeout(() => {
                if (confirm('Encontramos um diagnóstico em andamento. Deseja continuar de onde parou?')) {
                    this.resumeDiagnosis();
                } else {
                    this.clearSavedData();
                }
            }, 2000);
        }
    }
    
    /**
     * Retoma diagnóstico salvo
     */
    resumeDiagnosis() {
        if (this.components.questionnaire) {
            this.components.questionnaire.startDiagnosis();
            Notification.info('Diagnóstico retomado!');
        }
    }
    
    /**
     * Limpa dados salvos
     */
    clearSavedData() {
        if (confirm('Tem certeza que deseja limpar os dados salvos?')) {
            Storage.clear();
            Notification.success('Dados limpos com sucesso!');
        }
    }
    
    /**
     * Verifica se há mudanças não salvas
     */
    hasUnsavedChanges() {
        const savedData = Storage.load();
        return savedData && savedData.responses && Object.keys(savedData.responses).length > 0 && !savedData.completed;
    }
    
    /**
     * Manipula atalhos de teclado
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S para salvar
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (this.components.questionnaire) {
                this.components.questionnaire.saveData();
                Notification.success('Dados salvos!');
            }
        }
        
        // Escape para voltar
        if (e.key === 'Escape') {
            const currentScreen = this.getCurrentScreen();
            if (currentScreen === 'questionnaire') {
                if (confirm('Deseja voltar à tela inicial? O progresso será salvo.')) {
                    this.goToWelcomeScreen();
                }
            }
        }
        
        // Setas para navegação (apenas no questionário)
        if (this.getCurrentScreen() === 'questionnaire') {
            if (e.key === 'ArrowLeft' && e.ctrlKey) {
                e.preventDefault();
                if (this.components.questionnaire) {
                    this.components.questionnaire.previousSection();
                }
            }
            
            if (e.key === 'ArrowRight' && e.ctrlKey) {
                e.preventDefault();
                if (this.components.questionnaire) {
                    this.components.questionnaire.nextSection();
                }
            }
        }
    }
    
    /**
     * Identifica tela atual
     */
    getCurrentScreen() {
        if (!DOM.hasClass('welcome-screen', 'hidden') && DOM.get('welcome-screen').style.display !== 'none') {
            return 'welcome';
        }
        
        if (!DOM.hasClass('questionnaire-container', 'hidden') && DOM.get('questionnaire-container').style.display !== 'none') {
            return 'questionnaire';
        }
        
        if (!DOM.hasClass('results-screen', 'hidden') && DOM.get('results-screen').style.display !== 'none') {
            return 'results';
        }
        
        return 'unknown';
    }
    
    /**
     * Volta para tela inicial
     */
    goToWelcomeScreen() {
        DOM.hide('questionnaire-container');
        DOM.hide('results-screen');
        DOM.hide('progress-container');
        DOM.show('welcome-screen');
        
        Animation.fadeIn('welcome-screen');
    }
    
    /**
     * Manipula erros de inicialização
     */
    handleInitializationError(error) {
        console.error('Erro de inicialização:', error);
        
        this.hideLoading();
        
        // Mostra mensagem de erro
        const errorMessage = `
            <div style="text-align: center; padding: 40px; color: #dc2626;">
                <h2>Erro ao Inicializar Aplicação</h2>
                <p>Ocorreu um erro ao carregar o diagnóstico financeiro.</p>
                <p>Por favor, recarregue a página ou tente novamente mais tarde.</p>
                <button onclick="window.location.reload()" style="
                    background: #2563eb; 
                    color: white; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 6px; 
                    cursor: pointer;
                    margin-top: 20px;
                ">
                    Recarregar Página
                </button>
            </div>
        `;
        
        document.body.innerHTML = errorMessage;
    }
    
    /**
     * Manipula erros globais
     */
    handleGlobalError(error) {
        console.error('Erro global:', error);
        
        // Não mostra notificação para erros menores
        if (error && error.message && error.message.includes('Script error')) {
            return;
        }
        
        // Mostra notificação de erro
        Notification.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
    }
    
    /**
     * Obtém informações da aplicação
     */
    getAppInfo() {
        return {
            name: 'Diagnóstico Financeiro Empresarial',
            version: '1.0.0',
            initialized: this.isInitialized,
            components: Object.keys(this.components),
            currentScreen: this.getCurrentScreen(),
            hasData: !!Storage.load()
        };
    }
    
    /**
     * Reinicia aplicação
     */
    restart() {
        if (confirm('Tem certeza que deseja reiniciar a aplicação? Todos os dados serão perdidos.')) {
            Storage.clear();
            window.location.reload();
        }
    }
    
    /**
     * Exporta dados para debug
     */
    exportDebugData() {
        const debugData = {
            appInfo: this.getAppInfo(),
            savedData: Storage.load(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.log('Debug Data:', debugData);
        
        // Cria arquivo para download
        const dataStr = JSON.stringify(debugData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `diagnostico-debug-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        Notification.success('Dados de debug exportados!');
    }
}

// Inicializa aplicação quando script carrega
const app = new DiagnosticoFinanceiroApp();

// Expõe funções globais para debug (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugApp = {
        app: app,
        storage: Storage,
        dom: DOM,
        animation: Animation,
        validation: Validation,
        format: Format,
        notification: Notification,
        exportDebug: () => app.exportDebugData(),
        restart: () => app.restart(),
        clearData: () => Storage.clear()
    };
    
    console.log('Debug tools available at window.debugApp');
}

