import { ethers } from "ethers";
import { Mnemonic, AlchemyKey } from "../private.js"


(async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${AlchemyKey}`) // 根据节点获取 provider

    const rootNode = ethers.utils.HDNode.fromMnemonic(Mnemonic);
    const secondAccountNode = rootNode.derivePath("m/44'/60'/0'/0/1")
    const wallet = (new ethers.Wallet(secondAccountNode.privateKey)).connect(provider); // 根据助记词获取钱包对象并连接 provider


    // WETH的ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function deposit() public payable",
        "function transfer(address, uint) public returns (bool)",
        "function withdraw(uint) public",
    ];

    const addressWEHT = "0x0B1ba0af832d7C05fD64161E0Db78E85978E8082" // goerli 测试网的WETH地址
    const contractWETH = new ethers.Contract(addressWEHT, abiWETH, wallet)

    const address = await wallet.getAddress()
    // 1. 读取WETH合约的链上信息（WETH abi）
    console.log("\n1. 读取WETH余额", address)

    const param1 = contractWETH.interface.encodeFunctionData("balanceOf", [address])
    console.log(`编码结果： ${param1}`)

    const tx1 = {
        to: addressWEHT,
        data: param1
    }
    const balanceWETH = await provider.call(tx1)
    console.log(`余额: ${ethers.utils.formatEther(balanceWETH)}\n`)


    const param2 = contractWETH.interface.encodeFunctionData("deposit")
    console.log(`编码结果： ${param2}`)
    const tx2 = {
        to: addressWEHT,
        data: param2,
        value: ethers.utils.parseEther("0.001")
    }

    const receipt1 = await wallet.sendTransaction(tx2)
    await receipt1.wait()
    console.log(`交易详情：`)
    console.log(receipt1)
    const balanceWETH_deposit = await contractWETH.balanceOf(address)
    console.log(`存款后WETH持仓: ${ethers.utils.formatEther(balanceWETH_deposit)}\n`)

})()
