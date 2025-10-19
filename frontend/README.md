# 🎫 Golden Ticket - 基于 FHE 的隐私保护资产验证 DApp

<div align="center">

**使用全同态加密（FHE）验证资产资格 · 保护财务隐私 · 获取专属权益**

[在线演示](#) | [技术文档](./IMPLEMENTATION_GUIDE.md) | [Zama fhEVM](https://docs.zama.ai/fhevm)

</div>

---

## 📖 项目简介

**Golden Ticket** 是一个创新的去中心化应用（DApp），利用 **Zama fhEVM** 提供的全同态加密（Fully Homomorphic Encryption, FHE）技术，实现了**隐私保护的资产验证**功能。

### 🎯 核心价值

用户可以在**不暴露钱包实际余额**的情况下，证明自己满足活动或服务的资产门槛要求，从而获得：
- 🎉 VIP 活动入场资格
- 🖼️ 私人 NFT 拍卖参与权
- 🏛️ 高端 DAO/社区会员资格
- 🚀 优质项目早期投资机会

### ✨ 技术亮点

- **🔐 真正的隐私保护**：基于 Zama fhEVM，数据在加密状态下进行计算，全程不解密
- **⚡ 零知识验证**：只验证"是否满足门槛"，不暴露具体余额
- **🎨 优雅的用户体验**：自动检测钱包余额，一键完成隐私验证
- **🎫 NFT 作为凭证**：验证通过后自动铸造 Golden Ticket NFT

---

## 🏗️ 技术架构

### 智能合约架构（三合约设计）

```
┌─────────────────────────────────────────────────────────────┐
│                      前端 DApp (Next.js)                     │
│  • 钱包连接 (RainbowKit)                                      │
│  • FHE 加密 (fhevmjs)                                        │
│  • 用户界面                                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           1. EventManager.sol (活动管理)                     │
│  • 创建和管理活动                                              │
│  • 设置资产门槛 (0.001 - 0.1 ETH)                            │
│  • 管理活动有效期                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│      2. GoldenTicketVerification.sol (FHE 验证核心)          │
│  • 接收用户的加密余额                                          │
│  • 使用 FHE 比较：encryptedBalance >= threshold              │
│  • 通过 Oracle 回调触发 NFT 铸造                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         3. GoldenTicketNFT.sol (NFT 凭证)                    │
│  • ERC721 NFT 标准                                           │
│  • 包含二维码的链上 SVG                                       │
│  • 可用于线下验证                                              │
└─────────────────────────────────────────────────────────────┘
```

### FHE 隐私保护流程

```
用户钱包余额: 0.05 ETH (敏感信息)
活动门槛: 0.001 ETH

传统方案 ❌:
用户 → 发送 "0.05 ETH" → 合约验证 → ⚠️ 余额被公开

Golden Ticket ✅:
用户 → FHE 加密 "0.05 ETH" → 合约接收加密数据
     → 加密比较 (0.05 >= 0.001)
     → 返回加密结果 → Oracle 解密
     → 仅公开 "通过验证" → 铸造 NFT

✨ 全程不暴露实际余额！
```

---

## 🚀 快速开始

### 前置要求

- **Node.js** v18+
- **pnpm** 包管理器
- **MetaMask** 浏览器插件
- **Sepolia 测试网 ETH**（从 [水龙头](https://sepoliafaucet.com/) 获取）

### 安装步骤

```bash
# 1. 克隆仓库
git clone <your-repo-url>
cd frontend

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
cd packages/nextjs
pnpm dev
```

### 访问应用

```
首页（Landing Page）: http://localhost:3000
DApp 应用: http://localhost:3000/app
```

---

## 📱 使用流程

### 1️⃣ 浏览活动

<img src="docs/screenshots/events-list.png" alt="活动列表" width="600"/>

- 查看所有可用活动
- 了解各活动的资产门槛要求（如 Bronze: 0.001 ETH）
- 查看活动截止时间

### 2️⃣ 连接钱包

- 点击"Register for Event"
- 使用 MetaMask 连接钱包到 **Sepolia 测试网**
- 应用自动检测您的钱包余额

### 3️⃣ 隐私验证

- 系统自动判断您是否满足门槛
- 点击"Register for Event"发起验证
- 您的余额在前端被 FHE 加密后提交
- **合约仅能判断"是否合格"，无法知道您的实际余额**

### 4️⃣ 获取 NFT

- 验证通过后，Oracle 回调触发 NFT 铸造
- 自动跳转到"My Tickets"页面
- 查看您的 Golden Ticket NFT（包含二维码）

---

## 🔧 部署的智能合约

所有合约均已部署在 **Sepolia 测试网**：

| 合约名称 | 地址 | 说明 |
|---------|------|------|
| **EventManager** | `0x7DE2ff3AEf56CE5a6cF3889Ed0173Bbd7C7a004B` | 活动管理 |
| **GoldenTicketVerification** | `0x4472Be950F6a4c1c3E20D3D7A5c1B63b13a352f1` | FHE 验证逻辑 |
| **GoldenTicketNFT** | `0x56F581a07fFfEA6E8acD5357fDf0beCecB848EB2` | NFT 凭证 |

### 示例活动数据

| 活动名称 | 资产门槛 | Event ID |
|---------|----------|----------|
| Bronze Member Event | 0.001 ETH | 1 |
| Silver Member Event | 0.01 ETH | 2 |
| Gold Member Event | 0.05 ETH | 3 |
| Platinum Member Event | 0.1 ETH | 4 |

---

## 💻 技术栈

### 前端
- **框架**: Next.js 15.2.5 (App Router)
- **样式**: Tailwind CSS
- **钱包连接**: RainbowKit + wagmi v2
- **区块链交互**: viem v2, ethers.js v6
- **FHE 加密**: fhevmjs

### 智能合约
- **开发框架**: Hardhat
- **语言**: Solidity ^0.8.24
- **FHE 库**: @fhevm/solidity
- **标准**: ERC721 (NFT)

### 基础设施
- **区块链**: Ethereum Sepolia Testnet
- **FHE 服务**: Zama Gateway (`gateway.sepolia.zama.ai`)
- **测试网 RPC**: Sepolia 公共节点

---

## 📂 项目结构

```
frontend/
├── packages/
│   └── nextjs/                      # Next.js 前端应用
│       ├── app/
│       │   ├── (landing)/          # 首页
│       │   │   └── page.tsx
│       │   └── app/                # DApp 主应用
│       │       ├── events/         # 活动列表和详情
│       │       ├── my-tickets/     # 我的 NFT
│       │       └── create-event/   # 创建活动
│       ├── components/             # 通用组件
│       │   ├── Header.tsx
│       │   └── Footer.tsx
│       ├── services/
│       │   └── fheService.ts       # FHE 加密服务
│       ├── hooks/
│       │   └── wagmi/              # Wagmi 相关 hooks
│       └── contracts/
│           └── deployedContracts.ts # 合约 ABI 和地址
│
backend/
└── contracts/                       # 智能合约
    ├── EventManager.sol
    ├── GoldenTicketVerification.sol
    └── GoldenTicketNFT.sol
```

---

## 🔬 核心代码示例

### FHE 加密余额（前端）

```typescript
// packages/nextjs/services/fheService.ts
import { createInstance } from "fhevmjs";

export async function encryptBalance(
  balance: number,
  chainId: number,
  contractAddress: string,
  userAddress: string
): Promise<{ ciphertext: `0x${string}`; publicAmount: `0x${string}` }> {
  const instance = await getFhevmInstance(chainId);

  const input = instance.createEncryptedInput(contractAddress, userAddress);
  input.add32(balance); // 添加 32 位整数（milli-ETH 单位）
  const encryptedInput = await input.encrypt();

  return {
    ciphertext: encryptedInput.handles[0] as `0x${string}`,
    publicAmount: encryptedInput.inputProof as `0x${string}`,
  };
}
```

### FHE 验证逻辑（合约）

```solidity
// backend/contracts/GoldenTicketVerification.sol
function verifyAndRequestMint(
    uint256 _eventId,
    externalEuint32 _encryptedBalance,
    bytes calldata inputProof
) public {
    // 1. 验证输入证明，获取加密余额
    euint32 encryptedUserBalance = FHE.fromExternal(_encryptedBalance, inputProof);

    // 2. 将门槛转换为加密值
    euint32 encryptedThreshold = FHE.asEuint32(eventData.assetThreshold);

    // 3. 加密比较（核心隐私保护）
    ebool isQualified = FHE.ge(encryptedUserBalance, encryptedThreshold);

    // 4. 根据加密结果选择接收者
    eaddress selectedRecipient = FHE.select(
        isQualified,
        FHE.asEaddress(msg.sender),
        FHE.asEaddress(address(0))
    );

    // 5. 请求 Oracle 解密并触发回调
    FHE.requestDecryption(...);
}
```

---

## 🎨 UI/UX 特色

- **🌈 现代化设计**：渐变色、毛玻璃效果、流畅动画
- **📱 响应式布局**：完美适配桌面和移动设备
- **✅ 实时反馈**：
  - 自动检测余额
  - 显示是否符合资格
  - 交易状态实时更新
- **🔔 友好提示**：使用 react-hot-toast 显示操作结果

---

## ⚠️ 已知问题

### FHE Gateway 连接问题

**现象**：部分网络环境下无法访问 `gateway.sepolia.zama.ai`

**原因**：
- DNS 解析到测试 IP（198.18.7.97）
- SSL 握手失败
- 可能需要 VPN 或特定网络配置

**临时解决方案**：
- 使用 VPN 连接
- 切换到支持的网络环境
- 联系 Zama 团队获取支持

---

## 🧪 测试（待完善）

### 合约测试（计划中）

```bash
cd backend
npx hardhat test
```

### 前端测试（计划中）

```bash
cd packages/nextjs
pnpm test
```

---

## 🛣️ 未来规划

- [ ] **完善测试**：添加合约单元测试和前端集成测试
- [ ] **Gas 优化**：优化合约 gas 消耗
- [ ] **更多网络**：支持主网和其他 L2 网络
- [ ] **高级功能**：
  - 支持多种资产类型（ERC20、NFT 持有量）
  - 活动组织者仪表板
  - NFT 二次市场集成
- [ ] **移动端**：开发原生移动应用

---

## 📚 参考资源

### 官方文档
- [Zama fhEVM 文档](https://docs.zama.ai/fhevm)
- [fhevmjs SDK](https://docs.zama.ai/fhevm/getting_started/sdk)
- [Zama Developer Program](https://docs.zama.ai/programs/developer-program)

### 社区与支持
- [Zama Discord](https://discord.com/invite/zama)
- [Zama GitHub](https://github.com/zama-ai)

---

## 📄 开源协议

本项目基于 **MIT License** 开源。

---

## 👨‍💻 作者

**im0xmarco**

- Twitter: [@im0xmarco](https://x.com/im0xmarco)
- 为 [Zama Developer Program](https://zama.ai/programs/developer-program) 开发

---

## 🙏 致谢

- **Zama 团队**：提供革命性的 FHE 技术
- **以太坊社区**：提供强大的智能合约基础设施
- **开源贡献者**：使用的各种优秀库和工具

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star！⭐**

Made with ❤️ using Zama fhEVM

</div>
