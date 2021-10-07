export const VERSION = '2';

export const V1_VOLUME = 76000 * 10**8;

export const BASE_SYMBOL = 'ETH';

export const LIQUIDATION_THRESHOLD = 8000;

export const DEFAULT_CHAIN_ID = 42161; // Arbitrum

export const PRICE_DECIMALS = 8;

export const MIN_MARGIN = 0.001;

// ABIS
const TRADING_ABI = [
	"function getChainlinkPrice(uint256 productId) view returns(uint256)",
	"function getProduct(uint256 productId) view returns(tuple(address feed, uint56 maxLeverage, uint16 fee, uint16 interest, bool isActive, uint64 maxExposure, uint64 openInterestLong, uint64 openInterestShort, uint32 oracleMaxDeviation, uint32 minTradeDuration))",
	"function getPositions(uint256[] calldata positionIds) view returns(tuple(uint40 closeOrderId, uint24 productId, uint64 leverage, uint64 price, uint64 margin, address owner, uint88 timestamp, bool isLong)[] _positions)",

	"function submitNewPosition(uint256 productId, bool isLong, uint256 leverage) payable",
	"function addMargin(uint256 positionId) payable",
	"function submitCloseOrder(uint256 positionId, uint256 margin)",
	"function cancelPosition(uint256 positionId)",
	"function cancelOrder(uint256 orderId)",

	"event OpenOrder(uint256 indexed positionId, address indexed user, uint256 indexed productId)",
	"event NewPosition(uint256 indexed positionId, address indexed user, uint256 indexed productId, bool isLong, uint256 price, uint256 margin, uint256 leverage)",
	"event AddMargin(uint256 indexed positionId, address indexed user, uint256 margin, uint256 newMargin, uint256 newLeverage)",
	"event ClosePosition(uint256 positionId, address indexed user, uint256 indexed productId, bool indexed isFullClose, bool isLong, uint256 price, uint256 entryPrice, uint256 margin, uint256 leverage, uint256 pnl, bool pnlIsNegative, bool wasLiquidated)"
];

export const PRODUCT_TO_ID = {
	'ETH-USD': 1,
	'BTC-USD': 2,
	'LINK-USD': 3,
	'AAVE-USD': 4,
	'SUSHI-USD': 5,
	'UNI-USD': 6,
	'YFI-USD': 7
};

export const CHAIN_DATA = {
	31337: { // Hardhat local node
		id: 31337,
		label: 'Localhost',
		contract: {
			address: '0xdB05A386810c809aD5a77422eb189D36c7f24402',
			abi: TRADING_ABI
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD',
			3: 'LINK-USD',
			4: 'AAVE-USD',
			5: 'SUSHI-USD',
			6: 'UNI-USD',
			7: 'YFI-USD'
		},
		explorer: `http://localhost:8545`
	},
	42161: {
		id: 42161,
		label: 'Arbitrum',
		explorer: 'https://arbiscan.io',
		contract: {
			address: '0xA55Eee92a46A50A4C65908F28A0BE966D3e71633',
			abi: TRADING_ABI
		},
		products: {
			1: 'ETH-USD',
			2: 'BTC-USD'
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