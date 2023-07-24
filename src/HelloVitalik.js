import { ethers } from "ethers";

// 声明一个provider用于连接以太坊网络

const provider1 = new ethers.getDefaultProvider();
// 1. ethers内置了一些公用rpc，方便用户连接以太坊，不过访问速度有限制，仅测试用，生产环境还是要申请个人rpc。

const provider3 = new ethers.providers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/Z2xliWVjYToNgU62-55w8-UuY28l79Zq");

const main = async () => {
    const balance1 = await provider1.getBalance("vitalik.eth");
    console.log(`ETH Balance of vitalik: ${ethers.utils.formatEther(balance1)} ETH`);

    const balance3 = await provider3.getBalance("vitalik.eth");
    console.log(`ETH Balance of vitalik: ${ethers.utils.formatEther(balance3)} ETH`);
};
main();


/**
 * https://docs.ethers.org/v5/getting-started/#getting-started--connecting
 * 
 * 得到 Provider 的方法：
 * 
 * 1. 使用 ethers 内置的公用 rpc ，也就是 `ethers.getDefaultProvider();`
 * 2. 使用 MetaMask 连接（需要浏览器环境）
 * 3. 使用特定的 rpc 节点（推荐，去相关的 rpc 服务器上申请一个 api 即可）
 * 
 * 如果没有提供特定的任何 provider 或者 wallet API，ethers 就会默认连接本地节点 http://127.0.0.1:8545，
 * 如果本地节点不可用或者没有连接到以太坊，就会产生一些错误。
 */
