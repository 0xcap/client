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
	"function getLatestPrice(address feed) pure returns(uint256)",
	"function getBase(uint8 baseId) view returns(address)",
	"function getProduct(uint16 productId) view returns(tuple(uint256 leverage, uint256 fee, uint256 interest, address feed, bool isActive) product)",
	"function getPosition(uint256 positionId) view returns(tuple(uint8 baseId, uint16 productId, address owner, uint64 timestamp, bool isLong, bool isSettling, uint256 margin, uint256 leverage, uint256 price, uint256 liquidationprice) position)",
	"function getCap(uint8 baseId) view returns(uint256)",
	"function getBalance(uint8 baseId) view returns(uint256)",
	"function getTotalStaked(uint8 baseId) view returns(uint256)",
	"function getUserStaked(address user, uint8 baseId) view returns(uint256)",
	"function getUserPositions(address user, uint8 baseId) view returns(tuple(uint8 baseId, uint16 productId, address owner, uint64 timestamp, bool isLong, bool isSettling, uint256 margin, uint256 leverage, uint256 price, uint256 liquidationprice)[] _positions)",

	"function stake(uint8 base, uint256 amount)",
	"function unstake(uint8 base, uint256 _stake)",

	"function submitOrder(uint8 baseId, uint16 productId, bool isLong, uint256 existingPositionid, uint256 margin, uint256 leverage, bool releaseMargin)",

	"event Staked(address indexed from, uint8 indexed baseId, uint256 amount)",
	"event Unstaked(address indexed to, uint8 indexed baseId, uint256 amount)",

	"event NewPosition(uint256 id, address indexed user, uint8 indexed baseId, uint16 indexed productId, bool isLong, uint256 priceWithFee, uint256 margin, uint256 leverage)",
	"event AddMargin(uint256 id, address indexed user, uint256 margin, uint256 newMargin, uint256 newLeverage, uint256 newLiquidationPrice)",
	"event ClosePosition(uint256 id, address indexed user, uint256 priceWithFee, uint256 margin, int256 pnl)",
	"event NewPositionSettled(uint256 id, address indexed user, uint256 price)",
	"event LiquidatedPosition(uint256 indexed positionId, address indexed by, uint256 vaultReward, uint256 liquidatorReward)"
];

const ERC20_ABI = [
	"function name() view returns (string)",
	"function symbol() view returns (string)",
	"function decimals() view returns (uint8)",
	"function allowance(address owner, address spender) view returns(uint256)",
	"function approve(address spender, uint256 amount) returns(bool)",
	"function mint(address to, uint256 amount)"
];

export const CONTRACTS = {
	31337: { // Hardhat local node
		TRADING: {
			address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
			abi: TRADING_ABI
		}
	}
};

export const BASES = {
	31337: { // Hardhat local node
		1: {
			symbol: 'USDC',
			address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
			decimals: 6,
			abi: ERC20_ABI
		}
	}
};

export const PRODUCTS = {
	31337: { // Hardhat local node
		1: {
			symbol: 'BTC-USD',
			feed: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c'
		},
		2: {
			symbol: 'ETH-USD',
			feed: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'
		}
	}
};