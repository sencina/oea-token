export const deployerAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'ContractDeployed',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'uri',
        type: 'string',
      },
    ],
    name: 'deploy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
