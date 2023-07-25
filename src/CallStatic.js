import { ethers } from "ethers";
import { Mnemonic, AlchemyKey } from "../private.js"

(async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${AlchemyKey}`) // 根据节点获取 provider
    const wallet = ethers.Wallet.fromMnemonic(Mnemonic) // 得到的是这个助记词对应的第一个账户

    // const tx = await contract.callStatic.函数名( 参数, {override})

    // DAI的ABI
    const abiDAI = [
        "function balanceOf(address) public view returns(uint)",
        "function transfer(address, uint) public returns (bool)",
    ];
    // DAI合约地址（主网）
    const addressDAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI Contract
    // 创建DAI合约实例
    const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider)

    const address = await wallet.getAddress()
    console.log("\n1. 读取测试钱包的DAI余额")
    const balanceDAI = await contractDAI.balanceOf(address)
    console.log(`我当前账户的DAI持仓: ${ethers.utils.formatEther(balanceDAI)}\n`)

    console.log("\n2.  用callStatic尝试调用transfer转账1 DAI，msg.sender为V神地址")
    // 发起交易
    const tx = await contractDAI.callStatic.transfer("vitalik.eth", ethers.utils.parseEther("10000"), { from: "vitalik.eth" })
    console.log(`交易会成功吗？：`, ethers.utils.parseEther("10000"), tx)

    console.log("\n3.  用callStatic尝试调用transfer转账1 DAI，msg.sender为测试钱包地址")
    const tx2 = await contractDAI.callStatic.transfer("vitalik.eth", ethers.utils.parseEther("10000", { from: "address" }))
    console.log(`交易会成功吗？：`, tx2)


})()
