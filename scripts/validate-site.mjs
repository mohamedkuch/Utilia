import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = async (path) => readFile(new URL(path, root), "utf8");
const json = async (path) => JSON.parse(await read(path));

const rootManifest = await json("server.json");
const publicManifest = await json("public/server.json");
const agentMetadata = await json("public/agent402-metadata.json");
const packageJson = await json("package.json");
const vercelConfig = await json("vercel.json");
const nvmVersion = (await read(".nvmrc")).trim();
const workflow = await read(".github/workflows/ci.yml");
const publicFiles = await Promise.all([
  read("README.md"),
  read("public/index.html"),
  read("public/solana-transaction-support.html"),
  read("public/priority-fees.html"),
  read("public/pdf-to-markdown.html"),
  read("public/llms.txt"),
  read("public/agent402-metadata.json"),
  read("public/server.json"),
]);
const publicText = publicFiles.join("\n");

assert.deepEqual(
  publicManifest,
  rootManifest,
  "root and public MCP manifests must match",
);
assert.equal(publicManifest.name, "ink.utilia/solana-preflight");
assert.equal(publicManifest.version, "0.5.6");
assert.equal(
  publicManifest.repository?.url,
  "https://github.com/mohamedkuch/utilia-solana-agent",
);
assert.equal(publicManifest.packages?.[0]?.identifier, "utilia-solana-agent");
assert.equal(publicManifest.packages?.[0]?.version, "0.5.7");
assert.equal(publicManifest.remotes?.[0]?.url, "https://api.utilia.ink/mcp");
assert.equal(nvmVersion, "22.23.1");
assert.equal(packageJson.engines?.node, nvmVersion);
assert.equal(packageJson.packageManager, "npm@10.9.8");
assert.deepEqual(vercelConfig.rewrites, [
  {
    source: "/x/profile",
    destination: "/solana-transaction-support",
  },
  {
    source: "/x/tx-support",
    destination: "/solana-transaction-support",
  },
  {
    source: "/x/priority-fees",
    destination: "/priority-fees",
  },
]);
assert.match(workflow, new RegExp(`node-version: ${nvmVersion}`));
assert.match(workflow, /test "\$\(node --version\)" = "v22\.23\.1"/);
assert.match(workflow, /test "\$\(npm --version\)" = "10\.9\.8"/);

assert.deepEqual(agentMetadata.capabilities?.mcp?.tools, [
  "solana_priority_fees",
  "solana_transaction_analysis",
  "solana_transaction_simulate",
  "solana_token_analysis",
  "pdf_to_markdown",
  "normalize_audio",
]);
assert.equal(agentMetadata.endpoints?.length, 6);
assert.equal(
  agentMetadata.attributes?.find(
    ({ trait_type: type }) => type === "Price range",
  )?.value,
  "0.002–0.01 USDC",
);

for (const stale of [
  "github:mohamedkuch/utilia-solana-agent#befa103",
  "utilia-solana-agent@0.4.",
  '"version": "0.3.0",\n  "websiteUrl"',
  "Verified remote MCP test settlement",
  "github.com/mohamedkuch/utilia-x402",
]) {
  assert.equal(
    publicText.includes(stale),
    false,
    `stale public claim remains: ${stale}`,
  );
}

for (const required of [
  "utilia-solana-agent@0.5.7",
  "API 0.5.6",
  "https://api.utilia.ink/openapi.json",
  "https://api.utilia.ink/mcp",
  "https://github.com/mohamedkuch/utilia-solana-agent",
  "normalize_audio",
  "Paid by external wallets. Live on mainnet.",
  "Failed transaction.",
  "Fresh fee bids.",
  "agentcash@latest fetch",
  "https://api.utilia.ink/guides/transaction-diagnosis",
]) {
  assert.equal(
    publicText.includes(required),
    true,
    `required public claim is missing: ${required}`,
  );
}

assert.equal(
  publicText.includes("API 0.5.2"),
  false,
  "stale homepage API version remains",
);
assert.equal(
  publicText.includes("API 0.5.3"),
  false,
  "previous homepage API version remains",
);
assert.equal(
  publicText.includes("API 0.5.5"),
  false,
  "previous homepage API version remains",
);
assert.equal(
  publicText.includes("utilia-solana-agent@0.5.5"),
  false,
  "previous homepage client version remains",
);

for (const path of [
  "public/index.html",
  "public/solana-transaction-support.html",
  "public/priority-fees.html",
  "public/pdf-to-markdown.html",
  "public/llms.txt",
  "public/server.json",
  "public/agent402-metadata.json",
  "public/style.css",
  "public/icon.svg",
  "public/opengraph-image.png",
]) {
  await access(new URL(path, root));
}

console.log("Site metadata audit passed.");
