# mobius-js
a javascript lib that is used to interact with mobius protocol

## Setup
`npm install mobius-js`

## Init

```ts
import {mobius as Mobius} from "../src";
(async () => {
    // 1. Dev
    await mobius.init('JsonRpc', {url: 'http://localhost:8545/', privateKey: ''}, { gasPrice: 0, maxFeePerGas: 0, maxPriorityFeePerGas: 0, chainId: 1 });
    // OR
    await mobius.init('JsonRpc', {}, { chainId: 1 }); // In this case fee data will be specified automatically

    // 2. Infura
    mobius.init("Infura", { network: "homestead", apiKey: <INFURA_KEY> }, { chainId: 1 });
    
    // 3. Web3 provider
    mobius.init('Web3', { externalProvider: <WEB3_PROVIDER> }, { chainId: 1 });
})()
```

**Note 1.** ```chainId``` parameter is optional, but you must specify it in the case you use Metamask on localhost network, because Metamask has that [bug](https://hardhat.org/metamask-issue.html)

**Note 2.** Web3 init requires the address. Therefore, it can be initialized only after receiving the address.
