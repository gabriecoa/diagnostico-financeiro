# Fluxo de Navegação - Diagnóstico Financeiro Empresarial

## Estrutura da Aplicação

### 1. Página Inicial (Landing)
- **Título**: "Diagnóstico Financeiro Empresarial"
- **Descrição**: Breve explicação sobre a ferramenta
- **Botão**: "Iniciar Diagnóstico"
- **Elementos visuais**: Logo, ícones financeiros

### 2. Fluxo do Questionário
```
Início → Seção 1 → Seção 2 → Seção 3 → Seção 4 → Seção 5 → Seção 6 → Seção 7 → Relatório Final
```

### 3. Navegação Entre Seções
- **Barra de Progresso**: Mostra progresso atual (1/7, 2/7, etc.)
- **Botões de Navegação**:
  - "Anterior" (habilitado após seção 1)
  - "Próximo" (valida respostas antes de avançar)
  - "Finalizar" (apenas na última seção)

### 4. Estrutura de Cada Seção
```html
<section class="questionnaire-section">
  <header>
    <h2>Nome da Seção</h2>
    <p>Objetivo da seção</p>
  </header>
  
  <form class="questions-form">
    <!-- Perguntas específicas -->
  </form>
  
  <nav class="section-navigation">
    <button class="btn-previous">Anterior</button>
    <button class="btn-next">Próximo</button>
  </nav>
</section>
```

### 5. Tipos de Perguntas
- **Múltipla Escolha**: Radio buttons
- **Seleção Múltipla**: Checkboxes (quando aplicável)
- **Texto**: Input text para valores numéricos
- **Select**: Dropdown para listas extensas

### 6. Armazenamento de Dados
- **localStorage**: Salva respostas automaticamente
- **Estrutura JSON**:
```javascript
{
  "secao1": {
    "pergunta1": "resposta",
    "pergunta2": "resposta"
  },
  "secao2": { ... },
  // ...
  "timestamp": "2025-07-17T10:15:00Z",
  "completed": false
}
```

### 7. Página de Resultados
- **Resumo por Seção**: Classificação (Alta/Média/Baixa)
- **Pontuação Total**: Soma das classificações
- **Diagnóstico Geral**: Baseado na pontuação
- **Recomendações**: Personalizadas por seção
- **Ações**:
  - Baixar PDF
  - Enviar por Email
  - Refazer Diagnóstico

### 8. Estados da Aplicação
- **Inicial**: Página de boas-vindas
- **Em Progresso**: Navegando pelas seções
- **Pausado**: Dados salvos no localStorage
- **Concluído**: Exibindo resultados

### 9. Responsividade
- **Desktop**: Layout em duas colunas
- **Tablet**: Layout adaptado
- **Mobile**: Layout em coluna única, navegação otimizada

### 10. Validações
- **Por Pergunta**: Validação em tempo real
- **Por Seção**: Validação antes de avançar
- **Feedback Visual**: Destaque de campos obrigatórios

