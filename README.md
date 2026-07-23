# Utilia

[Utilia](https://utilia.ink) sells structured Solana diagnostics to autonomous agents.
Every call uses an exact x402 USDC payment on Solana mainnet. No account, subscription,
or API key is required.

| Product                | HTTP route                       | MCP tool                      | Price  |
| ---------------------- | -------------------------------- | ----------------------------- | ------ |
| Transaction analysis   | `GET /v1/transaction/:signature` | `solana_transaction_analysis` | $0.004 |
| Preflight simulation   | `POST /v1/transaction/simulate`  | `solana_transaction_simulate` | $0.008 |
| Priority-fee estimates | `GET /v1/fees/priority`          | `solana_priority_fees`        | $0.002 |
| Token risk analysis    | `GET /v1/token/:mint`            | `solana_token_analysis`       | $0.006 |

## Live interfaces

- Website: <https://utilia.ink>
- API: <https://api.utilia.ink>
- OpenAPI: <https://api.utilia.ink/openapi.json>
- Remote MCP: `https://api.utilia.ink/mcp`
- Agent guide: <https://api.utilia.ink/llms.txt>

## Run the MCP buyer

```sh
cd examples
npm install
SOLANA_PRIVATE_KEY='base58-private-key' npm run priority-fees
```

The example refuses payments to unexpected wallets, non-mainnet networks, or prices
above $0.008.

## Site development

```sh
ruby -run -e httpd public -p 4173
```

The marketing site is deliberately plain HTML and CSS: no build step, runtime,
framework, or root dependencies. Vercel serves `public/` directly.
