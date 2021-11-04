import { ethers, Contract, BigNumber} from "ethers";
import { Networkish } from "@ethersproject/networks";
import {contracts,CONSTANTS} from "./constants/abis/abis-polygon";
import {expandToDecimals,bigNumberify,formatBytes32String} from "./utilities";

class Mobius {
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider | null;
    signer: ethers.Signer | null;
    signerAddress: string;
    contracts: { [index: string]: Contract | null };
    tokens : { [index: string]: { contract: Contract, decimal: number} | null };
    options: { gasLimit: number, gasPrice?: number | ethers.BigNumber };

    constructor() {
        this.provider = null;
        this.signer = null;
        this.signerAddress = '';
        this.contracts = {};
        this.tokens = {};
        this.options = { gasLimit: 12000000 };
    }
    
    async init(
        providerType: 'JsonRpc' | 'Web3' | 'Infura',
        providerSettings: { url?: string, privateKey?: string } | { externalProvider: ethers.providers.ExternalProvider } | { network?: Networkish, apiKey?: string },
        options: { gasPrice?: number, chainId?: number } = {} // gasPrice in Gwei
    ): Promise<void> {
        // JsonRpc provider
        if (providerType.toLowerCase() === 'JsonRpc'.toLowerCase()) {
            providerSettings = providerSettings as { url: string, privateKey: string };

            if (providerSettings.url) {
                this.provider = this.provider = new ethers.providers.JsonRpcProvider(providerSettings.url);
            } else {
                this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545/');
            }

            if (providerSettings.privateKey) {
                this.signer = new ethers.Wallet(providerSettings.privateKey, this.provider);
            } else {
                this.signer = this.provider.getSigner();
            }
        // Web3 provider
        } else if (providerType.toLowerCase() === 'Web3'.toLowerCase()) {
            providerSettings = providerSettings as { externalProvider: ethers.providers.ExternalProvider };
            this.provider = new ethers.providers.Web3Provider(providerSettings.externalProvider);
            this.signer = this.provider.getSigner();
        // Infura provider
        } else if (providerType.toLowerCase() === 'Infura'.toLowerCase()) {
            providerSettings = providerSettings as { network?: Networkish, apiKey?: string };
            this.provider = new ethers.providers.InfuraProvider(providerSettings.network, providerSettings.apiKey);
        } else {
            throw Error('Wrong providerType');
        }

        if (this.signer) {
            this.signerAddress = await this.signer.getAddress();
        }
        this.options.gasPrice = options.gasPrice !== undefined ? (options.gasPrice * 1e9) : await this.provider.getGasPrice();

        this.contracts["Resolver"] = new Contract(contracts.Resolver.addr, contracts.Resolver.abi, this.signer || this.provider);
        this.contracts[CONSTANTS.CONTRACT_MOBIUS] = null;
    }

    public async mint (stake: string, amount: BigNumber, collateralRate: BigNumber) : Promise<string> {
        const contract = await this.initContract(CONSTANTS.CONTRACT_MOBIUS,contracts.Mobius.abi);
        
        if (stake == "MATIC") {
            return (await contract.mintFromCoin(collateralRate, { ...this.options ,value : amount})).hash;
        } else {
            const Token = await this.initToken(stake,"Stake");
            await Token.contract.approve(contract.address,amount, { ...this.options}); 
            return (await contract.mintFromToken(formatBytes32String(stake),amount,collateralRate, { ...this.options})).hash;
        }
    }

    public async short(stake: string, debtType: string, amount: BigNumber, collateralRate: BigNumber) : Promise<string> {
        const contract = await this.initContract(CONSTANTS.CONTRACT_MOBIUS,contracts.Mobius.abi);

        if (stake == "MATIC") {
            return (await contract.shortFromCoin(formatBytes32String(debtType), collateralRate, { ...this.options ,value : amount})).hash;
        } else {
            const Token = await this.initToken(stake,"Stake");
            await Token.contract.approve(contract.address,amount, { ...this.options}); 
            return (await contract.shortFromCoin(formatBytes32String(stake),amount,formatBytes32String(debtType),collateralRate, { ...this.options})).hash;
        }
    }

