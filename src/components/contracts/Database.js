export const DATABASE_CONTRACT_ADDRESS =
  '0x5ef04587FF75d4563E3088C465f4De1D8dCffCB0';
export const DATABASE_ABI_INTERFACE = [
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'bytes32Storage',
    outputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'addressStorage',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      }
    ],
    name: 'deleteBytes32',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      }
    ],
    name: 'deleteAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      }
    ],
    name: 'deleteBool',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      },
      {
        name: '_value',
        type: 'bytes'
      }
    ],
    name: 'setBytes',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'stringStorage',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'boolStorage',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      },
      {
        name: '_value',
        type: 'int256'
      }
    ],
    name: 'setInt',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'bytesStorage',
    outputs: [
      {
        name: '',
        type: 'bytes'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      },
      {
        name: '_value',
        type: 'bytes32'
      }
    ],
    name: 'setBytes32',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_functionSigner',
        type: 'address'
      },
      {
        name: '_oldContractManager',
        type: 'address'
      },
      {
        name: '_newContractManager',
        type: 'address'
      }
    ],
    name: 'changeContractManager',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      }
    ],
    name: 'deleteBytes',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      },
      {
        name: '_value',
        type: 'string'
      }
    ],
    name: 'setString',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'intStorage',
    outputs: [
      {
        name: '',
        type: 'int256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      }
    ],
    name: 'deleteInt',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'uintStorage',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      },
      {
        name: '_value',
        type: 'bool'
      }
    ],
    name: 'setBool',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      },
      {
        name: '_value',
        type: 'address'
      }
    ],
    name: 'setAddress',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_contractManager',
        type: 'address'
      }
    ],
    name: 'setContractManager',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      },
      {
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'setUint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      }
    ],
    name: 'deleteUint',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_key',
        type: 'bytes32'
      }
    ],
    name: 'deleteString',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        name: '_ownerOne',
        type: 'address'
      },
      {
        name: '_ownerTwo',
        type: 'address'
      },
      {
        name: '_ownerThree',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_ownerOne',
        type: 'address'
      },
      {
        indexed: true,
        name: '_ownerTwo',
        type: 'address'
      },
      {
        indexed: true,
        name: '_ownerThree',
        type: 'address'
      }
    ],
    name: 'LogInitialized',
    type: 'event'
  }
];
