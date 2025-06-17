# OEA Token Backend Service

This service handles the NFT minting, authentication, and project management for the OEA (Open Educational Assets) platform.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (if running locally)
- Access to an Ethereum network (testnet or mainnet)
- IPFS storage access (via Tatum)

## Setup

1. **Deploy Smart Contracts**
   First, deploy the smart contracts from the `web3` package:
   ```bash
   cd ../web3
   npm install
   npx hardhat run ignition/modules/OEANFTs.ts --network <your-network>
   ```
   This will deploy:
   - Implementation Contract
   - Proxy Admin Contract
   - Transparent Proxy Contract
   
   The addresses will be saved in `contract-addresses.json`.

2. **Environment Configuration**
   Create a `.env` file in the root of the `oea-token` package with the following variables:
   ```env
   PORT=8080
   NETWORK_NAME=<your-network>
   NFT_ADDRESS=<proxy-contract-address>
   DEPLOYER_ADDRESS=<deployer-wallet-address>
   WALLET_PRIVATE_KEY=<your-private-key>
   PROVIDER_URL=<your-provider-url>
   INFURA_API_KEY=<your-infura-key>
   TATUM_API_KEY=<your-tatum-key>
   ```

   Replace the placeholders with:
   - `<your-network>`: The network where you deployed the contracts (e.g., "network", "sepolia", etc.)
   - `<proxy-contract-address>`: The address of the deployed proxy contract
   - `<deployer-wallet-address>`: The address that deployed the contracts
   - `<your-private-key>`: The private key of the wallet that will mint NFTs
   - `<your-provider-url>`: Your Ethereum node provider URL
   - `<your-infura-key>`: Your Infura API key
   - `<your-tatum-key>`: Your Tatum API key for IPFS storage

## Running the Application

### Using Docker (Recommended)

1. Build and start the container:
   ```bash
   docker-compose up --build
   ```

   The service will be available at `http://localhost:8080`

### Running Locally (Not Recommended)

Running locally requires additional system dependencies for the `canvas` module:

1. Install system dependencies (Ubuntu/Debian):
   ```bash
   apt-get update && apt-get install -y \
       build-essential \
       libcairo2-dev \
       libpango1.0-dev \
       libjpeg-dev \
       libgif-dev \
       librsvg2-dev
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the service:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /api/project`
  - Creates a new project and mints an NFT
  - Requires: project name and recipient address

- `GET /api/project/:address/:tokenId`
  - Authenticates token ownership
  - Returns: authentication status

## Development

The service uses TypeScript and follows a modular architecture:
- `src/modules/nft`: NFT contract interaction
- `src/modules/image`: Image generation and IPFS storage
- `src/modules/project`: Project management and API endpoints

## Troubleshooting

1. **Canvas Module Issues**
   If you encounter Node.js version compatibility issues with the `canvas` module, use the Docker setup instead of running locally.

2. **Contract Connection Issues**
   - Verify your network configuration
   - Check that the proxy contract address is correct
   - Ensure your provider URL is accessible

3. **Transaction Failures**
   - Check that the wallet has sufficient funds
   - Verify the network gas settings
   - Check the contract's current state

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 