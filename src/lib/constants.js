export const DEFAULT_CHAIN_ID = 31337;
export const PRICE_DECIMALS = 8;
const INFURA_KEY = '8cccc478d2e54cb3bc3ec5524793f636';

// Supported networks
export const NETWORK_URLS = {
	1: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
	4: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
	10: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
	42161: `https://arb1.arbitrum.io/rpc`,
	31337: `http://localhost:8545` // hardhat local node
};

export const PRODUCTS = {
	'BTC-USD': '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c', // chainlink feed
	'ETH-USD': '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'
};

// ABIS
const TRADING_ABI = [
	"function balances(address, address) view returns(uint256)",
	"function locked(address, address) view returns(uint256)",
	"function getLatestPrice(address feed) view returns(uint256)",
	"function deposit(address base, uint256 amount)",
	"function withdraw(address base, uint256 amount)",
	"function submitOrder(address base, bytes32 _product, bool isLong, uint256 amount)",
	"function getUserPositions(address user, address base) view returns(tuple(bytes32 product, address base, uint256 amount, uint256 price, uint256 createdAt, uint256 updatedAt, uint256 realizedInterest, bool isLong, bool isSettling)[] _positions)",
	"function getUPL(address user, address base) view returns(int256)",

	"event Deposit(address indexed from, address indexed base, uint256 amount)",
	"event Withdrawal(address indexed to, address indexed base, uint256 amount)",

	"event NewPosition(uint256 id, address indexed user, address indexed base, bytes32 indexed product, bool isLong, uint256 priceWithFee, uint256 amount)",
	"event AddMargin(uint256 id, address indexed user, uint256 priceWithFee, uint256 amount)",
	"event ClosePosition(uint256 id, address indexed user, uint256 priceWithFee, uint256 amount, int256 pnl)",

	"event NewPositionSettled(uint256 id, address indexed user, uint256 price)",
	"event AddMarginSettled(uint256 id, address indexed user, uint256 price, uint256 amount)",

	"event UserLiquidated(address indexed user, address indexed by)"
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
			address: '0x89ec9355b1Bcc964e576211c8B011BD709083f8d',
			abi: TRADING_ABI
		},
		USDC: {
			address: '0x4653251486a57f90Ee89F9f34E098b9218659b83',
			decimals: 6,
			abi: ERC20_ABI
		}
	}
};