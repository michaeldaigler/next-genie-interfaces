import React from "react";
import { UserInfoBox } from './UserInfo.style';
import {BigNumberish, ethers} from 'ethers'
interface IUserInfo {
    address?: string;
    username?: string;
    balance?: number
}

const UserInfo: React.FC<IUserInfo> = ({ address, username, balance }) => {
    if (typeof balance?.toString() === 'undefined') {
        balance = 0;
    }



    console.log(balance)
    return (
        <>
            <UserInfoBox style={{gridArea:'c'}} >
                Address: {address} <br />
                Balance: {balance}
            </UserInfoBox>
        </>
    );
}

export default UserInfo;