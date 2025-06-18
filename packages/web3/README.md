# OEA NFT Smart Contracts

This package contains the smart contracts for the OEA NFT system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
WALLET_PRIVATE_KEY=your_private_key
NETWORK_URL=network_rpc_url
```

## Networks

The project supports the following networks:

### Local Development (Hardhat)
- Chain ID: 31337
- RPC URL: http://127.0.0.1:8545
- No environment variables needed

### Polygon Amoy (Testnet)
- Chain ID: 80002
- RPC URL: https://polygon-amoy.infura.io/v3/your_infura_key
- Requires Infura API key
- Requires test MATIC tokens

## Deployment

### Local Deployment
```bash
# Start local hardhat node
npx hardhat node

# In a new terminal, deploy contracts
npx hardhat run ignition/modules/OEANFTs.ts --network hardhat
```

### Amoy Network Deployment
1. Set up your `.env` file with Amoy network configuration:
```env
WALLET_PRIVATE_KEY=your_private_key
NETWORK_URL=https://polygon-amoy.infura.io/v3/your_infura_key
```

2. Deploy the contracts:
```bash
npx hardhat run ignition/modules/OEANFTs.ts --network amoy
```

## Contract Upgrades

To upgrade the contract implementation:

```bash
npx hardhat run ignition/modules/upgradeOEANFTs.ts --network <network_name>
```

Replace `<network_name>` with either `hardhat` or `amoy`.

## Contract Addresses

Contract addresses are stored in `ignition/contract-addresses.json` after deployment. The file structure is:

```json
{
  "network_name": {
    "implementation": "0x...",
    "proxyAdmin": "0x...",
    "proxy": "0x...",
    "network": "network_name"
  }
}
```

## Development

1. Make changes to contracts in `contracts/` directory
2. Run tests:
```bash
npx hardhat test
```
3. Deploy changes:
```bash
npx hardhat run ignition/modules/OEANFTs.ts --network <network_name>
```

## Security

- Never commit your `.env` file
- Keep your private keys secure
- Use different wallets for development and production
- Test thoroughly before deploying to mainnet
