# 🎫 Golden Ticket - 基于 FHE 的隐私保护资产验证 DApp

<div align="center">

![Golden Ticket Banner](https://img.shields.io/badge/Powered%20by-Zama%20fhEVM-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-purple)

**使用全同态加密（FHE）验证资产资格 · 保护财务隐私 · 获取专属权益**

---

### 📖 其他语言版本

[![English](https://img.shields.io/badge/English-Click-blue?style=for-the-badge)](./README.md)
[![中文](https://img.shields.io/badge/中文-点击-red?style=for-the-badge)](./README.zh.md)
[![Français](https://img.shields.io/badge/Français-Cliquez-blue?style=for-the-badge)](./README.fr.md)

---

[在线演示](#) | [技术文档](./frontend/README.md) | [智能合约](./backend/contracts)

</div>

---

## 📖 项目简介

**Golden Ticket** 是一个创新的去中心化应用（DApp），利用 **Zama fhEVM**（全同态加密虚拟机）提供的全同态加密（Fully Homomorphic Encryption, FHE）技术，实现了**隐私保护的资产验证**功能。

### 🎯 解决的问题

传统的区块链应用要求用户公开钱包余额来证明自己符合活动、服务或社区的资格要求。这对高净值人士造成了隐私顾虑。

### ✨ 我们的解决方案

Golden Ticket 允许用户使用全同态加密（FHE）**在不暴露实际余额的情况下证明自己满足资产要求**。智能合约只能知道用户是否符合资格，永远无法获知具体金额。

### 💡 应用场景

- 🎉 **VIP 活动**：验证独家会议和派对的参与资格
- 🖼️ **私人拍卖**：访问高价值 NFT 和资产拍卖
- 🏛️ **DAO 会员**：加入需要资产门槛的私人社区
- 🚀 **早期投资**：获得优质项目的优先投资机会

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                      前端 DApp (Next.js)                     │
│  • 钱包连接 (RainbowKit)                                      │
│  • FHE 加密 (fhevmjs)                                        │
│  • 用户界面                                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┬───────────────┐
        ▼                         ▼               ▼
┌──────────────┐       ┌──────────────────┐   ┌──────────┐
│ EventManager │       │ Verification     │   │ NFT      │
│ 活动管理      │◄──────┤ FHE 验证逻辑    │──►│ NFT 凭证 │
│ • 创建        │       │ • 加密          │   │ • 铸造   │
│ • 管理        │       │ • 验证          │   │ • 二维码 │
└──────────────┘       └──────────────────┘   └──────────┘
```

### 智能合约（Sepolia 测试网）

| 合约名称 | 地址 | 用途 |
|---------|------|------|
| **EventManager** | `0x7DE2ff3AEf56CE5a6cF3889Ed0173Bbd7C7a004B` | 管理活动和门槛 |
| **GoldenTicketVerification** | `0x4472Be950F6a4c1c3E20D3D7A5c1B63b13a352f1` | FHE 验证逻辑 |
| **GoldenTicketNFT** | `0x56F581a07fFfEA6E8acD5357fDf0beCecB848EB2` | 带二维码的 NFT 门票 |

---

## 🚀 一键部署到 Vercel

一键部署你自己的 Golden Ticket 实例：

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/huaguihai/golden-ticket&project-name=golden-ticket&repository-name=golden-ticket&root-directory=frontend/packages/nextjs)

**5 分钟内快速部署！无需配置。**

</div>

> 💡 **提示**：应用将使用公共 RPC 端点。生产环境使用时，建议在 Vercel 环境变量中添加你自己的 RPC 提供商密钥。

详细部署说明请查看 [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md)。

---

## 🚀 快速开始

### 前置要求

- Node.js v18+
- pnpm 包管理器
- MetaMask 钱包
- Sepolia 测试网 ETH（[从水龙头获取](https://sepoliafaucet.com/)）

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/huaguihai/golden-ticket.git
cd golden-ticket

# 安装前端依赖
cd frontend
pnpm install

# 启动开发服务器
cd packages/nextjs
pnpm dev
```

访问 `http://localhost:3000` 查看应用！

### 后端设置（可选 - 用于合约开发）

```bash
cd backend
npm install

# 运行测试
npx hardhat test

# 部署到 Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 📂 项目结构

```
golden-ticket/
├── frontend/              # Next.js 前端应用
│   ├── packages/nextjs/
│   │   ├── app/          # 应用路由
│   │   ├── components/   # React 组件
│   │   ├── services/     # FHE 加密服务
│   │   └── contracts/    # 合约 ABI
│   └── README.md         # 详细的前端文档
│
├── backend/              # 智能合约
│   ├── contracts/
│   │   ├── EventManager.sol
│   │   ├── GoldenTicketVerification.sol
│   │   └── GoldenTicketNFT.sol
│   ├── test/            # 合约测试
│   └── scripts/         # 部署脚本
│
├── .gitignore
├── LICENSE
└── README.md            # 本文件
```

---

## 💻 技术栈

### 前端
- **框架**: Next.js 15.2.5
- **样式**: Tailwind CSS
- **Web3**: RainbowKit, wagmi v2, viem, ethers.js
- **FHE**: fhevmjs

### 智能合约
- **语言**: Solidity ^0.8.24
- **框架**: Hardhat
- **FHE 库**: @fhevm/solidity
- **标准**: ERC721

### 基础设施
- **区块链**: Ethereum Sepolia 测试网
- **FHE 服务**: Zama Gateway
- **隐私技术**: 全同态加密

---

## 🔐 工作原理

### 传统方案 ❌
```
用户发送实际余额 (0.05 ETH) → 合约看到 0.05 ETH
⚠️ 隐私泄露 - 余额在链上公开
```

### Golden Ticket 方案 ✅
```
用户加密余额 → 合约接收加密数据
→ FHE 比较 (加密值 >= 门槛)
→ 预言机解密结果 → 仅返回"符合资格"或"不符合资格"
✨ 隐私保护 - 实际余额永不泄露
```

---

## 🧪 测试

```bash
# 运行智能合约测试
cd backend
npx hardhat test

# 预期输出：所有测试通过 ✓
```

---

## 🌟 特性

- ✅ **隐私优先**：FHE 确保您的余额保持加密状态
- ✅ **自动检测**：自动检测钱包余额
- ✅ **NFT 门票**：获得带二维码的链上 NFT 证明
- ✅ **精美界面**：现代化、响应式设计
- ✅ **多活动支持**：支持不同门槛的多个活动

---

## 🛣️ 路线图

- [ ] 主网部署
- [ ] 支持 ERC20 代币
- [ ] 移动应用
- [ ] 活动组织者仪表板
- [ ] NFT 市场集成
- [ ] 多链支持

---

## 📚 文档

- [前端文档](./frontend/README.md) - 详细的前端设置和使用说明
- [智能合约测试](./backend/test/GoldenTicket.test.ts) - 测试套件
- [Zama fhEVM 文档](https://docs.zama.ai/fhevm) - 官方 FHE 文档

---

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m '添加某些很棒的功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解更多详情。

---

## 📄 开源协议

本项目基于 MIT License 开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 👨‍💻 作者

**im0xmarco**

- Twitter: [@im0xmarco](https://x.com/im0xmarco)
- 为 [Zama Developer Program](https://zama.ai/programs/developer-program) 开发

---

## 🙏 致谢

- **Zama 团队** - 提供革命性的 FHE 技术
- **以太坊社区** - 提供强大的智能合约基础设施
- **开源贡献者** - 提供出色的工具和库

---

## ⚠️ 免责声明

本项目目前部署在 Sepolia 测试网，仅供演示和教育目的。在主网部署前请务必审计智能合约。

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给个 Star！⭐**

Made with ❤️ using Zama fhEVM

</div>
