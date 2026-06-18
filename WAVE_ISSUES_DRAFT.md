# Wave Issues Draft

Five scoped GitHub issues ready for outside open-source contributors.
Review and post manually — do not create these automatically.

---

## Issue 1 — Replace hardcoded contract ID placeholders with environment variables

**Complexity:** Medium

### Description

`lib/contracts.ts` currently uses three hardcoded string placeholders as contract IDs:

```ts
const TOKEN_CONTRACT_WASM   = 'token_contract_id_placeholder';
const VESTING_CONTRACT_WASM = 'vesting_contract_id_placeholder';
const AIRDROP_CONTRACT_WASM = 'airdrop_contract_id_placeholder';
```

These are passed directly into `new Contract(...)`, which means every deployment attempt fails silently with a generic error. The correct contract addresses need to be injected via environment variables so the app can work on both testnet and mainnet without code changes.

### Acceptance Criteria

- [ ] Three new env vars are added to `.env.example` with empty values and comments:
  - `NEXT_PUBLIC_TOKEN_CONTRACT_ID`
  - `NEXT_PUBLIC_VESTING_CONTRACT_ID`
  - `NEXT_PUBLIC_AIRDROP_CONTRACT_ID`
- [ ] `lib/contracts.ts` reads these via `process.env.NEXT_PUBLIC_*` instead of hardcoded strings
- [ ] If any of the three vars is missing at runtime, a clear `Error` is thrown describing which variable is absent (fail fast, not silently)
- [ ] README Stellar Integration section is updated to document the three env vars
- [ ] `npm run build` continues to pass

---

## Issue 2 — Replace mock data in `useLaunches`, `useVesting`, and `useAirdrop` with real Soroban RPC queries

**Complexity:** High

### Description

All three data hooks return hardcoded mock arrays behind a `setTimeout` instead of querying the Soroban contracts:

- `hooks/useLaunches.ts` — 3 fake `TokenLaunch` entries
- `hooks/useVesting.ts` — 1 fake `VestingSchedule`
- `hooks/useAirdrop.ts` — 1 fake `AirdropCampaign`

Similarly, `claimVested()` in `useVesting` and `distributeCampaign()` in `useAirdrop` simulate on-chain actions with `setTimeout` rather than building, signing, and submitting real Soroban transactions via Freighter.

The `ContractService` class in `lib/contracts.ts` already handles `deployToken`, `deployVesting`, and `deployAirdrop` — the same pattern should be extended for read calls and claim/distribute actions.

This issue depends on Issue 1 (env vars) being resolved first.

### Acceptance Criteria

- [ ] `useLaunches` fetches real token launch data from the Soroban RPC for the connected network
- [ ] `useVesting` fetches vesting schedules owned by the connected wallet's public key
- [ ] `useAirdrop` fetches airdrop campaigns created by the connected wallet
- [ ] `claimVested(scheduleId)` builds a real transaction, signs it via Freighter, and submits it
- [ ] `distributeCampaign(campaignId)` does the same for airdrop distribution
- [ ] Loading and error states are derived from real async operations, not `setTimeout`
- [ ] All mock data arrays and `setTimeout` stubs are removed
- [ ] `npm run build` continues to pass

---

## Issue 3 — Replace hardcoded mock holders with real on-chain holder data on the Token Detail page

**Complexity:** Medium

### Description

`app/token/[id]/page.tsx` renders a "Top Holders" tab using a `mockHolders` array defined directly inside the component:

```ts
const mockHolders = [
  { address: 'GAHK7EEG2...', balance: '25000000000000', percentage: 25 },
  { address: 'GDQP2KPQG...', balance: '20000000000000', percentage: 20 },
  ...
];
```

This means every token's Holders tab shows the same four fake addresses regardless of which token is being viewed. Real holder data should be fetched from Horizon's `/accounts` endpoint filtered by the token's contract address, or from Stellar Expert's public API.

### Acceptance Criteria

- [ ] A `useTokenHolders(tokenAddress, network)` hook (or similar) is created in `hooks/`
- [ ] The hook fetches real top holder data for the given token contract address
- [ ] `mockHolders` and its direct usage in `app/token/[id]/page.tsx` are removed
- [ ] The Holders tab shows a loading skeleton while data is fetching
- [ ] If the query fails or returns empty, an appropriate `EmptyState` is rendered
- [ ] Holder addresses link to Stellar Expert for the correct network (testnet vs mainnet)
- [ ] `npm run build` continues to pass

---

## Issue 4 — Wire up the standalone "Create Vesting Schedule" and "Create Airdrop Campaign" pages to real contract deployments

**Complexity:** Medium

### Description

Both standalone creation pages currently simulate deployment with a `setTimeout` redirect:

`app/vesting/new/page.tsx`:
```ts
// Mock deployment
setTimeout(() => {
  setIsDeploying(false);
  window.location.href = '/vesting';
}, 3000);
```

`app/airdrop/new/page.tsx`:
```ts
// Mock deployment
setTimeout(() => {
  setIsDeploying(false);
  window.location.href = '/airdrop';
}, 3000);
```

Neither page calls `ContractService`, signs anything via Freighter, or submits a transaction. The `ContractService.deployVesting()` and `ContractService.deployAirdrop()` methods already exist in `lib/contracts.ts` and are ready to be used.

Input validation is also incomplete — Stellar address format (`/^G[A-Z2-7]{55}$/` and `/^C[A-Z2-7]{55}$/`) is not checked against the patterns already defined in `lib/constants.ts`.

### Acceptance Criteria

- [ ] `app/vesting/new/page.tsx` calls `ContractService.deployVesting()`, signs the returned XDR via Freighter, and submits it to the network
- [ ] `app/airdrop/new/page.tsx` calls `ContractService.deployAirdrop()`, signs, and submits
- [ ] Both pages validate address fields using `VALIDATION_PATTERNS.STELLAR_ADDRESS` and `VALIDATION_PATTERNS.CONTRACT_ADDRESS` from `lib/constants.ts` and show inline errors on invalid input
- [ ] On success, the deployed contract address is displayed before redirecting
- [ ] On failure, a clear error message is shown (no silent failures)
- [ ] The `// Mock deployment` `setTimeout` stubs are removed entirely
- [ ] `npm run build` continues to pass

---

## Issue 5 — Token detail page always links to testnet on Stellar Expert regardless of connected network

**Complexity:** Trivial

### Description

The Stellar Expert link in `app/token/[id]/page.tsx` hardcodes `testnet` in the URL:

```tsx
href={`https://stellar.expert/explorer/testnet/contract/${launch.tokenAddress}`}
```

If a user is connected to mainnet, this link will either 404 or show the wrong data. The URL should reflect the wallet's active network (`testnet` or `mainnet`).

The same pattern may affect other parts of the codebase that construct Stellar Expert links.

### Acceptance Criteria

- [ ] The Stellar Expert link in `app/token/[id]/page.tsx` uses the connected wallet's `network` value from `useWallet()` to build the correct URL (`testnet` or `mainnet`)
- [ ] A grep of the full codebase for `stellar.expert/explorer/testnet` is done and any other hardcoded occurrences are fixed the same way
- [ ] No UI layout or styling changes are made
- [ ] `npm run build` continues to pass
