export const DEFAULT_CHAIN_ID = 31337;
export const PRICE_DECIMALS = 8;
export const LEVERAGE_DECIMALS = 6;
const INFURA_KEY = '8cccc478d2e54cb3bc3ec5524793f636';

// Supported networks
export const NETWORK_URLS = {
	1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
	4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
	10: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
	42161: `https://arb1.arbitrum.io/rpc`,
	31337: `http://localhost:8545` // hardhat local node
};

// ABIS
const TRADING_ABI = [
	"function getLatestPrice(uint16 productId) view returns(uint256)",
	"function getBase(uint8 baseId) view returns(address)",
	"function getProduct(uint16 productId) view returns(tuple(uint256 leverage, uint256 fee, uint256 interest, address feed, bool isActive) product)",
	"function getPosition(uint256 positionId) view returns(tuple(uint8 baseId, uint16 productId, address owner, uint64 timestamp, bool isLong, bool isSettling, uint256 margin, uint256 leverage, uint256 price, uint256 liquidationPrice, uint256 id) position)",
	"function getCap(uint8 baseId) view returns(uint256)",
	"function getBalance(uint8 baseId) view returns(uint256)",
	"function getTotalStaked(uint8 baseId) view returns(uint256)",
	"function getUserStaked(address user, uint8 baseId) view returns(uint256)",
	"function getUserPositions(address user, uint8 baseId) view returns(tuple(uint8 baseId, uint16 productId, address owner, uint64 timestamp, bool isLong, bool isSettling, uint256 margin, uint256 leverage, uint256 price, uint256 liquidationPrice, uint256 id)[] _positions)",

	"function stake(uint8 baseId, uint256 amount)",
	"function unstake(uint8 baseId, uint256 _stake)",

	"function submitOrder(uint8 baseId, uint16 productId, bool isLong, uint256 existingPositionid, uint256 margin, uint256 leverage, bool releaseMargin)",

	"event Staked(address indexed from, uint8 indexed baseId, uint256 amount)",
	"event Unstaked(address indexed to, uint8 indexed baseId, uint256 amount)",

	"event NewPosition(uint256 id, address indexed user, uint8 indexed baseId, uint16 indexed productId, bool isLong, uint256 priceWithFee, uint256 margin, uint256 leverage)",
	"event AddMargin(uint256 id, address indexed user, uint256 margin, uint256 newMargin, uint256 newLeverage, uint256 newLiquidationPrice)",
	"event ClosePosition(uint256 id, address indexed user, uint8 indexed baseId, uint16 indexed productId, uint256 priceWithFee, uint256 margin, uint256 leverage, int256 pnl, bool wasLiquidated)",
	"event NewPositionSettled(uint256 id, address indexed user, uint256 price)",
	"event PositionLiquidated(uint256 id, address indexed by, uint256 vaultReward, uint256 liquidatorReward)"
];

export const ERC20_ABI = [
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function decimals() view returns (uint8)",
	"function balanceOf(address account) view returns(uint256)",
	"function allowance(address owner, address spender) view returns(uint256)",
	"function approve(address spender, uint256 amount) returns(bool)",
	"function mint(address to, uint256 amount)",

	"event Approval(address indexed owner, address indexed spender, uint256 value)"
];

export const CONTRACTS = {
	31337: { // Hardhat local node
		TRADING: {
			address: '0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3',
			abi: TRADING_ABI
		}
	}
};

export const BASES = {
	31337: { // Hardhat local node
		1: {
			symbol: 'USDC',
			address: '0x82e01223d51Eb87e16A03E24687EDF0F294da6f1',
			decimals: 6
		}
	}
};

export const PRODUCTS = {
	1: 'BTC-USD',
	2: 'ETH-USD'
};