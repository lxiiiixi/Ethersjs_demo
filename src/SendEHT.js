// https://www.wtf.academy/en/ether-start/SendETH/
import { ethers } from "ethers";
import { Mnemonic, AlchemyKey } from "../private.js"

(async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${AlchemyKey}`)

    // 创建随机的wallet对象
    const wallet1 = ethers.Wallet.createRandom()
    // const wallet2 = ethers.Wallet.fromMnemonic(Mnemonic) // 得到的是这个助记词对应的第一个账户
    const rootNode = ethers.utils.HDNode.fromMnemonic(Mnemonic); // 使用助记词创建一个根节点
    const secondAccountNode = rootNode.derivePath("m/44'/60'/0'/0/1"); // 派生第二个账户（路径为 m/44'/60'/0'/0/1）
    const wallet2 = new ethers.Wallet(secondAccountNode.privateKey); // 使用派生节点的私钥创建第二个账户
    const wallet1WithProvider = wallet1.connect(provider)
    const wallet2WithProvider = wallet2.connect(provider)
    const mnemonic = wallet1.mnemonic // 获取助记词

    console.log(`钱包1助记词: ${mnemonic.phrase}`)
    console.log(`钱包1私钥: ${wallet1.privateKey}`)
    console.log(`钱包1发送交易次数: ${await wallet1WithProvider.getTransactionCount()}`)
    console.log(`钱包1余额: ${ethers.utils.formatEther(await wallet1WithProvider.getBalance())} ETH`)
    console.log(`钱包2余额: ${ethers.utils.formatEther(await wallet2WithProvider.getBalance())} ETH`)
    console.log(`钱包2地址: ${wallet2.address}`)


    // 开始构造交易
    const tx = {
        to: wallet1.address,
        value: ethers.utils.parseEther("0.0001")
    }
    // iii. 发送交易，获得收据
    console.log(`\nii. 等待交易在区块链确认（需要几分钟）`)
    const receipt = await wallet2WithProvider.sendTransaction(tx) // 这里必须使用绑定了provider的wallet2WithProvider而不是wallet2
    await receipt.wait() // 等待链上确认交易
    console.log(receipt) // 打印交易详情
    // iv. 打印交易后余额
    console.log(`\niii. 发送后余额`)
    console.log(`钱包1: ${ethers.utils.formatEther(await wallet1WithProvider.getBalance())} ETH`)
    console.log(`钱包2: ${ethers.utils.formatEther(await wallet2WithProvider.getBalance())} ETH`)
})()

