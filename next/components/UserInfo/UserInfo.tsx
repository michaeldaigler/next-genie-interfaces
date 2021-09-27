import React from "react";
import { UserInfoBox } from './UserInfo.style';
import {BigNumberish, ethers} from 'ethers'
interface IUserInfo {
    address?: string;
    username?: string;
    balance?: BigInt | number | string
}

const UserInfo: React.FC<IUserInfo> = ({ address, username, balance }) => {
    if (typeof balance?.toString() === 'undefined') {
        balance = 0;
    }


    const sanitizedBalance = ethers.utils.parseEther(balance);
    console.log(balance)
    return (
        <>
            <UserInfoBox style={{gridArea:'c'}} >
                Address: {address} <br />
                Balance: {sanitizedBalance}
            </UserInfoBox>
        </>
    );
}

export default UserInfo;