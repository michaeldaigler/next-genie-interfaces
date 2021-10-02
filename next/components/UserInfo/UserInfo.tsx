import React from "react";
import { UserInfoBox } from './UserInfo.style';
import {BigNumberish, ethers, Signer} from 'ethers'
import Account from "./Account";
interface IUserInfo {
    address: string;
    signer: any;
    username?: string;
    balance?: number;
    gridPosition: string;
}

const UserInfo: React.FC<IUserInfo> = ({ address, username, balance, gridPosition, signer }) => {
    if (typeof balance?.toString() === 'undefined') {
        balance = 0;
    }



    console.log(balance)
    return (
        <>
            <UserInfoBox style={{ gridArea: gridPosition }} >
                <span>{address}</span><br/>
                <span>Balance: {balance}</span>
                {/* <Account address={address} userSigner={signer} price={balance}/> */}
            </UserInfoBox>
        </>
    );
}

export default UserInfo;