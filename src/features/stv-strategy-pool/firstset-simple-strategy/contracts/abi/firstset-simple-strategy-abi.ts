// Minimal ABI for FirstsetSimpleStrategy: the generic IStrategy surface plus the
// few views this strategy adds. Deliberately hand-written and small -- it has no
// external protocol behind it, so there is no queue or share-manager ABI to carry.
export const FirstsetSimpleStrategyAbi = [
  {
    type: 'function',
    name: 'STRATEGY_ID',
    inputs: [],
    outputs: [{ type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'MAX_MINT_BP',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'POOL',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'WSTETH',
    inputs: [],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ALLOW_LIST_ENABLED',
    inputs: [],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'SUPPLY_FEATURE',
    inputs: [],
    outputs: [{ type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'REDEEM_FEATURE',
    inputs: [],
    outputs: [{ type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isFeaturePaused',
    inputs: [{ name: '_featureId', type: 'bytes32' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isAllowListed',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getStrategyCallForwarderAddress',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'assetsOf',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'stvOf',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'wstethOf',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mintedStethSharesOf',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    // NB: returns min(pool capacity, MAX_MINT_BP cap). Always quote from here --
    // the pool's own view ignores this strategy's cap and would over-report.
    type: 'function',
    name: 'remainingMintingCapacitySharesOf',
    inputs: [
      { name: '_user', type: 'address' },
      { name: '_ethToFund', type: 'uint256' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'supply',
    inputs: [
      { name: '_referral', type: 'address' },
      { name: '_wstethToMint', type: 'uint256' },
      { name: '_params', type: 'bytes' },
    ],
    outputs: [{ name: 'stv', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'burnWsteth',
    inputs: [{ name: '_wstethToBurn', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'requestWithdrawalFromPool',
    inputs: [
      { name: '_recipient', type: 'address' },
      { name: '_stvToWithdraw', type: 'uint256' },
      { name: '_stethSharesToRebalance', type: 'uint256' },
    ],
    outputs: [{ name: 'requestId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const;

export type FirstsetSimpleStrategyAbiType = typeof FirstsetSimpleStrategyAbi;
