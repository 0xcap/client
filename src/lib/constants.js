export const VERSION = '1';

export const BASE_SYMBOL = 'ETH';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const DEFAULT_CHAIN_ID = 4; // rinkeby

export const PRICE_DECIMALS = 8;
export const LEVERAGE_DECIMALS = 18;

// ABIS
const TRADING_ABI = [

	"function getLatestPrice(address feed, uint256 productId) view returns(uint256)",
	"function getVault() view returns(tuple(uint96 cap, uint96 balance, uint64 staked, uint80 lastCheckpointBalance, uint80 lastCheckpointTime, uint32 stakingPeriod, uint32 redemptionPeriod, uint32 maxDailyDrawdown))",
	"function getProduct(uint256 productId) view returns(tuple(address feed, uint72 maxLeverage, uint16 fee, bool isActive, uint64 maxExposure, uint48 openInterestLong, uint48 openInterestShort, uint16 interest, uint32 settlementTime, uint16 minTradeDuration, uint16 liquidationThreshold, uint16 liquidationBounty))",
	"function getPositions(uint256[] calldata positionIds) view returns(tuple(uint64 productId, uint64 leverage, uint64 price, uint64 margin, address owner, uint80 timestamp, bool isLong, bool isSettling)[] _positions)",
	"function getStakes(uint256[] calldata stakeIds) view returns(tuple(address owner, uint64 amount, uint32 timestamp)[] _stakes)",

	"function stake() payable",
	"function redeem(uint256 stakeId, uint256 amount)",
	"function openPosition(uint256 productId, bool isLong, uint256 leverage) payable",
	"function addMargin(uint256 positionId) payable",
	"function closePosition(uint256 positionId, uint256 margin, bool releaseMargin)",

	"event Staked(uint256 stakeId, address indexed user, uint256 amount)",
	"event Redeemed(uint256 stakeId, address indexed user, uint256 amount, bool isFullRedeem)",
	"event NewPosition(uint256 indexed positionId, address indexed user, uint256 indexed productId, bool isLong, uint256 price, uint256 margin, uint256 leverage)",
	"event AddMargin(uint256 indexed positionId, address indexed user, uint256 margin, uint256 newMargin, uint256 newLeverage)",
	"event ClosePosition(uint256 positionId, address indexed user, uint256 indexed productId, bool indexed isFullClose, uint256 price, uint256 entryPrice, uint256 margin, uint256 leverage, uint256 pnl, bool pnlIsNegative, bool wasLiquidated)",
	"event NewPositionSettled(uint256 indexed positionId, address indexed user, uint256 price)"
];

export const PRODUCT_TO_ID = {
	'ETH-USD': 1,
	'BTC-USD': 2,
	'LINK-USD': 3,
	'XRP-USD': 4,
	'Gold': 5,
	'Silver': 6,
	'Oil': 7,
	'EUR-USD': 8,
	'GBP-USD': 9,
	'JPY-USD': 10,
	'CHF-USD': 11,
	'AUD-USD': 12,
	'KRW-USD': 13,
	'PHP-USD': 14,
};

export const CHAIN_DATA = {
	31337: { // Hardhat local node
		id: 31337,
		label: 'Localhost',
		contract: {
			address: '0x7bc06c482DEAd17c0e297aFbC32f6e63d3846650',
			abi: TRADING_ABI
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			3: 'Gold',
			4: 'EUR-USD'
		},
		explorer: `http://localhost:8545`
	},
	4: {
		id: 4,
		label: 'Rinkeby',
		explorer: 'https://rinkeby.etherscan.io',
		contract: {
			address: '0x47c2C1BFb067d8DD3983761f5A902C42E3dC7d3e',
			abi: TRADING_ABI
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			3: 'LINK-USD',
			4: 'XRP-USD',
			5: 'Gold',
			6: 'Silver',
			7: 'Oil',
			8: 'EUR-USD',
			9: 'GBP-USD',
			10: 'JPY-USD',
			11: 'CHF-USD',
			12: 'AUD-USD',
		},
		testnet: true
	},
	42161: {
		id: 42161,
		label: 'Arbitrum',
		explorer: 'https://arbiscan.io',
		contract: {
			address: '0x9BC357bc5b312AaCD41a84F3C687F031B8786853',
			abi: TRADING_ABI
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			3: 'LINK-USD',
			8: 'EUR-USD',
			12: 'AUD-USD',
			13: 'KRW-USD',
			14: 'PHP-USD'
		}
	},
	'xx1': { // Ethereum mainnet
		id: 1,
		label: 'Mainnet',
		explorer: 'https://etherscan.io'
	},
	'xx10': {
		id: 10,
		label: 'Optimism'
	}
}