import 'mocha';
import { expect } from 'chai';
import {mobius as Mobius, expandToDecimals} from "../src";
import dotenv from 'dotenv';


dotenv.config();
describe('test init', function () {
    it('init and mint', async function () {
        await Mobius.init('JsonRpc', {url: process.env.RPC, privateKey: process.env.PRIVATEKEY}, { gasPrice: 3, chainId: 80001 });

        //await Mobius.mint("DAI",expandToDecimals(100,14),expandToDecimals(5,18));
        let d = await Mobius.getStake("DAI","moUSD","0x4C7C018c358393363cea928887E08Abda6F46C8f");
        console.log(d.toString());
    })
})
