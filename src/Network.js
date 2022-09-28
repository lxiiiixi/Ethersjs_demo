import React from 'react'
import { ethers } from 'ethers';

export default function Network({ provider }) {

    const getNetwork = async () => {
        const connectedNetwork = await provider.getNetwork()
        console.log("connectedNetwork", connectedNetwork);

        const blockNumber = await provider.getBlockNumber()
        console.log("block number (or height) of the most recently mined block:", blockNumber);

        const gasPrice = await provider.getGasPrice()
        console.log("a best guess of the Gas Price to use in a transaction:", ethers.utils.formatUnits(gasPrice, "gwei"));
    }

    return (
        <button onClick={getNetwork}>Network</button>
    )
}
