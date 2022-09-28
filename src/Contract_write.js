import React from 'react'
import { ethers } from 'ethers'

export default function Write_contract({ provider }) {
    const account1 = "0x19759366933CaF4f4A0A6AEc01A4D6bFf3e520FE"
    const account2 = "0x037B83c8C7E8169565B8E14C03aeCF1855428de1"
    const ERC20_ABI = [
        "function balanceOf(address) view returns (uint)",
        "function transfer(address to, uint amount) returns (bool)",
    ];
    const privateKey1 = '9015ecdd3a15bfeef7d1ba396467c40a3f9df9c3907ad8b2967220fa70907758' // Private key of account 1

    const address = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
    // 测试 link token 的地址  https://docs.chain.link/docs/link-token-contracts/
    // 在chainlink上获取测试link之后在文档中查找对应测试网络的地址

    const contract = new ethers.Contract(address, ERC20_ABI, provider)
    const wallet = new ethers.Wallet(privateKey1, provider)

    const write = async () => {
        const balance = await contract.balanceOf(account1) // 获取钱包的 ERC20 余额

        console.log(`\nReading from ${address}\n`)
        console.log(`Balance of sender: ${balance}\n`)

        const contractWithWallet = contract.connect(wallet) // 合约连接钱包对象

        // 调用合约的 transfer 方法向其他账户转账
        // 注意这里是调用 ERC20 合约的 transfer 函数，而不是原生货币转账
        // 如果要调用 approve 函数，则为 contractWithWallet.approve
        const tx = await contractWithWallet.transfer(account2, balance)
        await tx.wait() // 等待交易上链

        console.log(tx)

        const balanceOfSender = await contract.balanceOf(account1)
        const balanceOfReciever = await contract.balanceOf(account2)

        console.log(`\nBalance of sender: ${balanceOfSender}`)
        console.log(`Balance of reciever: ${balanceOfReciever}\n`)
    }

    return (
        <button onClick={write}>Write_contract</button>
    )
}
