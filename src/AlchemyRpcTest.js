// Setup
import { Alchemy } from "alchemy-sdk";
import { AlchemySettings } from "../private.js";

const alchemy = new Alchemy(AlchemySettings);

// Get the latest block
const latestBlock = alchemy.core.getBlockNumber();

// Get all outbound transfers for a provided address
alchemy.core.getTokenBalances("vitalik.eth").then(res =>
    console.log(res)
);

// Get all the NFTs owned by an address
alchemy.nft.getNftsForOwner("vitalik.eth").then(res => console.log("vitalik.eth nfts: ", res));

// Listen to all new pending transactions
alchemy.ws.on({ method: "alchemy_pendingTransactions", fromAddress: "vitalik.eth" }, res =>
    console.log(res)
);
