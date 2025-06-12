---
#### Leia este README em [PT-BR](https://github.com/m-marqx/MX-Swap/blob/main/LEIAME.md)
---

# MX Swap

**MX Swap** is a trading platform that utilizes two decentralized exchange aggregators to find the best price. The system combines the KyberSwap and VeloraSwap aggregators to offer the best swap quotes, a real-time portfolio viewer, and AI Signals to optimize trading strategies and maximize returns.

This project was developed with React, [Next.js](https://github.com/vercel/next.js), and [@reown/appkit](https://github.com/reown/appkit).

## Key Features

The dApp is divided into several main sections, each with a specific purpose to provide a complete trading experience:

### Swap

  - **Swap Page:** Allows users to efficiently swap cryptocurrencies. The platform queries the **KyberSwap** and **VeloraSwap** aggregators, offering the option to automatically choose the route with the best price for the transaction.

### AI Signals

  - **Performance Analysis:** Displays detailed charts on the performance of the Machine Learning model (CatBoost) and compares it with the monthly variations of the reference asset (Bitcoin).
  - **Operations History:** A table responsible for showing all trading positions recommended by the AI, including status (open/closed), date, allocated capital, and result.

### Portfolio

  - **Balance and Allocation:** Presents the user's total wallet balance and an allocation chart that distinguishes the percentage of assets in *stablecoins* (stable currencies pegged to the dollar) and other tokens.
  - **Transaction History:** Lists the last 100 transactions of the connected wallet, with a clear summary of each operation (date, fees, tokens swapped).

### Other Features

  - **Connectivity:** Integrated support for WalletConnect and SIWE (Sign-In With Ethereum).
  - **Responsiveness:** Fully responsive user interface, ensuring a great experience on desktops and mobile devices.
  - **Component-Based:** Built with modular UI components (buttons, dialogs, cards, etc.) for easy maintenance and scalability.
  - **Technologies:** Developed with TypeScript and styled with Tailwind CSS and ShadCN.

## Project Structure

```
├── blocks/                        # Reusable visual blocks (e.g., animated backgrounds)
│   └── Backgrounds/
│       └── Squares/
├── components/                    # Reusable UI components (buttons, cards, inputs, etc.)
│   └── ui/
├── hooks/                         # Custom hooks (e.g., use-mobile, use-pagination)
├── lib/                           # Utility functions and helpers
│   └── utils.ts
├── public/                        # Public static files (icons, images)
│   └── icons/
├── src/
│   ├── app/                       # Main Next.js directory (routes and pages)
│   │   ├── page.tsx               # Root page: dApp introduction and navigation to other pages
│   │   ├── swap/                  # Swap Page
│   │   │   └── page.tsx           # Allows the user to perform cryptocurrency swaps via KyberSwap/VeloraSwap
│   │   │   └── [dependencies]     # Components: SwapWidget, aggregator selection, quote display
│   │   ├── ai-signals/            # AI Signals Page
│   │   │   └── page.tsx           # Shows CatBoost model performance, reference asset, and results table
│   │   │   └── [dependencies]     # Components: performance charts, table of recommended operations
│   │   ├── portfolio/             # Portfolio Page
│   │   │   └── page.tsx           # Displays balance, allocation in stablecoins/other tokens, and transaction history
│   │   │   └── [dependencies]     # Components: allocation chart, transaction table, balance summary
│   │   └── layout.tsx             # Global page layout (NavBar, footer, etc.)
│   ├── components/                # Feature-specific components (NavBar, SwapWidget, WalletConnect, etc.)
│   ├── server/                    # Backend logic (e.g., DB integration, API)
│   │   └── db/                    # Database configuration and access (drizzle-orm)
│   ├── styles/                    # Global styles and Tailwind CSS settings
│   └── ...
├── types/                         # Global TypeScript type definitions
│   └── AcoountTypes.ts            # Types related to the user's wallet
├── package.json                   # Project dependencies and scripts
└── ...
```

## Getting Started

1.  **Install the dependencies:**

    ```
    npm run install
    ```

2.  **Set up environment variables:**

      - Copy the `.env.example` file to `.env` and fill in the required values (e.g., `NEXT_PUBLIC_PROJECT_ID` from WalletConnect).

3.  **Run the development server:**

    ```
    npm run dev
    ```

4.  **Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.**

## Available Scripts

  - `npm run dev` – Starts the development server.
  - `npm run build` – Compiles the project for the production environment.
  - `npm run lint` – Runs ESLint for code analysis.

## Configuration

  - **WalletConnect/AppKit:** Configure your `projectId` and network settings in the `appkit.ts` file.
  - **UI Theme:** The theme and global styles are managed by Tailwind CSS in the `globals.css` file.