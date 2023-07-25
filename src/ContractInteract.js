import { ethers } from "ethers";
import { Mnemonic, AlchemyKey } from "../private.js"


(async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${AlchemyKey}`) // 根据节点获取 provider

    const rootNode = ethers.utils.HDNode.fromMnemonic(Mnemonic);
    const secondAccountNode = rootNode.derivePath("m/44'/60'/0'/0/1")
    const wallet = (new ethers.Wallet(secondAccountNode.privateKey)).connect(provider); // 根据助记词获取钱包对象并连接 provider

    console.log(`钱包发送交易次数: ${await wallet.getTransactionCount()}`)
    console.log(`钱包地址: ${wallet.address}`)

    // WETH的ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function deposit() public payable",
        "function transfer(address, uint) public returns (bool)",
        "function withdraw(uint) public",
    ];

    const addressWEHT = "0x0B1ba0af832d7C05fD64161E0Db78E85978E8082" // goerli 测试网的WETH地址
    const contractWETH = new ethers.Contract(addressWEHT, abiWETH, wallet)

    // 读取我当前账户的 weth 余额
    const address = await wallet.getAddress()
    const balanceWETH = await contractWETH.balanceOf(address)
    console.log(`存款前WET H持仓: ${ethers.utils.formatEther(balanceWETH)}\n`)

    // console.log("\n2. 调用desposit()函数，存入0.001 ETH")
    // // 发起交易并等待链上交易完成
    // const tx = await contractWETH.deposit({ value: ethers.utils.parseEther("0.001") })
    // await tx.wait()
    // console.log(`交易详情：`)
    // console.log(tx)
    const balanceWETH_deposit = await contractWETH.balanceOf(address)
    // console.log(`存款后WETH持仓: ${ethers.utils.formatEther(balanceWETH_deposit)}\n`)

    console.log("\n3. 调用transfer()函数，转账0.001 ETH")
    const tx2 = await contractWETH.transfer("0x19759366933CaF4f4A0A6AEc01A4D6bFf3e520FE", ethers.utils.parseEther("0.0001"))
    await tx2.wait()
    console.log(`转账后WETH持仓: ${ethers.utils.formatEther(balanceWETH_deposit)}\n`)


})()
