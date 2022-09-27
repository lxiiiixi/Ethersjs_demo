import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export default function Signed_transaction({ provider }) {
    const [account1, setAccount1] = useState("")
    const [account2, setAccount2] = useState("")
    const [amount, setAmount] = useState("")

    const privateKey1 = '9015ecdd3a15bfeef7d1ba396467c40a3f9df9c3907ad8b2967220fa70907758' // Private key of account 1
    const wallet = new ethers.Wallet(privateKey1, provider)


    const sendTansaction = async () => {
        console.log(account1, account2, amount);
        const senderBalanceBefore = await provider.getBalance(account1)
        const recieverBalanceBefore = await provider.getBalance(account2)
        console.log(`\nSender balance before: ${ethers.utils.formatEther(senderBalanceBefore)}`)
        console.log(`reciever balance before: ${ethers.utils.formatEther(recieverBalanceBefore)}\n`)

        const tx = await wallet.sendTransaction({
            to: account2,
            value: ethers.utils.parseEther("0.025")
        })

        await tx.wait()
        console.log(tx)

        // {
        // accessList: []
        // chainId: 4
        // confirmations: 0
        // data: "0x"
        // from: "0x19759366933CaF4f4A0A6AEc01A4D6bFf3e520FE"
        // gasLimit: BigNumber { _hex: '0x5208', _isBigNumber: true }
        // gasPrice: null
        // hash: "0x005fe321c62d002cc3e062292046a13be3f0be4fdab520919f1efedef5a8f961"
        // maxFeePerGas: BigNumber { _hex: '0x59682f10', _isBigNumber: true }
        // maxPriorityFeePerGas: BigNumber { _hex: '0x59682f00', _isBigNumber: true }
        // nonce: 7
        // r: "0x799a8cac1faa07b8d0a6f492ee7325324ef21fd0b5aa1fbb29ca808edb5d2da8"
        // to: "0x037B83c8C7E8169565B8E14C03aeCF1855428de1"
        // type: 2
        // v: 0
        // value: BigNumber { _hex: '0x58d15e17628000', _isBigNumber: true }
        // wait:(confirms, timeout) => {… }
        // }

    }
    return (
        <div>
            <h5> Signed_transaction</h5>
            account1: <input value={account1} onChange={(e) => setAccount1(e.target.value)}></input>
            account2: <input value={account2} onChange={(e) => setAccount2(e.target.value)}></input>
            amount(ETH): <input value={amount} onChange={(e) => setAmount(e.target.value)}></input>
            <button onClick={sendTansaction}>send</button>
        </div>
    )
}
