import type { Abi } from "viem";

export const SYBEX_ORACLE_ABI = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [],
		name: "AccessControlBadConfirmation",
		type: "error",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
			{
				internalType: "bytes32",
				name: "neededRole",
				type: "bytes32",
			},
		],
		name: "AccessControlUnauthorizedAccount",
		type: "error",
	},
	{
		inputs: [],
		name: "InvalidInitialization",
		type: "error",
	},
	{
		inputs: [],
		name: "NotInitializing",
		type: "error",
	},
	{
		inputs: [],
		name: "ReentrancyGuardReentrantCall",
		type: "error",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "address",
				name: "resolver",
				type: "address",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "answerData",
				type: "bytes",
			},
		],
		name: "AnswerProvided",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "newFeeRecipient",
				type: "address",
			},
		],
		name: "FeeRecipientUpdated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "newFee",
				type: "uint256",
			},
		],
		name: "FeeUpdated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint64",
				name: "version",
				type: "uint64",
			},
		],
		name: "Initialized",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "enum SybexOracle.QuestionType",
				name: "questionType",
				type: "uint8",
			},
			{
				indexed: false,
				internalType: "string",
				name: "questionText",
				type: "string",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "timeout",
				type: "uint256",
			},
			{
				indexed: true,
				internalType: "address",
				name: "asker",
				type: "address",
			},
		],
		name: "QuestionAsked",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "resolver",
				type: "address",
			},
		],
		name: "ResolverAdded",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "resolver",
				type: "address",
			},
		],
		name: "ResolverRemoved",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "previousAdminRole",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "bytes32",
				name: "newAdminRole",
				type: "bytes32",
			},
		],
		name: "RoleAdminChanged",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address",
			},
		],
		name: "RoleGranted",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "bytes32",
				name: "role",
				type: "bytes32",
			},
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address",
			},
		],
		name: "RoleRevoked",
		type: "event",
	},
	{
		inputs: [],
		name: "ADMIN_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "DEFAULT_ADMIN_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "FEE_DENOMINATOR",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "REFUND_PERIOD",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "RESOLVER_ROLE",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "resolver",
				type: "address",
			},
		],
		name: "addResolver",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "answers",
		outputs: [
			{
				internalType: "bytes",
				name: "answerData",
				type: "bytes",
			},
			{
				internalType: "address",
				name: "resolver",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "answeredAt",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "enum SybexOracle.QuestionType",
				name: "_questionType",
				type: "uint8",
			},
			{
				internalType: "string",
				name: "_questionText",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "_timeout",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_additionalData",
				type: "bytes",
			},
		],
		name: "ask",
		outputs: [
			{
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_questionText",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "_timeout",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_additionalData",
				type: "bytes",
			},
		],
		name: "askBoolean",
		outputs: [
			{
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_questionText",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "_timeout",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_additionalData",
				type: "bytes",
			},
		],
		name: "askCategorical",
		outputs: [
			{
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_questionText",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "_timeout",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_additionalData",
				type: "bytes",
			},
		],
		name: "askNumeric",
		outputs: [
			{
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_questionText",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "_timeout",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "_additionalData",
				type: "bytes",
			},
		],
		name: "askRangeNumeric",
		outputs: [
			{
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
		],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "fee",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "feeRecipient",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
		],
		name: "getAnswer",
		outputs: [
			{
				internalType: "bytes",
				name: "answerData",
				type: "bytes",
			},
			{
				internalType: "address",
				name: "resolver",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32",
			},
		],
		name: "getRoleAdmin",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "grantRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "hasRole",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_initialFee",
				type: "uint256",
			},
			{
				internalType: "address",
				name: "_feeRecipient",
				type: "address",
			},
			{
				internalType: "address",
				name: "_admin",
				type: "address",
			},
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "resolver",
				type: "address",
			},
		],
		name: "isResolver",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "maxQuestionLength",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "maxTimeout",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "minQuestionLength",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "minTimeout",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "questionId",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "answerData",
				type: "bytes",
			},
		],
		name: "provideAnswer",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "questionCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "questions",
		outputs: [
			{
				internalType: "enum SybexOracle.QuestionType",
				name: "questionType",
				type: "uint8",
			},
			{
				internalType: "string",
				name: "questionText",
				type: "string",
			},
			{
				internalType: "uint256",
				name: "timeout",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "additionalData",
				type: "bytes",
			},
			{
				internalType: "address",
				name: "asker",
				type: "address",
			},
			{
				internalType: "bool",
				name: "isResolved",
				type: "bool",
			},
			{
				internalType: "uint256",
				name: "createdAt",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "resolver",
				type: "address",
			},
		],
		name: "removeResolver",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "callerConfirmation",
				type: "address",
			},
		],
		name: "renounceRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "resolvers",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "role",
				type: "bytes32",
			},
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "revokeRole",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "newFee",
				type: "uint256",
			},
		],
		name: "setFee",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newFeeRecipient",
				type: "address",
			},
		],
		name: "setFeeRecipient",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4",
			},
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
] as const satisfies Abi;
