import { Router } from 'express';
import { Query } from 'express-serve-static-core';
import { OpenSeaAPI, OpenSeaPort, Network } from 'opensea-js';
import { OpenSeaAsset } from 'opensea-js/lib/types';
import * as Web3 from 'web3'
import {Asset} from '../types/Asset'
const router = Router();
const provider = new Web3.default.providers.HttpProvider('https://mainnet.infura.io')
const seaport = new OpenSeaPort(provider, {
    networkName: Network.Main
})



router.route('/erc721').get(async (req, res) => {
    const { tokenAddress, tokenId } = req.body;
    const asset: OpenSeaAsset = await seaport.api.getAsset({
        tokenAddress, // string
        tokenId, // string | number | null
    })
    res.send(asset);

  })
router.route('/buyOrder').post(async (req, body) => {
    const { tokenId, tokenAddress } = YOUR_ASSET
    const offer = await seaport.createBuyOrder({
        asset: {
          tokenId,
          tokenAddress,
          schemaName // WyvernSchemaName. If omitted, defaults to 'ERC721'. Other options include 'ERC20' and 'ERC1155'
        },
        accountAddress,
        // Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
        startAmount: 1.2,
      })
})
export default router;