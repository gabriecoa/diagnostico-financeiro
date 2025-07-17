# 🚀 Guia de Instalação e Deploy - Diagnóstico Financeiro Empresarial

## 📁 Estrutura dos Arquivos

```
diagnostico-financeiro/
├── index.html              # Página principal (OBRIGATÓRIO)
├── css/
│   └── styles.css          # Estilos da aplicação (OBRIGATÓRIO)
├── js/
│   ├── app.js             # Aplicação principal (OBRIGATÓRIO)
│   ├── data.js            # Dados do questionário (OBRIGATÓRIO)
│   ├── questionnaire.js   # Lógica do questionário (OBRIGATÓRIO)
│   ├── classification.js  # Sistema de classificação (OBRIGATÓRIO)
│   ├── results.js         # Geração de resultados (OBRIGATÓRIO)
│   └── utils.js           # Utilitários (OBRIGATÓRIO)
├── README.md              # Documentação (OPCIONAL)
├── INSTALACAO.md          # Este arquivo (OPCIONAL)
└── docs/                  # Documentação adicional (OPCIONAL)
```

## 💻 Execução Local

### Opção 1: Abrir Diretamente no Navegador
1. Baixe todos os arquivos mantendo a estrutura de pastas
2. Abra o arquivo `index.html` diretamente no seu navegador
3. A aplicação funcionará imediatamente

### Opção 2: Servidor Local Simples (Recomendado)

#### Com Python (se instalado):
```bash
# Navegue até a pasta do projeto
cd diagnostico-financeiro

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Acesse: http://localhost:8000
```

#### Com Node.js (se instalado):
```bash
# Instale o http-server globalmente
npm install -g http-server

# Navegue até a pasta do projeto
cd diagnostico-financeiro

# Execute o servidor
http-server

# Acesse: http://localhost:8080
```

#### Com PHP (se instalado):
```bash
# Navegue até a pasta do projeto
cd diagnostico-financeiro

# Execute o servidor
php -S localhost:8000

# Acesse: http://localhost:8000
```

## 🌐 Deploy na Web

### Hospedagem Estática (Recomendado)

A aplicação é 100% estática, funcionando em qualquer servidor web:

#### 1. **Netlify** (Gratuito)
1. Acesse [netlify.com](https://netlify.com)
2. Arraste a pasta `diagnostico-financeiro` para o site
3. Sua aplicação estará online instantaneamente

#### 2. **Vercel** (Gratuito)
1. Acesse [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub ou faça upload da pasta
3. Deploy automático

#### 3. **GitHub Pages** (Gratuito)
1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Ative GitHub Pages nas configurações
4. Acesse via `https://seuusuario.github.io/nome-do-repo`

#### 4. **Firebase Hosting** (Gratuito)
```bash
# Instale Firebase CLI
npm install -g firebase-tools

# Faça login
firebase login

# Inicialize o projeto
firebase init hosting

# Selecione a pasta diagnostico-financeiro como public
# Deploy
firebase deploy
```

### Hospedagem Tradicional

Para servidores web tradicionais (Apache, Nginx, IIS):

1. **Faça upload** de todos os arquivos mantendo a estrutura
2. **Configure o servidor** para servir arquivos estáticos
3. **Defina index.html** como página inicial
4. **Teste** o acesso via navegador

#### Configuração Apache (.htaccess):
```apache
DirectoryIndex index.html
Options -Indexes

# Cache para arquivos estáticos
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Compressão
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

#### Configuração Nginx:
```nginx
server {
    listen 80;
    server_name seudominio.com;
    root /caminho/para/diagnostico-financeiro;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para arquivos estáticos
    location ~* \.(css|js)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }

    # Compressão
    gzip on;
    gzip_types text/plain text/css application/javascript text/xml application/xml;
}
```

## 🔧 Customização

### Alterando Cores e Estilos
- Edite o arquivo `css/styles.css`
- Modifique as variáveis CSS no início do arquivo:
```css
:root {
    --primary-color: #2563eb;    /* Cor principal */
    --secondary-color: #64748b;  /* Cor secundária */
    --success-color: #059669;    /* Cor de sucesso */
    --warning-color: #d97706;    /* Cor de aviso */
    --danger-color: #dc2626;     /* Cor de perigo */
}
```

### Modificando Perguntas
- Edite o arquivo `js/data.js`
- Modifique o objeto `questionnaireData`
- Mantenha a estrutura de seções e perguntas

### Ajustando Classificações
- Edite o arquivo `js/classification.js`
- Modifique as funções de classificação por seção
- Ajuste os critérios de pontuação

## 📋 Checklist de Deploy

### Antes do Deploy:
- [ ] Todos os arquivos obrigatórios estão presentes
- [ ] Estrutura de pastas mantida
- [ ] Teste local funcionando
- [ ] Responsividade verificada

### Após o Deploy:
- [ ] Site carregando corretamente
- [ ] Todas as seções funcionando
- [ ] Navegação entre páginas OK
- [ ] Relatórios sendo gerados
- [ ] Teste em diferentes dispositivos

## 🆘 Solução de Problemas

### Problema: Página em branco
**Solução:** Verifique se todos os arquivos JS estão carregando. Abra o console do navegador (F12) para ver erros.

### Problema: Estilos não carregam
**Solução:** Verifique se o arquivo `css/styles.css` está no local correto e se o caminho no HTML está certo.

### Problema: Questionário não funciona
**Solução:** Verifique se todos os arquivos JS estão presentes e se não há erros no console.

### Problema: Dados não salvam
**Solução:** Verifique se o localStorage está habilitado no navegador e se não há bloqueios de cookies.

## 📞 Suporte

Para problemas técnicos:
1. Verifique o console do navegador (F12)
2. Confirme se todos os arquivos estão presentes
3. Teste em navegador diferente
4. Verifique se JavaScript está habilitado

## 🔒 Requisitos Mínimos

### Navegadores Suportados:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Servidor Web:
- Qualquer servidor que sirva arquivos estáticos
- Não requer PHP, Python, Node.js ou banco de dados
- Funciona offline após primeiro carregamento

---

**A aplicação está pronta para uso imediato! Basta fazer upload dos arquivos e acessar via navegador.**

