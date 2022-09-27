import React from 'react'
import { ethers } from "ethers";

export default function Account({ provider, connect }) {


    return (
        <button onClick={connect}>链接MetaMask并获取账户信息</button>
    )
}