    public async stake(stake: string, debtType: string, amount: BigNumber) : Promise<string> {
        const contract = await this.initContract(CONSTANTS.CONTRACT_MOBIUS,contracts.Mobius.abi);
        if (stake == "MATIC") {
            return (await contract.stakeFromCoin(formatBytes32String(debtType), { ...this.options ,value : amount})).hash;
        } else {
            const Token = await this.initToken(stake,"Stake");
            await Token.contract.approve(contract.address,amount, { ...this.options}); 
            return (await contract.stakeFromToken(formatBytes32String(stake),formatBytes32String(debtType),amount, { ...this.options})).hash;
        }
    }

    public async claim(stake: string, debtType: string, amount: BigNumber) : Promise<string> {
        const contract = await this.initContract(CONSTANTS.CONTRACT_MOBIUS,contracts.Mobius.abi);
        return (await contract.claim(formatBytes32String(stake),formatBytes32String(debtType),amount, { ...this.options})).hash;
    }

    public async trade(fromSynth: string, fromAmount: BigNumber,toSynth: string) : Promise<string> {
        const contract = await this.initContract(CONSTANTS.CONTRACT_MOBIUS,contracts.Mobius.abi);
        return (await contract.trade(formatBytes32String(fromSynth),fromAmount,formatBytes32String(toSynth), { ...this.options})).hash;
    }

    public async burn(stake: string, debtType: string, amount: BigNumber, withdraw: boolean) : Promise<string> {
        const contract = await this.initContract(CONSTANTS.CONTRACT_MOBIUS,contracts.Mobius.abi);
        return (await contract.burn(formatBytes32String(stake),formatBytes32String(debtType),amount,withdraw, { ...this.options})).hash;
    }

    public async liquidate(stake: string, debtType: string, account: string, amount: string) : Promise<string> {
        const contract = await this.initContract(CONSTANTS.CONTRACT_MOBIUS,contracts.Mobius.abi);
        return (await contract.liquidate(formatBytes32String(stake),account,formatBytes32String(debtType),amount, { ...this.options})).hash;
    }

    public async getClaimable(stake: string, debtType: string, addr: string) : Promise<number> {
        const setting = await this.initContract(CONSTANTS.CONTRACT_SETTING,contracts.Setting.abi);
        const staker = await this.initContract(CONSTANTS.CONTRACT_STAKER,contracts.Staker.abi);
        
        let safeCollateralRate = await setting.getCollateralRate(formatBytes32String(stake), formatBytes32String(debtType));
        return (await staker.getClaimable(formatBytes32String(stake), addr, formatBytes32String(debtType), safeCollateralRate, { ...this.options}));
    }

    public async getLiquidatable(stake: string, debtType: string, account: string) : Promise<number> {
        const liquidator = await this.initContract(CONSTANTS.CONTRACT_LIQUIDATOR,contracts.Liquidator.abi);
        return (await liquidator.getLiquidable(formatBytes32String(stake), account, formatBytes32String(debtType)));
    }

    public async getStake(stake: string, debtType: string, addr: string) : Promise<number> {
        const staker = await this.initContract(CONSTANTS.CONTRACT_STAKER,contracts.Staker.abi);
        return (await staker.getStaked(formatBytes32String(stake),addr,formatBytes32String(debtType)));
    }

    public async getDebt (stake: string, debtType: string, addr: string) : Promise<number> {
        const issuer = await this.initContract(CONSTANTS.CONTRACT_ISSUER,contracts.Issuer.abi);
        return (await issuer.getDebt(formatBytes32String(stake),addr,formatBytes32String(debtType)));
    }

    private async initContract(contractName: string,abi: ethers.ContractInterface) : Promise<ethers.Contract> {
        if (this.contracts[contractName] == null) {
            let resolver = this.contracts["Resolver"] as Contract;
            let contractAddr = await resolver.getAddress(formatBytes32String(contractName));
            this.contracts[contractName] = new Contract(contractAddr, abi, this.signer || this.provider || undefined );    
        }

        return this.contracts[contractName]!;
    }

    private async initToken(tokenName: string,tokenType: string) : Promise<{ contract: Contract, decimal: number}> {
        if (this.tokens[tokenName] == null) {
            let resolver = this.contracts["Resolver"] as Contract;
            let r = await resolver.getAsset(formatBytes32String(tokenType),formatBytes32String(tokenName));
            if (!r || !r[0]) {
                throw Error("token not found : " + tokenName);
            }

            const contract = new Contract(r[1], contracts.IERC20.abi, this.signer || this.provider || undefined );
            const decimal = await contract.decimals();
            this.tokens[tokenName] = {contract: contract, decimal: decimal};
        }
        return this.tokens[tokenName]!;
    }
}

export const mobius = new Mobius();