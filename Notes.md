## Provider

- `Provider`类是对以太坊网络连接的抽象，为标准以太坊节点功能提供简洁、一致的接口。在`ethers`中，`Provider`不接触用户私钥，只能读取链上信息，不能写入，这一点比`web3.js`要安全。

- 如何获得 provider：
  - 使用 ethers 内置的公用 rpc ，也就是 `ethers.getDefaultProvider();`
  - 使用 MetaMask 连接（需要浏览器环境）

















































## BigNumber 和单位转换

- 转换：可以利用`ethers.BigNumber.from()`函数将`string`，`number`，`BigNumber`等类型转换为`BigNumber`。(超过js最大安全整数的数值将不能转换。)
- 运算：`BigNumber`支持很多运算，例如加减乘除、取模`mod`，幂运算`pow`，绝对值`abs`等运算。
- 单位转换（`1 ether`等于`10^18 wei`，一般用户可读的字符串以 ether 为单位，机器可读以 wei 为单位）
  - `formatUnits(变量, 单位)`：格式化，小单位转大单位，比如 `wei` -> `ether`，在显示余额时很有用。参数中，单位填位数（数字）或指定的单位（字符串）。
  - `parseUnits`：解析，大单位转小单位，比如`ether` -> `wei`，在将用户输入的值转为`wei`为单位的数值很有用。









