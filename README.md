# OEA Token API Documentation

This API provides endpoints for managing and verifying NFT-based project tokens.

## Base URL

All endpoints are prefixed with `/api`

## Endpoints

### Health Check
- **GET** `/health`
  - Checks the health of the service and blockchain provider connection
  - Response Body:
    ```json
    {
      "status": "string",  // Current status of the service
      "network": {
        "name": "string",  // Name of the connected blockchain network
        "chainId": "number"  // Chain ID of the connected network
      }
    }
    ```
  - Status Codes:
    - 200: Service is healthy
    - 500: Service is unhealthy

### Project Management
- **POST** `/project`
  - Creates a new project token
  - Request Body:
    ```json
    {
      "name": "string",    // Name of the project
      "address": "string"  // wallet address to mint NFT
    }
    ```
  - Response Body:
    ```json
    {
      "tokenId": "string",  // The ID of the created NFT token
      "address": "string"  // The address of the NFT contract
    }
    ```
  - Status Codes:
    - 201: Successfully created
    - 400: Validation error
    - 500: Server error

- **GET** `/project/:address/:tokenId`
  - Verifies if a given address owns a specific token
  - Parameters:
    - `address`: Ethereum wallet address
    - `tokenId`: Token ID to verify
  - Response Body: HTML page with the following structure
    ```html
    <div class="container">
      <h1>Verification Status</h1>
      <p>Address: <span>${address}</span></p>
      <p>Token ID: <span class="token-id">${tokenId}</span></p>
      <p class="status">Verification message</p>
    </div>
    ```
  - Status Codes:
    - 200: Verification successful
    - 403: Verification failed

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "message": "string",      // Human-readable error message
  "code": "number",         // HTTP status code
  "errors": [               // Array of validation errors (if any)
    {
      "property": "string", // Name of the invalid property
      "constraints": {      // Validation constraints that failed
        "constraintName": "error message"
      }
    }
  ]
}
```

Common error codes:
- 400: Bad Request - Invalid input data
- 401: Unauthorized - Authentication required
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 409: Conflict - Resource already exists
- 500: Internal Server Error - Server-side error
