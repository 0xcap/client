export const VERSION = '1';

export const DEFAULT_CHAIN_ID = 4; // rinkeby

export const PRICE_DECIMALS = 8;
export const LEVERAGE_DECIMALS = 6;
const INFURA_KEY = '8cccc478d2e54cb3bc3ec5524793f636';

// ABIS
const TRADING_ABI = [

	"function getLatestPrice(uint16 productId) view returns(uint256)",
	"function getVault(uint8 vaultId) view returns(tuple(address base, uint256 cap, uint256 maxOpenInterest, uint256 maxDailyDrawdown, uint256 stakingPeriod, uint256 redemptionPeriod, uint256 protocolFee, uint256 openInterest, uint256 balance, uint256 totalStaked, bool isActive))",
	"function getProduct(uint16 productId) view returns(tuple(uint256 leverage, uint256 fee, uint256 interest, address feed, uint256 settlementTime, uint256 minTradeDuration, uint256 liquidationThreshold, uint256 liquidationBounty, bool isActive) product)",
	"function getPosition(uint256 positionId) view returns(tuple(uint8 vaultId, uint16 productId, address owner, uint64 timestamp, bool isLong, bool isSettling, uint256 margin, uint256 leverage, uint256 price, uint256 liquidationPrice, uint256 positionId) position)",
	"function getUserPositions(address user, uint8 vaultId) view returns(tuple(uint8 vaultId, uint16 productId, address owner, uint64 timestamp, bool isLong, bool isSettling, uint256 margin, uint256 leverage, uint256 price, uint256 positionId)[] _positions)",
	"function getUserStaked(address user, uint8 vaultId) view returns(uint256)",

	"function stake(uint8 vaultId, uint256 amount)",
	"function redeem(uint8 vaultId, uint256 amount)",
	"function submitOrder(uint8 vaultId, uint16 productId, bool isLong, uint256 margin, uint256 leverage, uint256 positionId, bool releaseMargin)",

	"event Staked(address indexed from, uint8 indexed vaultId, uint256 amount)",
	"event Redeemed(address indexed to, uint8 indexed vaultId, uint256 amount)",
	"event NewPosition(uint256 positionId, address indexed user, uint8 indexed vaultId, uint16 indexed productId, bool isLong, uint256 price, uint256 margin, uint256 leverage)",
	"event AddMargin(uint256 positionId, address indexed user, uint256 margin, uint256 newMargin, uint256 newLeverage)",
	"event ClosePosition(uint256 positionId, address indexed user, uint8 indexed vaultId, uint16 indexed productId, uint256 price, uint256 margin, uint256 leverage, int256 pnl, uint256 feeRebate, uint256 protocolFee, bool wasLiquidated)",
	"event NewPositionSettled(uint256 positionId, address indexed user, uint256 price)",
	"event PositionLiquidated(uint256 positionId, address indexed by, uint256 vaultReward, uint256 liquidatorReward)"
];

export const ERC20_ABI = [
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function decimals() view returns (uint8)",
	"function balanceOf(address account) view returns(uint256)",
	"function allowance(address owner, address spender) view returns(uint256)",
	"function approve(address spender, uint256 amount) returns(bool)",
	"function mint(address to, uint256 amount)",

	"event Approval(address indexed owner, address indexed spender, uint256 value)",
	"event Transfer(address indexed from, address indexed to, uint256 value)"
];

export const PRODUCT_TO_ID = {
	'ETH-USD': 1,
	'BTC-USD': 2,
	'Gold': 3,
	'EUR-USD': 4
} 

export const CHAIN_DATA = {
	31337: { // Hardhat local node
		id: 31337,
		label: 'Localhost',
		contracts: {
			TRADING: {
				address: '0x7969c5eD335650692Bc04293B07F5BF2e7A673C0',
				abi: TRADING_ABI
			}
		},
		bases: {
			1: {
				symbol: 'USDC',
				address: '0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3',
				decimals: 6,
				precision: 2
			}
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			3: 'Gold',
			4: 'EUR-USD'
		},
		network: `http://localhost:8545`,
		explorer: `http://localhost:8545`
	},
	4: {
		id: 4,
		label: 'Rinkeby',
		network: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
		explorer: 'https://rinkeby.etherscan.io',
		contracts: {
			TRADING: {
				address: '0xEde8C3f9fb1d7F0C63Eb284547c35a45c8D7632c',
				abi: TRADING_ABI
			}
		},
		bases: {
			1: {
				symbol: 'USDC',
				address: '0x0A1A33aEb6d69966973a568653b6465642E4aD59',
				decimals: 6,
				precision: 2
			}
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			3: 'Gold',
			4: 'EUR-USD'
		},
		testnet: true
	},
	421611: { // Arbitrum rinkeby
		id: 4,
		label: 'Arbitrum Rinkeby',
		network: `https://rinkeby.arbitrum.io/rpc`,
		explorer: 'https://rinkeby-explorer.arbitrum.io/#',
		contracts: {
			TRADING: {
				address: '0xEde8C3f9fb1d7F0C63Eb284547c35a45c8D7632c',
				abi: TRADING_ABI
			}
		},
		bases: {
			1: {
				symbol: 'USDC',
				address: '0x0A1A33aEb6d69966973a568653b6465642E4aD59',
				decimals: 6,
				precision: 2
			}
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD'
		},
		testnet: true
	},
	42161: {
		id: 42161,
		label: 'Arbitrum',
		network: `https://arb1.arbitrum.io/rpc`,
		explorer: 'https://arbiscan.io',
		contracts: {
			TRADING: {
				address: '0x5F2fFc7883BD12604e0adf0403f9436D40386Ef4',
				abi: TRADING_ABI
			}
		},
		bases: {
			1: {
				symbol: 'USDC',
				address: '0xBbfacB66a6F3a73930a8b5483B37b05Be25Bf7fd',
				decimals: 6,
				precision: 2
			}
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			4: 'EUR-USD'
		},
		testnet: true
	},
	'xx1': { // Ethereum mainnet
		id: 1,
		label: 'Mainnet',
		network: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
		explorer: 'https://etherscan.io'
	},
	'xx10': {
		id: 10,
		label: 'Optimism',
		network: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
	}
}