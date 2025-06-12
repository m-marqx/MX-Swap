# MX Swap

O **MX Swap** é uma plataforma de negociação que utiliza dois agregadores exchanges descentralizada para buscar o melhor preço. O sistema combina os agregadores KyberSwap e VeloraSwap para oferecer as melhores cotações de swap, um visualizador de portfólio em tempo real e Sinais de IA para otimizar estratégias de negociação e maximizar retornos.

Este projeto foi desenvolvido com React, [Next.js](https://github.com/vercel/next.js) e [@reown/appkit](https://github.com/reown/appkit).

## Funcionalidades Principais

O dApp é dividido em várias seções principais, cada uma com um propósito específico para fornecer uma experiência de trading completa:

### Swap

  - **Página de Swap:** Permite que os usuários troquem (swap) criptomoedas de forma eficiente. A plataforma consulta os agregadores **KyberSwap** e **VeloraSwap**, oferecendo a opção de escolher automaticamente a rota com o melhor preço para a transação.

### AI Signals

  - **Análise de Performance:** Exibe gráficos detalhados sobre o desempenho do modelo de Machine Learning (CatBoost) e o compara com as variações mensais do ativo de referência (Bitcoin).
  - **Histórico de Operações:** Uma tabela responsável por mostrar todas as posições de trading recomendadas pela IA, incluindo status (aberta/fechada), data, capital alocado e resultado.

### Portfolio

  - **Balanço e Alocação:** Apresenta o saldo total da carteira do usuário e um gráfico de alocação que distingue a porcentagem de ativos em *stablecoins* (moedas estáveis pareadas com o dólar) e outros tokens.
  - **Histórico de Transações:** Lista as últimas 100 transações da carteira conectada, com um resumo claro de cada operação (data, taxas, tokens trocados).

### Outras Funcionalidades

  - **Conectividade:** Suporte integrado para WalletConnect e SIWE (Sign-In With Ethereum).
  - **Responsividade:** Interface de usuário totalmente responsiva, garantindo uma ótima experiência em desktops e dispositivos móveis.
  - **Componentização:** Construído com componentes de UI modulares (botões, diálogos, cards, etc.) para fácil manutenção e escalabilidade.
  - **Tecnologias:** Desenvolvido com TypeScript e estilizado com Tailwind CSS e ShadCN.

## Estrutura do Projeto

```
├── blocks/                        # Blocos visuais reutilizáveis (ex: fundos animados)
│   └── Backgrounds/
│       └── Squares/
├── components/                    # Componentes de UI reutilizáveis (botões, cards, inputs, etc.)
│   └── ui/
├── hooks/                         # Hooks customizados (ex: use-mobile, use-pagination)
├── lib/                           # Funções utilitárias e helpers
│   └── utils.ts
├── public/                        # Arquivos estáticos públicos (ícones, imagens)
│   └── icons/
├── src/
│   ├── app/                       # Diretório principal do Next.js (rotas e páginas)
│   │   ├── page.tsx               # Página root: introdução ao dApp e navegação para as demais páginas
│   │   ├── swap/                  # Página de Swap
│   │   │   └── page.tsx           # Permite ao usuário realizar swaps de criptomoedas via KyberSwap/VeloraSwap
│   │   │   └── [dependências]     # Componentes: SwapWidget, seleção de agregador, exibição de cotações
│   │   ├── ai-signals/            # Página de AI Signals
│   │   │   └── page.tsx           # Mostra performance do modelo CatBoost, ativo de referência e tabela de resultados
│   │   │   └── [dependências]     # Componentes: gráficos de performance, tabela de operações recomendadas
│   │   ├── portfolio/             # Página de Portfolio
│   │   │   └── page.tsx           # Exibe saldo, alocação em stablecoins/outros tokens e histórico de transações
│   │   │   └── [dependências]     # Componentes: gráfico de alocação, tabela de transações, resumo de saldo
│   │   └── layout.tsx             # Layout global das páginas (NavBar, rodapé, etc.)
│   ├── components/                # Componentes específicos de features (NavBar, SwapWidget, WalletConnect, etc.)
│   ├── server/                    # Lógica de backend (ex: integração com DB, API)
│   │   └── db/                    # Configuração e acesso ao banco de dados (drizzle-orm)
│   ├── styles/                    # Estilos globais e configurações do Tailwind CSS
│   └── ...
├── types/                         # Definições de tipos TypeScript globais
│   └── AcoountTypes.ts            # Tipos relacionados à carteira do usuário
├── package.json                   # Dependências e scripts do projeto
└── ...
```

## Como Começar

1.  **Instale as dependências:**

    ```
    npm run install
    ```

2.  **Configure as variáveis de ambiente:**

      - Copie o arquivo `.env.example` para `.env` e preencha os valores necessários (ex: `NEXT_PUBLIC_PROJECT_ID` do WalletConnect).

3.  **Execute o servidor de desenvolvimento:**

    ```
    npm run dev
    ```

4.  **Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador.**

## Scripts Disponíveis

  - `npm run dev` – Inicia o servidor de desenvolvimento.
  - `npm run build` – Compila o projeto para o ambiente de produção.
  - `npm run lint` – Executa o ESLint para análise de código.

## Configuração

  - **WalletConnect/AppKit:** Configure seu `projectId` e as configurações de rede no arquivo `appkit.ts`.
  - **Tema da UI:** O tema e os estilos globais são gerenciados pelo Tailwind CSS no arquivo `globals.css`.
