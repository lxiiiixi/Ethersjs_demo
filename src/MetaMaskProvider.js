import { ethers } from "../ethers-5.2.esm.min.js";

let provider2;
if (window.ethereum) {
    provider2 = new ethers.providers.Web3Provider(window.ethereum);
}


const main = async () => {
    if (provider2) {
        const balance2 = await provider2.getBalance("vitalik.eth");
        // await provider3.send("eth_requestAccounts", []);
        console.log(`ETH Balance of vitalik: ${ethers.utils.formatEther(balance2)} ETH`);
    }
};
main();

