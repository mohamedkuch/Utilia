# Utilia PDF and Solana Agent Tools

[Utilia](https://utilia.ink) converts public PDFs to agent-ready Markdown and gives
transaction agents live Solana intelligence. Every call uses an exact x402 USDC
payment. No account, subscription, or API key is required.

| Product                | HTTP route                       | MCP tool                      | Price   |
| ---------------------- | -------------------------------- | ----------------------------- | ------- |
| Transaction analysis   | `GET /v1/transaction/:signature` | `solana_transaction_analysis` | $0.004  |
| Preflight simulation   | `POST /v1/transaction/simulate`  | `solana_transaction_simulate` | $0.008  |
| Priority-fee estimates | `GET /v1/fees/priority`          | `solana_priority_fees`        | $0.002  |
| Token risk analysis    | `GET /v1/token/:mint`            | `solana_token_analysis`       | $0.006  |
| PDF to Markdown        | `POST /v1/pdf/to-markdown`       | `pdf_to_markdown`             | $0.0025 |

## Live interfaces

- Website: <https://utilia.ink>
- API: <https://api.utilia.ink>
- OpenAPI: <https://api.utilia.ink/openapi.json>
- Remote MCP: `https://api.utilia.ink/mcp`
- Agent guide: <https://api.utilia.ink/llms.txt>
- Agent402 Marketplace record: <https://marketplace.agent402.app/api/v1/marketplace/agents/72d76bfa-adb0-40ea-8601-79d8345ab3ec>
- Agora402 Registry: <https://agora402.io/agents/9967cabb-4b2d-4f1f-af98-e19ca77a5768>
- 8004market on-chain identity #1462: <https://8004market.io/agent/solana/mainnet-beta/1462>
- x402 Arena: <https://x402arena.gg>

## Run the MCP buyer

Convert a public PDF in one command:

```sh
SOLANA_KEYPAIR_PATH=/absolute/path/to/agent-wallet.json \
  npx -y utilia-solana-agent pdf-to-markdown \
  https://example.com/document.pdf --max-pages 50
```

```sh
cd examples
npm install
SOLANA_PRIVATE_KEY='base58-private-key' npm run priority-fees
```

For a budget-capped JSONL feed at five calls per hour:

```sh
SOLANA_KEYPAIR_PATH=/absolute/path/to/agent-wallet.json \
  npx -y utilia-solana-agent watch-fees --every 12m --max-calls 25
```

The example refuses payments to unexpected wallets, non-mainnet networks, or prices
above $0.008.

## Site development

```sh
ruby -run -e httpd public -p 4173
```

The marketing site is deliberately plain HTML and CSS: no build step, runtime,
framework, or root dependencies. Vercel serves `public/` directly.
