## Provider 类

- `Provider`类是对以太坊网络连接的抽象，为标准以太坊节点功能提供简洁、一致的接口。在`ethers`中，`Provider`不接触用户私钥，只能读取链上信息，不能写入，这一点比`web3.js`要安全。

- 如何获得 provider：
  - 使用 ethers 内置的公用 rpc ，也就是 `new ethers.getDefaultProvider();`
  - 使用 MetaMask 连接（需要浏览器环境）`new ethers.providers.Web3Provider(window.ethereum);`
  - 使用特定的 rpc 节点（推荐，去相关的 rpc 服务器上申请一个 api 即可）`new ethers.providers.JsonRpcProvider(https://eth-mainnet.g.alchemy.com/v2/${AlchemyKey});`

## Contract 类

- `Contract`类是部署在以太坊网络上的合约（`EVM`字节码）的抽象。通过它，开发者可以非常容易的对合约进行读取`call`和交易`transcation`，并可以获得交易的结果和事件。

- 创建 Contract 变量：`Contract`对象分为两类，只读和可读写。只读`Contract`只能读取链上合约信息，执行`call`操作，即调用合约中`view`和`pure`的函数，而不能执行交易`transaction`。

  - 只读`Contract`：参数分别是合约地址，合约`abi`和`provider`变量（只读）。

    ```js
    const contract = new ethers.Contract(`address`, `abi`, `provider`);
    ```

  - 可读写`Contract`：参数分别是合约地址，合约`abi`和`signer`变量。`Signer`签名者是`ethers`中的另一个类，用于签名交易。

    ```js
    const contract = new ethers.Contract(`address`, `abi`, `signer`);
    ```

**注意** `ethers`中的`call`指的是只读操作，与`solidity`中的`call`不同。

## Signer 签名者类

`Web3.js`认为用户会在本地部署以太坊节点，私钥和网络连接状态由这个节点管理（实际并不是这样）；而在`ethers.js`中，`Provider`提供器类管理网络连接状态，`Signer`签名者类或`Wallet`钱包类管理密钥，安全且灵活。

在`ethers`中，`Signer`签名者类是以太坊账户的抽象，可用于对消息和交易进行签名，并将签名的交易发送到以太坊网络，并更改区块链状态。`Signer`类是抽象类（抽象类是一种只能被继承，不能被实例化的类。这意味着你不能创建一个抽象类的实例，但你可以创建继承自抽象类的子类的实例。），不能直接实例化，我们需要使用它的子类：`Wallet`钱包类。

## Wallet 钱包类

- `Wallet`类继承了`Signer`类，并且开发者可以像包含私钥的外部拥有帐户（`EOA`）一样，用它对交易和消息进行签名。

- 创建 wallet 实例的几种方法；

  - 创建随机的 wallet 对象：`const wallet1 = new ethers.Wallet.createRandom()`

  - 用私钥创建 wallet 对象

    ```js
    const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
    const wallet2 = new ethers.Wallet(privateKey, provider)
    ```

  - 从助记词创建 wallet 对象

    ```js
    // 从助记词创建wallet对象
    const wallet3 = new ethers.Wallet.fromMnemonic(mnemonic.phrase)
    
    // 如果想要获取根据该助记词创建出的更多对象
    const rootNode = ethers.utils.HDNode.fromMnemonic(Mnemonic); // 使用助记词创建一个根节点
    const secondAccountNode = rootNode.derivePath("m/44'/60'/0'/0/1"); // 派生第二个账户（路径为 m/44'/60'/0'/0/1）（如果是想要第三个第四个...修改最后一个数字即可）
    const wallet3 = new ethers.Wallet(secondAccountNode.privateKey); // 使用派生节点的私钥创建第二个账户
    ```

- 钱包使用 `connect.(provider)` 连接到以太坊节点：`const wallet1WithProvider = wallet1.connect(provider)`

- 可以通过钱包实例获取很多相关信息，具体的可以创建之后打印出来查看，例如：`wallet.getAddress()` 获取钱包地址，`wallet.mnemonic.phrase` 获取钱包助记词，`wallet.privateKey` 获取私钥，`wallet.getTransactionCount()` 获取钱包在链上的交互次数等等。
- 可以使用 wallet 实例的 `sendTransaction` 来构建和发送交易。

