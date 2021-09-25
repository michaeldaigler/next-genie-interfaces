import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import UserInfo from '../components/UserInfo/UserInfo';
import HorizontalScroll from '../components/HorizonatalScroll/HorizontalScroll';
import { CurateHeader, ConnectButton, AppContainer } from './App.styles';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

  const [address, setAddress] = useState<any>('---');
  const [web3Modal, setWeb3Modal] = useState<Web3Modal>();
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }
  useEffect(() => {

  },[])

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: 'http://127.0.0.1:8545/'
    });
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    async function getAddress() {
      if (signer) {
        const newAddress = await signer.getAddress();
        setAddress(newAddress);
      }
    }

    getAddress();
  },[])

  return (
    <AppContainer>
      <h1 style={{gridArea:'h'}}>cu<CurateHeader>RATE</CurateHeader></h1>
      <ConnectButton style={{ gridArea: 'a' }} onClick={() => connectWallet()}>Connect Wallet</ConnectButton>
      <HorizontalScroll />
      <UserInfo  address={address}/>
     </AppContainer>
  );
}

export default Home
