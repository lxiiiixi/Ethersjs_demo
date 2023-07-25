import { ethers } from "ethers";
import { Mnemonic, AlchemyKey } from "../private.js"


(async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${AlchemyKey}`) // 根据节点获取 provider

    // USDT的合约地址
    const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    // 构建USDT的Transfer的ABI
    const abi = [
        "event Transfer(address indexed from, address indexed to, uint value)"
    ];
    // 生成USDT合约对象
    const contractUSDT = new ethers.Contract(contractAddress, abi, provider);

    console.log(contractUSDT);

    // 只监听一次
    console.log("\n1. 利用contract.once()，监听一次Transfer事件");
    contractUSDT.once('Transfer', (from, to, value) => {
        // 打印结果
        console.log(
            `${from} -> ${to} ${ethers.utils.formatUnits(ethers.BigNumber.from(value), 6)}`
        )
    })

    // 持续监听USDT合约
    console.log("\n2. 利用contract.on()，持续监听Transfer事件");
    contractUSDT.on("Transfer", (from, to, value) => {
        // 打印结果
        console.log(
            `${from} -> ${to} ${ethers.utils.formatUnits(ethers.BigNumber.from(value), 6)}`
        )
    })

})()
