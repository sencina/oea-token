# OEA Token Backend Service

This package provides the backend service for the OEA NFT system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=10000

# API Keys
TATUM_API_KEY=your_tatum_api_key
INFURA_API_KEY=your_infura_api_key

# Blockchain Configuration
WALLET_PRIVATE_KEY=your_private_key
DEPLOYER_ADDRESS=your_deployer_address

# Network Configuration
# For local development:
PROVIDER_URL=http://127.0.0.1:8545
NETWORK_NAME=hardhat

# For Amoy testnet:
# PROVIDER_URL=https://polygon-amoy.infura.io/v3/your_infura_key
# NETWORK_NAME=amoy

# NFT Contract Addresses
NFT_ADDRESS=your_proxy_address
NFT_ADMIN_ADDRESS=your_proxy_admin_address
NFT_IMPLEMENTATION_ADDRESS=your_implementation_address
```

## Supported Networks

### Local Development (Hardhat)
- Chain ID: 31337
- RPC URL: http://127.0.0.1:8545
- Requires running local Hardhat node
- Use contract addresses from local deployment

### Polygon Amoy (Testnet)
- Chain ID: 80002
- RPC URL: https://polygon-amoy.infura.io/v3/your_infura_key
- Requires Infura API key
- Requires test MATIC tokens
- Use contract addresses from Amoy deployment

## Development

### Running Locally

1. Start the local Hardhat node (in web3 package):
```bash
cd ../web3
npx hardhat node
```

2. Deploy contracts locally:
```bash
npx hardhat run ignition/modules/OEANFTs.ts --network hardhat
```

3. Copy the deployed contract addresses to your `.env` file

4. Start the development server:
```bash
npm run dev
```

### Connecting to Amoy Network

1. Update your `.env` file with Amoy configuration:
```env
PROVIDER_URL=https://polygon-amoy.infura.io/v3/your_infura_key
NETWORK_NAME=amoy
```

2. Deploy contracts to Amoy (if not already deployed):
```bash
cd ../web3
npx hardhat run ignition/modules/OEANFTs.ts --network amoy
```

3. Copy the Amoy contract addresses to your `.env` file

4. Start the server:
```bash
npm run dev
```

## API Endpoints

### Health Check
- GET `/health`: Check service health

### Projects
- POST `/projects`: Create a new project and mint NFT
- GET `/projects`: List all projects
- GET `/projects/:id`: Get project details

## Docker Support

Build and run with Docker:

```bash
docker build -t oea-token .
docker run -p 10000:10000 --env-file .env oea-token
```

Or use docker-compose:

```bash
docker-compose up
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 10000 |
| TATUM_API_KEY | Tatum API key | Yes | - |
| INFURA_API_KEY | Infura API key | Yes* | - |
| WALLET_PRIVATE_KEY | Private key for transactions | Yes | - |
| DEPLOYER_ADDRESS | Contract deployer address | Yes | - |
| PROVIDER_URL | Blockchain RPC URL | No | http://127.0.0.1:8545 |
| NETWORK_NAME | Network name (hardhat/amoy) | No | hardhat |
| NFT_ADDRESS | NFT proxy contract address | Yes | - |
| NFT_ADMIN_ADDRESS | Proxy admin contract address | Yes | - |
| NFT_IMPLEMENTATION_ADDRESS | Implementation contract address | Yes | - |

*Required for Amoy network

## Error Handling

The service includes comprehensive error handling:
- Contract interaction errors
- Network configuration errors
- Invalid input validation
- Missing environment variables

## Security

- Environment variables for sensitive data
- Input validation for all endpoints
- Rate limiting on API endpoints
- Error handling without exposing internals
- Secure contract interaction 