> `ethers.js`提供了[HDNode类](https://docs.ethers.io/v5/api/utils/hdnode/)，方便开发者使用HD钱包。
>
> HD钱包（Hierarchical Deterministic Wallet，多层确定性钱包）是一种数字钱包 ，通常用于存储比特币和以太坊等加密货币持有者的数字密钥。通过它，用户可以从一个随机种子创建一系列密钥对，更加便利、安全、隐私。要理解HD钱包，我们需要简单了解比特币的[BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)，[BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)，和[BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)。
>
> `BIP44`为`BIP32`的衍生路径提供了一套通用规范，适配比特币、以太坊等多链。这一套规范包含六级，每级之间用"/"分割：
>
> ```text
> m / purpose' / coin_type' / account' / change / address_index
> ```
>
> 其中：
>
> - m: 固定为"m"
> - purpose：固定为"44"
> - coin_type：代币类型，比特币主网为0，比特币测试网为1，以太坊主网为60
> - account：账户索引，从0开始。
> - change：是否为外部链，0为外部链，1为内部链，一般填0.
> - address_index：地址索引，从0开始，想生成新地址就把这里改为1，2，3。
>
> 举个例子，以太坊的默认衍生路径为`"m/44'/60'/0'/0/0"`。
>
> 也就是说根据一个私钥/助记词生成的钱包按照顺序都会得到相同的地址。

## ContractFactory 合约工厂类

`ethers.js`创造了合约工厂`ContractFactory`类型用于创建合约实例，方便开发者部署合约。你可以利用合约`abi`，编译得到的字节码`bytecode`和签名者变量`signer`来创建合约工厂实例，为部署合约做准备。

```js
const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);
```

**注意**：如果合约的构造函数有参数，那么在`abi`中必须包含构造函数。

一些重要方法：

- **deploy()**：使用 deploy() 方法可以部署一个新的智能合约到区块链上。它返回一个 Promise，该 Promise 在合约部署完成后会返回一个新的 Contract 实例。
- **attach()**：通过 attach() 方法，您可以连接到已部署的智能合约，以便与其交互。它接受合约地址和合约 ABI 作为参数，并返回一个已连接的 Contract 实例。

## Interface 接口类

`ethers.js`的接口类抽象了与以太坊网络上的合约交互所需的`ABI`编码和解码。`ABI`（Application Binary Interface）与`API`类似，是一格式，用于对合约可以处理的各种类型的数据进行编码，以便它们可以交互。

我们可以利用`abi`生成或者直接从合约中获取`interface`变量：

```js
// 利用abi生成
const interface = ethers.utils.Interface(abi)
// 直接从contract中获取
const interface2 = contract.interface
```

接口类封装了一些编码解码的方法。与一些特殊的合约交互时（比如代理合约），你需要编码参数、解码返回值：

**注意**：相关函数必须包含在`abi`中。

- `getSighash()`：获取函数选择器（function selector），参数为函数名或函数签名。

  ```js
  interface.getSighash("balanceOf");
  // '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
  ```

- `encodeDeploy()`：编码构造器的参数，然后可以附在合约字节码的后面。

  ```js
  interface.encodeDeploy("Wrapped ETH", "WETH");
  ```

- `encodeFunctionData()`：编码函数的`calldata`。

  ```js
  interface.encodeFunctionData("balanceOf", ["0xc778417e063141139fce010982780140aa0cd5ab"]);
  ```

- `decodeFunctionResult()`：解码函数的返回值。

  ```js
  interface.decodeFunctionResult("balanceOf", resultData)
  ```

## 链上数据的读和写

### 读

- 读取基本的链上信息：`Provider` 类封装了一些方法，可以便捷的读取链上数据
  - 例如：`getBalance()`函数读取某个账户余额，`getNetwork()`查询`provider`连接到了哪条链，`getBlockNumber()`查询当前区块高度，`getFeeData()`查询当前建议的`gas`设置，`getBlock()`查询区块信息，`getCode()`查询某个地址的合约bytecode等等。
- 读取合约信息：读取合约信息不需要 gas
  1. 创建 provider：`const provider = new ethers.providers.JsonRpcProvider(...)`
  2. 创建只读 Contract 实例：`const contract = new ethers.Contract(address, abi, provider)`
  3. 利用只读`Contract`实例调用合约的`view`和`pure`函数



### 写 - 合约交互

写入合约信息需要我们构建交易并且支付 gas，该交易将由整个网络上的每个节点以及矿工验证，并改变区块链状态。

1. 创建可写的 Contract 变量

```js
const contract = new ethers.Contract(address, abi, signer)
```

其中`address`为合约地址，`abi`是合约的`abi`接口，`signer`是`wallet`对象。注意，这里你需要提供`signer`，而在声明可读合约时你只需要提供`provider`。

你也可以利用下面的方法，将可读合约转换为可写合约：

```js
const contract2 = contract.connect(signer)
```

2. 合约交互

```js
// 发送交易
const tx = await contract.METHOD_NAME(args [, overrides])
// 等待链上确认交易
await tx.wait() 
```

其中`METHOD_NAME`为调用的函数名，`args`为函数参数，`[, overrides]`是可以选择传入的数据，包括：

- gasPrice：gas价格
- gasLimit：gas上限
- value：调用时传入的ether（单位是wei）
- nonce：nonce

**注意：** 此方法不能获取合约运行的返回值，如有需要，要使用`Solidity`事件记录，然后利用交易收据去查询。

## 发送 ETH

我们可以利用`Wallet`实例来发送`ETH`。首先，我们要构造一个交易请求，在里面声明接收地址`to`和发送的`ETH`数额`value`。交易请求`TransactionRequest`类型可以包含发送方`from`，nonce值`nounce`，请求数据`data`等信息。

```javascript
    // 创建交易请求，参数：to为接收地址，value为ETH数额
    const tx = {
        to: address1,
        value: ethers.utils.parseEther("0.001")
    }
```

然后，我们就可以利用`Wallet`类的`sendTransaction`来发送交易，等待交易上链，并获得交易的收据，非常简单。

```javascript
    // 发送交易，获得收据
    const receipt = await wallet.sendTransaction(tx)
    await receipt.wait() // 等待链上确认交易
    console.log(receipt) // 打印交易详情
```

## 部署合约

- 在以太坊上，智能合约的部署是一种特殊的交易：将编译智能合约得到的字节码发送到0地址。如果这个合约的构造函数有参数的话，需要利用`abi.encode`将参数编码为字节码，然后附在在合约字节码的尾部一起发送。

- 部署流程

  1. 根据合约的 abi、编译后的字节码 bytecode 和签名者变量 signer 创建合约工厂`ContractFactory`类型

     `const contractFactory = new ethers.ContractFactory(abi, bytecode, signer);`

  2. 调用合约工厂实例的 `deploy` 函数并传入合约构造函数的参数 `args` 来部署并获得合约实例

     `const contract = await contractFactory.deploy(args)`

  3. 可以利用下面两种命令，等待合约部署在链上确认，然后再进行交互。

     ```js
     await contractERC20.deployed()
     //或者 
     await contract.deployTransaction.wait()
     ```

## 检索事件

智能合约释放出的事件存储于以太坊虚拟机的日志中。日志分为两个主题`topics`和数据`data`部分，其中事件哈希和`indexed`变量存储在`topics`中，作为索引方便以后搜索；没有`indexed`变量存储在`data`中，不能被直接检索，但可以存储更复杂的数据结构。

以ERC20代币中的`Transfer`转账事件为例，在合约中它是这样声明的：

```solidity
event Transfer(address indexed from, address indexed to, uint256 amount);
```

它共记录了3个变量`from`，`to`和`amount`，分别对应代币的发出地址，接收地址和转账数量，其中`from`和`to`前面带有`indexed`关键字。转账时，`Transfer`事件会被记录，可以在`etherscan`中查到。

![image-20230726093143048](https://cdn.jsdelivr.net/gh/lxiiiixi/Image-Hosting/Markdown/202307260931747.png)

从上图中可以看到，`Transfer`事件被记录到了EVM的日志中，其中`Topics`包含3个数据，分别对应事件哈希，发出地址`from`，和接收地址`to`；而`Data`中包含一个数据，对应转账数额`amount`。



我们可以利用`Ethers`中合约类型的`queryFilter()`函数读取合约释放的事件。

```js
const transferEvents = await contract.queryFilter('事件名', 起始区块, 结束区块)
```

`queryFilter()`包含3个参数，分别是事件名（必填），起始区块（选填），和结束区块（选填）。检索结果会以数组的方式返回。

**注意**：要检索的事件必须包含在合约的`abi`中。

## 监听合约事件

- `contract.on`

在`ethersjs`中，合约对象有一个`contract.on`的监听方法，让我们持续监听合约的事件：

```
contract.on("eventName", function)
```

`contract.on`有两个参数，一个是要监听的事件名称`"eventName"`，需要包含在合约`abi`中；另一个是我们在事件发生时调用的函数。



`contract.on`有两个参数，一个是要监听的事件名称`"eventName"`，需要包含在合约`abi`中；另一个是我们在事件发生时调用的函数。

- `contract.once`

合约对象有一个`contract.once`的监听方法，让我们只监听一次合约释放事件，它的参数与`contract.on`一样：

```js
contract.once("eventName", function)
```

步骤：先创建合约实例，再根据合约实例去监听。

## 事件过滤

`ethers.js`中的合约类提供了`contract.filters`来简化过滤器的创建：

```js
const filter = contract.filters.EVENT_NAME( ...args ) 
```

其中`EVENT_NAME`为要过滤的事件名，`..args`为主题集/条件。前面的规则有一点抽象，下面举几个例子。

1. 过滤来自`myAddress`地址的`Transfer`事件

   ```js
   contract.filters.Transfer(myAddress)
   ```

2. 过滤所有发给 `myAddress`地址的`Transfer`事件

   ```js
   contract.filters.Transfer(null, myAddress)
   ```

3. 过滤所有从 `myAddress`发给`otherAddress`的`Transfer`事件

   ```js
   contract.filters.Transfer(myAddress, otherAddress)
   ```

4. 过滤所有发给`myAddress`或`otherAddress`的`Transfer`事件

   ```js
   contract.filters.Transfer(null, [ myAddress, otherAddress ])
   ```

## BigNumber 和单位转换

- 转换：可以利用`ethers.BigNumber.from()`函数将`string`，`number`，`BigNumber`等类型转换为`BigNumber`。(超过js最大安全整数的数值将不能转换。)
- 运算：`BigNumber`支持很多运算，例如加减乘除、取模`mod`，幂运算`pow`，绝对值`abs`等运算。
- 单位转换（`1 ether`等于`10^18 wei`，一般用户可读的字符串以 ether 为单位，机器可读以 wei 为单位）
  - `formatUnits(变量, 单位)`：格式化，小单位转大单位，比如 `wei` -> `ether`，在显示余额时很有用。参数中，单位填位数（数字）或指定的单位（字符串）。
  - `parseUnits`：解析，大单位转小单位，比如`ether` -> `wei`，在将用户输入的值转为`wei`为单位的数值很有用。

## callstatic

合约类的`callStatic`方法可以在发送交易之前检查交易是否会失败，节省大量gas。

`callStatic`方法是属于`ethers.Contract`类的编写方法分析，同类的还有`populateTransaction`和`estimateGas`方法。

在`ethers.js`中你可以利用`contract`对象的`callStatic()`来调用以太坊节点的`eth_call`。如果调用成功，则返回`ture`；如果失败，则报错并返回失败原因。方法：

```js
    const tx = await contract.callStatic.函数名( 参数, {override})
    console.log(`交易会成功吗？：`, tx)
```

- 函数名：为模拟调用的函数名。
- 参数：调用函数的参数。
- {override}：选填，可包含一下参数：
  - `from`：执行时的`msg.sender`，也就是你可以模拟任何一个人的调用，比如V神。
  - `value`：执行时的`msg.value`。
  - `blockTag`：执行时的区块高度。
  - `gasPrice`
  - `gasLimit`
  - `nonce`

## 编码 calldata

我们可以利用接口类编码 `calldata` 的方法

比如我们想要通过 calldata 进行合约交互的步骤如下：

1. 创建 provider 和 wallet 变量
2. 创建目标合约实例
3. 编码 calldata：`contractInstance.interface.encodeFunctionData("function name", [args])`
4. 将编码后的 calldata 作为交易的 data 构建一个 tx 对象，再通过 `provider.call(tx)` 读取数据，`wallet.sendTransaction(tx)` 发起交易。

例如:

```js
import { ethers } from "ethers";
import { Mnemonic, AlchemyKey } from "../private.js"

(async function main() {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${AlchemyKey}`) // 根据节点获取 provider

    const rootNode = ethers.utils.HDNode.fromMnemonic(Mnemonic);
    const secondAccountNode = rootNode.derivePath("m/44'/60'/0'/0/1")
    const wallet = (new ethers.Wallet(secondAccountNode.privateKey)).connect(provider); // 根据助记词获取钱包对象并连接 provider

    // WETH的ABI
    const abiWETH = [
        "function balanceOf(address) public view returns(uint)",
        "function deposit() public payable",
        "function transfer(address, uint) public returns (bool)",
        "function withdraw(uint) public",
    ];

    const addressWEHT = "0x0B1ba0af832d7C05fD64161E0Db78E85978E8082" // goerli 测试网的WETH地址
    const contractWETH = new ethers.Contract(addressWEHT, abiWETH, wallet)

    const address = await wallet.getAddress()
    // 1. 读取WETH合约的链上信息（WETH abi）
    console.log("\n1. 读取WETH余额", address)

    const param1 = contractWETH.interface.encodeFunctionData("balanceOf", [address])
    console.log(`编码结果： ${param1}`)

    const tx1 = {
        to: addressWEHT,
        data: param1
    }
    const balanceWETH = await provider.call(tx1)
    console.log(`余额: ${ethers.utils.formatEther(balanceWETH)}\n`)

    const param2 = contractWETH.interface.encodeFunctionData("deposit")
    console.log(`编码结果： ${param2}`)
    const tx2 = {
        to: addressWEHT,
        data: param2,
        value: ethers.utils.parseEther("0.001")
    }

    const receipt1 = await wallet.sendTransaction(tx2)
    await receipt1.wait()
    console.log(`交易详情：`)
    console.log(receipt1)
    const balanceWETH_deposit = await contractWETH.balanceOf(address)
    console.log(`存款后WETH持仓: ${ethers.utils.formatEther(balanceWETH_deposit)}\n`)
})()
```





















