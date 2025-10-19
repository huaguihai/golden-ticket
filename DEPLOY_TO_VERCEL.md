# 🚀 在 Vercel 上部署 Golden Ticket Demo

本指南将帮助你在 Vercel 上部署 Golden Ticket 的在线演示。

---

## 📋 准备工作

### 1. 前置要求

- ✅ GitHub 账号
- ✅ Vercel 账号（免费）- 访问 https://vercel.com
- ✅ 项目已上传到 GitHub

### 2. 项目结构

Golden Ticket 是一个 monorepo 项目，前端在 `frontend/packages/nextjs` 目录下。

---

## 🎯 方案一：通过 Vercel Dashboard 部署（推荐）

### 步骤 1: 导入项目

1. 访问 https://vercel.com/new
2. 点击 **Import Git Repository**
3. 选择 `golden-ticket` 仓库
4. 点击 **Import**

### 步骤 2: 配置项目

在配置页面设置以下内容：

#### Framework Preset
- 选择：**Next.js**

#### Root Directory
- 点击 **Edit**
- 选择：`frontend/packages/nextjs`
- 这很重要！因为项目是 monorepo 结构

#### Build and Output Settings

```
Build Command: pnpm build
Output Directory: .next
Install Command: pnpm install
```

#### Environment Variables（环境变量）

添加以下环境变量（可选）：

| 变量名 | 值 | 说明 |
|-------|-----|------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | 你的 Alchemy Key | 可选，提升 RPC 稳定性 |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | 你的 WalletConnect ID | 可选，WalletConnect 支持 |

> 💡 **提示**: 这些都是可选的。不填写也可以正常部署，会使用公共 RPC。

### 步骤 3: 部署

1. 点击 **Deploy** 按钮
2. 等待 3-5 分钟（首次部署会比较慢）
3. 部署成功后会获得一个 URL，如：`https://golden-ticket-xxx.vercel.app`

---

## 🛠️ 方案二：使用 Vercel CLI 部署

### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤 2: 登录 Vercel

```bash
vercel login
```

### 步骤 3: 部署

```bash
cd /path/to/golden-ticket/frontend/packages/nextjs

# 首次部署
vercel

# 按照提示选择：
# - Set up and deploy? Yes
# - Which scope? 选择你的账号
# - Link to existing project? No
# - What's your project's name? golden-ticket
# - In which directory is your code located? ./
# - Override settings? No
```

### 步骤 4: 生产环境部署

```bash
vercel --prod
```

---

## ⚙️ Vercel 配置文件

在 `frontend/packages/nextjs/vercel.json` 已经包含基础配置：

```json
{
  "installCommand": "pnpm install",
  "buildCommand": "pnpm build",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 🔧 常见问题

### 问题 1: 构建失败 - "pnpm command not found"

**解决方案**: Vercel 默认支持 pnpm，但如果遇到问题：

1. 在 Vercel Dashboard 中
2. 进入 **Settings** → **General**
3. **Build & Development Settings**
4. Install Command 改为：`npm install -g pnpm && pnpm install`

### 问题 2: 找不到模块错误

**解决方案**: 确保 Root Directory 设置正确为 `frontend/packages/nextjs`

### 问题 3: 环境变量未生效

**解决方案**:
1. 在 Vercel Dashboard 中
2. **Settings** → **Environment Variables**
3. 添加变量后，点击 **Redeploy** 重新部署

### 问题 4: MetaMask 连接问题

这是正常的，因为 MetaMask 需要：
- 切换到 Sepolia 测试网
- 确保有测试 ETH

---

## 📝 部署后检查清单

### ✅ 功能验证

部署成功后，访问你的 Vercel URL 并检查：

- [ ] 首页正常加载
- [ ] 可以点击 "Launch DApp"
- [ ] Events 页面显示 4 个活动
- [ ] 可以连接 MetaMask 钱包
- [ ] 样式正常显示（渐变、动画等）

### ✅ 性能优化

Vercel 会自动优化：
- ✅ 自动 CDN 分发
- ✅ 图片优化
- ✅ 代码压缩
- ✅ 自动 HTTPS

---

## 🌐 自定义域名（可选）

### 添加自定义域名

1. 在 Vercel Dashboard 中
2. 进入你的项目
3. **Settings** → **Domains**
4. 点击 **Add**
5. 输入你的域名（如 `demo.yourdomain.com`）
6. 按照提示配置 DNS

---

## 📊 预期结果

部署成功后，你将获得：

- ✅ **公开访问的 Demo URL**
- ✅ **自动 HTTPS 证书**
- ✅ **全球 CDN 加速**
- ✅ **自动部署**（每次 git push 自动更新）
- ✅ **预览部署**（PR 自动生成预览链接）

---

## 🔄 更新部署

### 自动部署

每次你推送代码到 GitHub：

```bash
git add .
git commit -m "feat: update feature"
git push
```

Vercel 会自动检测并重新部署！

### 手动触发

在 Vercel Dashboard:
1. 进入项目
2. **Deployments**
3. 点击 **Redeploy**

---

## 📸 添加演示截图

部署成功后，在 GitHub README 中更新演示链接：

```markdown
[Live Demo](https://golden-ticket-xxx.vercel.app)
```

---

## 💡 高级配置

### 配置重定向

编辑 `vercel.json`:

```json
{
  "installCommand": "pnpm install",
  "rewrites": [
    {
      "source": "/app/:path*",
      "destination": "/app/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 环境变量示例

```bash
# Alchemy API Key（可选）
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# WalletConnect Project ID（可选）
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# 网络配置（默认 Sepolia）
NEXT_PUBLIC_CHAIN_ID=11155111
```

---

## 🎉 完成！

你的 Golden Ticket Demo 现在已经在线了！

**分享你的 Demo:**
- 在 Twitter 上分享：[@im0xmarco](https://x.com/im0xmarco)
- 提交给 Zama Developer Program
- 添加到你的 GitHub README

---

## 📞 需要帮助？

- Vercel 文档：https://vercel.com/docs
- Vercel Discord：https://vercel.com/discord
- Next.js 文档：https://nextjs.org/docs

---

<div align="center">

**🚀 现在就部署你的 Demo！**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/huaguihai/golden-ticket&project-name=golden-ticket&repository-name=golden-ticket&root-directory=frontend/packages/nextjs)

</div>
