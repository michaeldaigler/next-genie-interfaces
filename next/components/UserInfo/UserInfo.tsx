import React from "react";
import { UserInfoBox } from './UserInfo.style'
interface IUserInfo {
    address?: string;
    username?: string;
    balance?: number
}

const UserInfo: React.FC<IUserInfo> = ({address, username }) => {
    return (
        <>
            <UserInfoBox style={{gridArea:'c'}} >
                Address: {address}
            </UserInfoBox>
        </>
    );
}

export default UserInfo;