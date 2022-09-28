import React from 'react'
import { ethers } from "ethers";

export default function Account({ provider }) {

    const connect = async () => {
        let accountAddress = await provider.send("eth_requestAccounts", []) // 进行钱包授权 并 获取到当前账户地址
        const balance = await provider.getBalance(accountAddress[0]) // 当前账户余额
        console.log(`\nETH Balance of ${accountAddress[0]} --> ${ethers.utils.formatEther(balance)} ETH\n`)

        const addressCode = await provider.getCode(accountAddress[0])
        console.log(`\nETH contract code of ${accountAddress[0]} --> ${addressCode} , If there is no contract currently deployed, the result is 0x.`)

        const storageAt = await provider.getStorageAt(accountAddress[0], 0)
        console.log(`\nthe Bytes32 value of the position pos at address addr ${accountAddress[0]} --> ${storageAt} \n`)

        const transactionCount = await provider.getTransactionCount(accountAddress[0])
        const transaction = await provider.getTransaction(accountAddress[0])
        console.log("transactionCount:", transactionCount, transaction)

    }

    return (
        <button onClick={connect}>链接MetaMask并获取账户信息</button>
    )
}
