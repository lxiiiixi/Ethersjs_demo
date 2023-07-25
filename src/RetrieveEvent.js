import { Contract, ethers } from "ethers";
import { Mnemonic, AlchemyKey } from "../private.js"

// const transferEvents = await contract.queryFilter('事件名', 起始区块, 结束区块)

(async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${AlchemyKey}`) // 根据节点获取 provider

    const rootNode = ethers.utils.HDNode.fromMnemonic(Mnemonic);
    const secondAccountNode = rootNode.derivePath("m/44'/60'/0'/0/1")
    const wallet = (new ethers.Wallet(secondAccountNode.privateKey)).connect(provider); // 根据助记词获取钱包对象并连接 provider

    // WETH ABI，只包含我们关心的Transfer事件
    const abiWETH = [
        "event Transfer(address indexed from, address indexed to, uint amount)"
    ];
    const addressWEHT = "0x0B1ba0af832d7C05fD64161E0Db78E85978E8082" // goerli 测试网的WETH地址
    const contractWETH = new ethers.Contract(addressWEHT, abiWETH, wallet)

    const block = await provider.getBlockNumber()
    console.log(`当前区块高度: ${block}`);
    console.log(`打印事件详情:`);
    const transferEvents = await contractWETH.queryFilter('Transfer', block - 100, block)
    // 打印第1个Transfer事件
    console.log(transferEvents[0])
    // 解析Transfer事件的数据（变量在args中）
    console.log("\n2. 解析事件：")
    const amount = ethers.utils.formatUnits(ethers.BigNumber.from(transferEvents[0].args["amount"]), "ether")
    console.log(`地址 ${transferEvents[0].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`)

})()
