import { ethers } from "ethers";
import { Mnemonic } from "../private.js"

// https://www.wtf.academy/en/ether-start/HDwallet/

(async function main() {
    // 生成随机助记词
    const mnemonic = ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(32))
    // 创建HD钱包
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic)
    // 如果使用自己的助记词去生成，会发现按照顺序生成的账户地址和自己账户的地址都是按照顺序一一对应相同的
    // const hdNode = ethers.utils.HDNode.fromMnemonic(Mnemonic) 
    console.log(hdNode);

    const numWallet = 10
    let basePath = "m/44'/60'/0'/0";
    let wallets = [];
    for (let i = 0; i < numWallet; i++) {
        let hdNodeNew = hdNode.derivePath(basePath + "/" + i);
        let walletNew = new ethers.Wallet(hdNodeNew.privateKey);
        console.log(`第${i + 1}个钱包地址： ${walletNew.address}`)
        wallets.push(walletNew);
    }


})()
