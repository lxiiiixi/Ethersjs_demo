import React from 'react'

export default function Inspect_block({ provider }) {
    const getInfo = async () => {
        const block = await provider.getBlockNumber()
        console.log(`\nBlock Number: ${block}\n`)

        const blockInfo = await provider.getBlock(block)
        console.log("blockInfo", blockInfo)

        const { transactions } = await provider.getBlockWithTransactions(block)
        console.log(`\nLogging first transaction in block:\n`)
        console.log("transactions", transactions[0])
    }

    return (
        <button onClick={getInfo}>Inspect_block</button>
    )
}
