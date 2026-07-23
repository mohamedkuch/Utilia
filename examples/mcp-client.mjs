import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createKeyPairSignerFromBytes } from "@solana/kit";
import { createx402MCPClient } from "@x402/mcp";
import { toClientSvmSigner } from "@x402/svm";
import { ExactSvmScheme } from "@x402/svm/exact/client";
import bs58 from "bs58";
import process from "node:process";

const endpoint = "https://api.utilia.ink/mcp";
const payTo = "AX1TzKChcrgjVW2JMtcYFLgxerfH1XfW7etuSdMSUKh5";
const mainnet = "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp";
const maxAtomicUsdc = 8_000;

const privateKey = process.env.SOLANA_PRIVATE_KEY;
if (!privateKey)
  throw new Error("Set SOLANA_PRIVATE_KEY to a base58 private key");

const keyBytes = bs58.decode(privateKey);
if (keyBytes.length !== 64)
  throw new Error("Private key must decode to 64 bytes");
const keypair = await createKeyPairSignerFromBytes(keyBytes);
keyBytes.fill(0);

const client = createx402MCPClient({
  name: "utilia-example-agent",
  version: "1.0.0",
  schemes: [
    {
      network: "solana:*",
      client: new ExactSvmScheme(toClientSvmSigner(keypair)),
    },
  ],
  autoPayment: true,
  onPaymentRequested: ({ paymentRequired }) =>
    paymentRequired.accepts.some(
      (requirement) =>
        requirement.network === mainnet &&
        requirement.payTo === payTo &&
        Number(requirement.amount) <= maxAtomicUsdc,
    ),
});

const tool = process.argv[2] ?? "solana_priority_fees";
const args = JSON.parse(process.argv[3] ?? '{"accounts":[]}');

try {
  await client.connect(new StreamableHTTPClientTransport(new URL(endpoint)));
  const result = await client.callTool(tool, args);
  const text = result.content.find((item) => item.type === "text")?.text;
  process.stdout.write(`${text ?? JSON.stringify(result.content)}\n`);
} finally {
  await client.close().catch(() => undefined);
}
