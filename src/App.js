import React from "react";
import { ethers } from "ethers";
import Account from "./Account";
import Contract from "./Contract";
import SignedTransaction from "./Signed_transaction";

function App() {

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum); // 提供对区块链及其状态的只读访问 (即连接)
  let accountAddress = []
  const connect = async () => {
    accountAddress = await provider.send("eth_requestAccounts", []) // 进行钱包授权 并 获取到当前账户地址
    const balance = await provider.getBalance(accountAddress[0])
    console.log(`\nETH Balance of ${accountAddress[0]} --> ${ethers.utils.formatEther(balance)} ETH\n`)
  }

  // const signer = provider.getSigner() // metaMask允许签署交易以发送以太币并支付以改变区块链内的状态 因此需要账户签名者

  return (
    <div>
      <Account provider={provider} connect={connect} />
      <Contract />
      <SignedTransaction provider={provider} />
    </div>
  );
}

export default App;
