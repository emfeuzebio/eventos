# MSLogin - Sistema de Login Multi Sistemas e Organizações centralizado

![MSLogin Screenshot](./public/screenshot.png)  

**MSLogin** é uma solução de autenticação centralizada que fornece tokens **JWT** para usuários autorizados, integrando-se com uma **API RESTful Laravel 11**.  

## 📋 Descrição
MSLogin - Login Multi Sistemas - Login centralizado para organizações com vários sistemas e filiais. Entrega token JWT com as credenciais do usuário no sistema escolhido conforme os registros contido no backend API RESTful Laravel 11.

🔹 **Para organizações e suas filiais que precisam de um login único (SSO) para múltiplos sistemas.**  
🔹 **Gerenciamento seguro de tokens JWT.**  
🔹 **Interface moderna Responsiva baseada em Vue 3 + CoreUI.** (Desktop & Mobile - Modo Escuro/Claro)  
🔹 **Suporte a múltiplos idiomas**: Português (pt-BR) e Inglês (en-US) nativos

## 📦 Tecnologias Utilizadas
- **Frontend**: 
    - **Vue 3** (Composition API)
    - **CoreUI Free Vue Template** (Componentes UI)
    - **Pinia** (Gerenciamento de estado)
    - **Vite** (Build tool rápida)
    - **Axios** (Requisições HTTP)
    - **JWT** (JSon Web Tokens - Manipulação de tokens)
- **Backend (Integração)**: 
    - **Laravel 11** (API RESTful)
    - **Sanctum/JWT** (Autenticação)

## 🌍 Internacionalização (i18n)
- **Suporte a múltiplos idiomas**: Português (pt) e Inglês (us) nativos
- **Escalável**: Fácil adição de novos idiomas via arquivos JSON
- **Troca dinâmica**: Alteração de idioma em tempo real sem recarregar a página
- **Biblioteca**: `vue-i18n` (padrão Vue 3 para internacionalização)    

## Créditos
Este projeto utiliza [CoreUI Free Vue Admin Template](https://coreui.io/vue/) sob licença MIT.

## Licença
Este projeto é open-source, sob licença MIT.
MIT (ver [LICENSE](./LICENSE)).
**Atribuições**
- Desenvolvido por **Emerson Euzebio**
- Template UI baseado em **CoreUI Vue** (MIT License)

## Contato
- **Email**: emfeuzebio@hotmail.com
- **GitHub**: @emfeuzebio
- **Site**: https://mslogin.fazcomphp.com.br

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js **v18+**
- NPM **9+** ou Yarn
- Backend Laravel configurado (ou mock API)

### Instalação
```bash
# Clone o repositório
git clone https://github.com/emfeuzebio/mslogin-frontend.git
cd mslogin-frontend

# Instale as dependências
npm install  # ou yarn install

# Configure as variáveis de ambiente (crie um .env)
cp .env.example .env
git clone https://github.com/emfeuzebio/mslogin.git
cd mslogin
npm install
cp .env.example .env

### Variáveis de Ambiente (.env) Configuração
- VITE_APP_NAME=MSLogin
- VITE_APP_VERSION=1.0.0
- VITE_API_BASE_URL=http://localhost:8000/api
- VITE_JWT_TOKEN_KEY=mslogin_jwt

### Comandos Úteis
```bash
npm run dev	        # Inicia servidor de desenvolvimento
npm run build	    # Gera build de produção
npm run lint	    # Verifica erros de código
npm run preview	    # Testa o build localmente


