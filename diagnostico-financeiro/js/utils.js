// Utilidades gerais da aplicação

/**
 * Gerenciador de armazenamento local
 */
const Storage = {
    key: 'diagnostico-financeiro-data',
    
    save(data) {
        try {
            localStorage.setItem(this.key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    },
    
    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return null;
        }
    },
    
    clear() {
        try {
            localStorage.removeItem(this.key);
            return true;
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            return false;
        }
    }
};

/**
 * Utilitários DOM
 */
const DOM = {
    /**
     * Seleciona elemento por ID
     */
    get(id) {
        return document.getElementById(id);
    },
    
    /**
     * Seleciona elementos por seletor
     */
    getAll(selector) {
        return document.querySelectorAll(selector);
    },
    
    /**
     * Mostra elemento
     */
    show(element) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) {
            element.style.display = '';
            element.classList.remove('hidden');
        }
    },
    
    /**
     * Esconde elemento
     */
    hide(element) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) {
            element.style.display = 'none';
            element.classList.add('hidden');
        }
    },
    
    /**
     * Adiciona classe
     */
    addClass(element, className) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) {
            element.classList.add(className);
        }
    },
    
    /**
     * Remove classe
     */
    removeClass(element, className) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) {
            element.classList.remove(className);
        }
    },
    
    /**
     * Verifica se tem classe
     */
    hasClass(element, className) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        return element ? element.classList.contains(className) : false;
    },
    
    /**
     * Define conteúdo HTML
     */
    setHTML(element, html) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) {
            element.innerHTML = html;
        }
    },
    
    /**
     * Define texto
     */
    setText(element, text) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) {
            element.textContent = text;
        }
    },
    
    /**
     * Adiciona event listener
     */
    on(element, event, handler) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) {
            element.addEventListener(event, handler);
        }
    },
    
    /**
     * Remove event listener
     */
    off(element, event, handler) {
        if (typeof element === 'string') {
            element = this.get(element);
        }
        if (element) {
            element.removeEventListener(event, handler);
        }
    }
};

/**
 * Utilitários de animação
 */
const Animation = {
    /**
     * Fade in
     */
    fadeIn(element, duration = 300) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = '';
        element.classList.remove('hidden');
        
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = Math.min(progress / duration, 1);
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    /**
     * Fade out
     */
    fadeOut(element, duration = 300) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const opacity = initialOpacity * (1 - Math.min(progress / duration, 1));
            
            element.style.opacity = opacity;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                element.classList.add('hidden');
            }
        }
        
        requestAnimationFrame(animate);
    },
    
    /**
     * Slide in from top
     */
    slideInFromTop(element, duration = 300) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        element.style.transform = 'translateY(-20px)';
        element.style.opacity = '0';
        element.style.display = '';
        element.classList.remove('hidden');
        
        let start = null;
        
        function animate(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const factor = Math.min(progress / duration, 1);
            
            const translateY = -20 * (1 - factor);
            element.style.transform = `translateY(${translateY}px)`;
            element.style.opacity = factor;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                element.style.transform = '';
            }
        }
        
        requestAnimationFrame(animate);
    }
};

/**
 * Utilitários de validação
 */
const Validation = {
    /**
     * Valida se campo obrigatório está preenchido
     */
    required(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    /**
     * Valida email
     */
    email(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    
    /**
     * Valida se pelo menos uma opção foi selecionada em um grupo
     */
    radioGroup(name) {
        const radios = document.querySelectorAll(`input[name="${name}"]`);
        return Array.from(radios).some(radio => radio.checked);
    },
    
    /**
     * Mostra erro de validação
     */
    showError(element, message) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        // Remove erro anterior
        this.clearError(element);
        
        // Adiciona classe de erro
        element.classList.add('error');
        
        // Cria elemento de erro
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Insere após o elemento
        element.parentNode.insertBefore(errorElement, element.nextSibling);
    },
    
    /**
     * Remove erro de validação
     */
    clearError(element) {
        if (typeof element === 'string') {
            element = DOM.get(element);
        }
        
        if (!element) return;
        
        // Remove classe de erro
        element.classList.remove('error');
        
        // Remove mensagem de erro
        const errorElement = element.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
};

/**
 * Utilitários de formatação
 */
const Format = {
    /**
     * Formata data para exibição
     */
    date(date) {
        if (!date) return '';
        
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    /**
     * Formata porcentagem
     */
    percentage(value, total) {
        if (!total || total === 0) return '0%';
        return Math.round((value / total) * 100) + '%';
    },
    
    /**
     * Capitaliza primeira letra
     */
    capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    /**
     * Formata texto para ID
     */
    toId(str) {
        if (!str) return '';
        return str.toLowerCase()
                  .replace(/[áàâãä]/g, 'a')
                  .replace(/[éèêë]/g, 'e')
                  .replace(/[íìîï]/g, 'i')
                  .replace(/[óòôõö]/g, 'o')
                  .replace(/[úùûü]/g, 'u')
                  .replace(/[ç]/g, 'c')
                  .replace(/[^a-z0-9]/g, '_')
                  .replace(/_+/g, '_')
                  .replace(/^_|_$/g, '');
    }
};

/**
 * Utilitários de debounce e throttle
 */
const Timing = {
    /**
     * Debounce - executa função após delay sem novas chamadas
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },
    
    /**
     * Throttle - limita execução da função a uma vez por período
     */
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/**
 * Utilitários de notificação
 */
const Notification = {
    /**
     * Mostra notificação de sucesso
     */
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    },
    
    /**
     * Mostra notificação de erro
     */
    error(message, duration = 5000) {
        this.show(message, 'error', duration);
    },
    
    /**
     * Mostra notificação de informação
     */
    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    },
    
    /**
     * Mostra notificação
     */
    show(message, type = 'info', duration = 3000) {
        // Remove notificações anteriores
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());
        
        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Adiciona ao body
        document.body.appendChild(notification);
        
        // Event listener para fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Remove automaticamente após duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, duration);
        }
        
        // Anima entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
    }
};

