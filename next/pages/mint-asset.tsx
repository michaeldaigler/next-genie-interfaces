import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { AppContainer, ConnectButton } from './App.styles'
import {MintingContainer, MintingInput} from '../components/Minting/Minting.styles'
const client = ipfsHttpClient({url: 'https://ipfs.infura.io:5001/api/v0'})
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../src/artifacts/contracts/NFT.sol/NFT.json'
import Market from '../src/artifacts/contracts/CurateMarketplace.sol/CurateMarketplace.json'
import UserInfo from '../components/UserInfo/UserInfo'
const MintAsset: React.FC = () => {
  const [address, setAddress] = useState<any>('---');
  const [balance, setBalance] = useState<number>();
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()
  useEffect(() => {
    if (window.ethereum) {


      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      console.log(signer)
      const getAddress = async () => {
        if (signer) {
          const newAddress = await signer.getAddress();
          const balance = await (await signer.getBalance()).toBigInt()
          const formattedBalance = ethers.utils.formatEther(balance)

          console.log(balance.toString())
          setAddress(newAddress);
          setBalance(Number(formattedBalance));
        }
      }

      getAddress();
    }
  }, [balance]);
  const onChange = async(e: any) =>{
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  const createSale = async (url: string) => {
    console.log(url)
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    console.log(provider)
    const signer = await provider.getSigner()

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    console.log(contract)
    console.log(transaction)

    let tx = await transaction.wait()
    let event = await tx.events[0]
    console.log(tx)
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    toast('Sending transaction');
    await transaction.wait()

  }
  const handleCancelClicked = () => {
    router.push('/')
  }
  const testToast = () => toast('Sending transaction');
  return (
    <AppContainer isMinting>
      <ConnectButton style={{gridArea: 'a'}} onClick={handleCancelClicked}>Cancel</ConnectButton>
      <ToastContainer />
      <MintingContainer style={{ gridArea: 'd'}}>
        <MintingInput
          placeholder="Asset Name"
        className="mt-8 border rounded p-4"
        style={{gridArea: ''}}
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          style={{gridArea: ''}}
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <MintingInput
           style={{gridArea: ''}}
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <MintingInput
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" src={fileUrl} />
          )
        }
        <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>

        <button onClick={testToast}>Test toast</button>
      </MintingContainer>
      <UserInfo address={address} balance={balance} gridPosition={'c'}/>
    </AppContainer>
  )
}


export default MintAsset;