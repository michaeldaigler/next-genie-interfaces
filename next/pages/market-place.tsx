import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal";
import router from 'next/router';
import {
    AppContainer,
    CurateHeader,
    ConnectButton
} from './App.styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HorizontalScroll, { HorizontalScrollType } from '../components/HorizonatalScroll/HorizontalScroll';
import {
    nftaddress, nftmarketaddress
} from '../config';

import NFT from '../src/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../src/artifacts/contracts/CurateMarketplace.sol/CurateMarketplace.json'
import { route } from 'next/dist/server/router';

export default function Home() {
  const [nfts, setNfts] = useState<any>([])
  const [loadingState, setLoadingState] = useState<string>('not-loaded')
  useEffect(() => {
    fetchNFTs()
  }, [])
  async function fetchNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()
    const nfts = await Promise.all(data.map(async (nft: any) => {
      const tokenUri = await tokenContract.tokenURI(nft.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(nft.price.toString(), 'ether')
      let marketnft = {
        price,
        tokenId: nft.tokenId.toNumber(),
        seller: nft.seller,
        owner: nft.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return marketnft
    }))
    setNfts(nfts)
    setLoadingState('loaded')
  }
    const handleClicked = (e: any, location: 'portals' | 'create') => {
        location === 'portals' ? router.push('/') : router.push('mint-asset');

    }
  async function buyNft(nft: any) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
      toast('Sending transaction')
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    fetchNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
      <AppContainer>
          <ConnectButton onClick={(e) => handleClicked(e, 'portals')}>Portals</ConnectButton>
          <h1 style={{ gridArea: 'h' }}>cu<CurateHeader>RATE</CurateHeader></h1>
          <h1 style={{gridArea: 'b'}}>The <CurateHeader>MARKET</CurateHeader></h1>
          <HorizontalScroll nfts={nfts} type={HorizontalScrollType.MARKETPLACE} buyNFT={buyNft}/>

    </AppContainer>
  )
}