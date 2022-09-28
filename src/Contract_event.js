import React from 'react'
import { ethers } from 'ethers';

// 构建合约 和 合约事件
export default function Event_contract({ provider }) {

    // 可以直接通过 函数签名 构建 abi
    // 需要用到哪个函数就写哪个，不需要写出全部的函数签名
    const ERC20_ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint)",

        "event Transfer(address indexed from, address indexed to, uint amount)"
    ];

    // 合约地址
    const address = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
    // 通过 地址，abi，provider 
    const contract = new ethers.Contract(address, ERC20_ABI, provider)

    const eventContract = async () => {
        const block = await provider.getBlockNumber()

        const transferEvents = await contract.queryFilter('Transfer', block - 10, block)
        // Return Events that match the event.
        console.log(block, transferEvents)
    }

    // Transfer 事件要在 abi 中声明
    // 括号中的参数分别对应 Transfer 事件的参数
    contract.on("Transfer", (from, to, amount, event) => {
        console.log(`${from} sent ${ethers.utils.formatEther(amount)} to ${to}`);
    });

    // 这里是指定参数的监听行为
    // 例如，我只想监听接收人是 `0x1234....` 的事件，那么就这样指定地址
    // 构造一个 filter，然后通过 filter 筛选
    const filter = contract.filters.Transfer(null, address);

    // Receive an event when that filter occurs
    contract.on(filter, (from, to, amount, event) => {
        // The to will always be "address"
        console.log(`I got ${ethers.utils.formatEther(amount)} from ${from}.`);
    });


    return (
        <>
            <button onClick={eventContract}>Event_contract</button>
        </>
    )
}
