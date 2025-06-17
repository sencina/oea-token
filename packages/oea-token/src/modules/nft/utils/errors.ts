/**
 * Custom error for contract-related issues
 */
export class ContractError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ContractError';
  }
}

/**
 * Error thrown when contract addresses are not found for the current network
 */
export class ContractAddressNotFoundError extends ContractError {
  constructor(network: string) {
    super(`No contract addresses found for network ${network}`);
    this.name = 'ContractAddressNotFoundError';
  }
}

/**
 * Error thrown when the contract deployment file is not found or invalid
 */
export class ContractConfigurationError extends ContractError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = 'ContractConfigurationError';
  }
}

/**
 * Error thrown when a contract transaction fails
 */
export class ContractTransactionError extends ContractError {
  constructor(operation: string, cause?: unknown) {
    super(`Contract transaction failed during ${operation}`, cause);
    this.name = 'ContractTransactionError';
  }
}

/**
 * Error thrown when contract initialization fails
 */
export class ContractInitializationError extends ContractError {
  constructor(message: string, cause?: unknown) {
    super(`Failed to initialize contract: ${message}`, cause);
    this.name = 'ContractInitializationError';
  }
} 