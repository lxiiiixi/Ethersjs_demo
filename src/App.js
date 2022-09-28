import React from "react";
import { ethers } from "ethers";
import Account from "./Account";
import ContractRead from "./Contract_read";
import SignedTransaction from "./Signed_transaction";
import WriteContract from "./Contract_write";
import EventContract from "./Contract_event";
import InspectBlock from "./Inspect_block";
import Network from "./Network";

function App() {

  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(ethereum); // 提供对区块链及其状态的只读访问 (即连接)

  provider.on("block", (blockNumber) => {
    // Emitted on every block change
    // console.log(blockNumber);
  })



  // const signer = provider.getSigner() // metaMask允许签署交易以发送以太币并支付以改变区块链内的状态 因此需要账户签名者

  return (
    <div>
      <Account provider={provider} /> <hr />
      <ContractRead /> <hr />
      <SignedTransaction provider={provider} /> <hr />
      <WriteContract provider={provider} /> <hr />
      <EventContract provider={provider} /> <hr />
      <InspectBlock provider={provider} /> <hr />
      <Network provider={provider} /> <hr />
    </div>
  );
}

export default App;
