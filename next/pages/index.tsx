import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect, useCallback, useReducer } from 'react'
import UserInfo from '../components/UserInfo/UserInfo';
import HorizontalScroll from '../components/HorizonatalScroll/HorizontalScroll';
import { CurateHeader, ConnectButton, AppContainer } from './App.styles';
import { BigNumber, ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletLink from 'walletlink';
import Web3Connect from 'web3connect';
import WalletConnectProvider from '@walletconnect/web3-provider'
import { createRaribleSdk, RaribleSdk } from "@rarible/protocol-ethereum-sdk"
import { Web3Ethereum } from "@rarible/web3-ethereum"
import Web3 from "web3"

import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {HorizontalScrollType } from '../components/HorizonatalScroll/HorizontalScroll';

const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'
const providerOptions = {

  metaMask: {
    package: ethers.providers.getDefaultProvider(),
    options: {
      infuraId: INFURA_ID
    },
    torus: {

    },
    display: {
      logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
      name: 'Coinbase',
      description: 'Connect to Coinbase Wallet (not Coinbase App)',
    }
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: INFURA_ID, // required
    },
  },
  'custom-walletlink': {
    display: {
      logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
      name: 'Coinbase',
      description: 'Connect to Coinbase Wallet (not Coinbase App)',
    },
    package: WalletLink,
    connector: async (_:any, options: any) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName,
      })
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
      await provider.enable()
      return provider
    },
  },
}

let web3Modal: Web3Modal
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    network: 'mainnet', // optional
    cacheProvider: true,
    providerOptions, // required
  })
}

type StateType = {
  provider?: any
  web3Provider?: any
  address?: string | null
  chainId?: number | null
}

type ActionType =
  | {
      type: 'SET_WEB3_PROVIDER'
      provider?: StateType['provider']
      web3Provider?: StateType['web3Provider']
      address?: StateType['address']
      chainId?: StateType['chainId']
    }
  | {
      type: 'SET_ADDRESS'
      address?: StateType['address']
    }
  | {
      type: 'SET_CHAIN_ID'
      chainId?: StateType['chainId']
    }
  | {
      type: 'RESET_WEB3_PROVIDER'
    }

const initialState: StateType = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case 'SET_WEB3_PROVIDER':
      return {
        ...state,
        provider: action.provider,
        web3Provider: action.web3Provider,
        address: action.address,
        chainId: action.chainId,
      }
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.address,
      }
    case 'SET_CHAIN_ID':
      return {
        ...state,
        chainId: action.chainId,
      }
    case 'RESET_WEB3_PROVIDER':
      return initialState
    default:
      throw new Error()
  }
}




const Home: NextPage = () => {
  // const [rariProvider, setRariProvider] = useState<any>()
	// const [sdk, setSdk] = useState<RaribleSdk>()
	// const [accounts, setAccounts] = useState<string[]>([])
  const [state, dispatch] = useReducer(reducer, initialState)
  const { provider, web3Provider, chainId } = state

  const [address, setAddress] = useState<any>('---');
  const [balance, setBalance] = useState<number>();
  const [signer, setSigner] = useState<any>();
  // const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: 'http://127.0.0.1:8545/'
    });
    const provider = await web3Modal.connect()

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider =  new ethers.providers.Web3Provider(provider)
    const connection = await web3Modal.connect()

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()
    // const provider = new ethers.providers.Web3Provider(connection)
    // const signer = provider.getSigner()
  }

  const connect = useCallback(async function () {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.
    const provider = await web3Modal.connect()
    console.log(provider)
    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new ethers.providers.Web3Provider(provider)

    const signer = web3Provider.getSigner()
    const address = await signer.getAddress()

    const network = await web3Provider.getNetwork()

    dispatch({
      type: 'SET_WEB3_PROVIDER',
      provider,
      web3Provider,
      address,
      chainId: network.chainId,
    })
  }, [])
  const disconnect = useCallback(
    async function () {
      await web3Modal.clearCachedProvider()
      if (provider?.disconnect && typeof provider.disconnect === 'function') {
        await provider.disconnect()
      }
      dispatch({
        type: 'RESET_WEB3_PROVIDER',
      })
    },
    [provider]
  )
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        })
      }

      const handleChainChanged = (accounts: string[]) => {
        // eslint-disable-next-line no-console
        console.log('accountsChanged', accounts)
        dispatch({
          type: 'SET_ADDRESS',
          address: accounts[0],
        })
      }

      const handleDisconnect = (error: { code: number; message: string }) => {
        // eslint-disable-next-line no-console
        console.log('disconnect', error)
        disconnect()
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', handleDisconnect)

      // Subscription Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', handleDisconnect)
        }
      }
    }
  }, [provider, disconnect]);

  const logout = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()



  }

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
          setSigner(signer);
        }
      }

      getAddress();
    }
  }, [balance]);


  return (
    <AppContainer>
      <h1 style={{gridArea:'h'}}>cu<CurateHeader>RATE</CurateHeader></h1>
      {address.length < 20 ? <ConnectButton style={{ gridArea: 'a' }} onClick={() => connect()}>Connect Wallet</ConnectButton> : <ConnectButton style={{ gridArea: 'a' }} onClick={() => logout()}>Logout </ConnectButton>}
      {address.length > 20 && <Link href="/mint-asset" passHref><ConnectButton style={{ gridArea: 'y' }} >Create</ConnectButton></Link>}
      {address.length > 20 && <Link href="/market-place" passHref><ConnectButton style={{ gridArea: '' }} >Market</ConnectButton></Link> }

      <style jsx>{`
        main {
          padding: 5rem 0;
          text-align: center;
        }
        p {
          margin-top: 0;
        }
        .container {
          padding: 2rem;
          margin: 0 auto;
          max-width: 1200px;
        }
        .grid {
          display: grid;
          grid-template-columns: auto auto;
          justify-content: space-between;
        }
        .button {
          padding: 1rem 1.5rem;
          background: ${web3Provider ? 'red' : 'green'};
          border: none;
          border-radius: 0.5rem;
          color: #fff;
          font-size: 1.2rem;
        }
        .mb-0 {
          margin-bottom: 0;
        }
        .mb-1 {
          margin-bottom: 0.25rem;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
      <HorizontalScroll frontends={[]} type={HorizontalScrollType.FRONTENDS }/>
      <UserInfo address={address} balance={balance} gridPosition={ 'c'} signer={signer}/>
     </AppContainer>
  );
}

export default Home
