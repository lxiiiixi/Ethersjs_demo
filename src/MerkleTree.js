import { ethers, utils } from "ethers";
import { MerkleTree } from "merkletreejs";
import { Mnemonic, AlchemyKey } from "../private.js"


(async function main() {
    // 1. 生成merkle tree
    console.log("\n1. 生成merkle tree")

    const tokens = [
        "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
        "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
        "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
        "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB"
    ];

    const leaf = tokens.map(x => ethers.utils.keccak256(x));
    const merkletree = new MerkleTree(leaf, utils.keccak256, { sort: true });
    const proof = merkletree.getHexProof(leaf[0])
    const root = merkletree.getHexRoot();

    console.log("Leaf:")
    console.log(leaf)
    console.log("\nMerkleTree:")
    console.log(merkletree.toString())
    console.log("\nProof:")
    console.log(proof)
    console.log("\nRoot:")
    console.log(root)


    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${AlchemyKey}`) // 根据节点获取 provider
    const rootNode = ethers.utils.HDNode.fromMnemonic(Mnemonic);
    const secondAccountNode = rootNode.derivePath("m/44'/60'/0'/0/1")
    const wallet = (new ethers.Wallet(secondAccountNode.privateKey)).connect(provider); // 根据助记词获取钱包对象并连接 provider
    // 3. 创建合约工厂
    // NFT的abi
    const abiNFT = [
        "constructor(string memory name, string memory symbol, bytes32 merkleroot)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function mint(address account, uint256 tokenId, bytes32[] calldata proof) external",
        "function ownerOf(uint256) view returns (address)",
        "function balanceOf(address) view returns (uint256)",
    ];
    // 合约字节码，在remix中，你可以在两个地方找到Bytecode
    // i. 部署面板的Bytecode按钮
    // ii. 文件面板artifact文件夹下与合约同名的json文件中
    // 里面"object"字段对应的数据就是Bytecode，挺长的，608060起始
    // "object": "608060405260646000553480156100...
    const bytecodeNFT = contractJson.default.object;
    const factoryNFT = new ethers.ContractFactory(abiNFT, bytecodeNFT, wallet);

})()
