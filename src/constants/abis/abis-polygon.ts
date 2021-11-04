import AssetPriceABI from './jsons/AssetPrice.json';
import DynamicTradingFeeABI from './jsons/DynamicTradingFee.json';
import IERC20ABI from './jsons/IERC20.json';
import IssuerABI from './jsons/Issuer.json';
import LiquidatorABI from './jsons/Liquidator.json';
import MobiusABI from './jsons/Mobius.json';
import MobiusTokenABI from './jsons/MobiusToken.json';
import ResolverABI from './jsons/Resolver.json';
import RewardCollateralABI from './jsons/RewardCollateral.json';
import RewardStakingABI from './jsons/RewardStaking.json';
import RewardTradingABI from './jsons/RewardTrading.json';
import SettingABI from './jsons/Setting.json';
import StakerABI from './jsons/Staker.json';
import SynthABI from './jsons/Synth.json';
import TraderABI from './jsons/Trader.json';

export const contracts = {
    Resolver : {
        abi : ResolverABI,
        addr : '0x1ac96D42893e02940b88570EAae9a8DBD3a5BD67'
    },
    Mobius : {
        abi : MobiusABI
    },
    Staker : {
        abi : StakerABI
    },
    Issuer : {
        abi : IssuerABI
    },
    Liquidator : {
        abi : LiquidatorABI
    },
    Setting : {
        abi : SettingABI
    },
    IERC20 : {
        abi : IERC20ABI
    }
}

export const CONSTANTS = {
    MOT : 'MOT',
    USD : 'moUSD',
    NATIVE : 'MATIC',

    CONTRACT_RESOLVER : 'Resolver',
    CONTRACT_ASSET_PRICE : 'AssetPrice',
    CONTRACT_SETTING : 'Setting',

    CONTRACT_MOBIUS : 'Mobius',
    CONTRACT_ESCROW : 'Escrow',
    CONTRACT_ISSUER : 'Issuer',

    CONTRACT_STAKER : 'Staker',
    CONTRACT_TRADER : 'Trader',
    CONTRACT_TEAM : 'Team',

    CONTRACT_MOBIUS_TOKEN : 'MobiusToken',

    CONTRACT_LIQUIDATOR : 'Liquidator',

    CONTRACT_REWARD_COLLATERAL : 'RewardCollateral',
    CONTRACT_REWARD_STAKING : 'RewardStaking',
    CONTRACT_REWARD_TRADING : 'RewardTradings',

    TRADING_FEE_ADDRESS : 'TradingFeeAddress',
    LIQUIDATION_FEE_ADDRESS : 'LiquidationFeeAddress',

    CONTRACT_DYNCMIC_TRADING_FEE : 'DynamicTradingFee'
}