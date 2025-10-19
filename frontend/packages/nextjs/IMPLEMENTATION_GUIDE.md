# 正确的 FHE 加密实现指南

根据官方 fhevm-react-template 的最佳实践，以下是正确实现 FHE 加密的步骤：

## 关键发现

1. **不要直接使用 `fhevmjs`** - 应该使用 `@fhevm-sdk` 提供的 React hooks
2. **需要 `ethersSigner`** - fhevmjs 需要 ethers.js signer，不能直接使用 wagmi 的 publicClient
3. **使用 `useWalletClient`** - wagmi 的 `useWalletClient` 可以转换为 ethers provider

## 实现步骤

### 1. 在页面组件中设置 FHEVM instance

```typescript
import { useMemo } from "react";
import { useFhevm, useFHEEncryption } from "@fhevm-sdk";
import { useAccount } from "wagmi";
import { useWagmiEthers } from "~~/hooks/wagmi/useWagmiEthers";

// 在组件中
const { chain } = useAccount();
const chainId = chain?.id;

// 创建 provider (直接使用 window.ethereum)
const provider = useMemo(() => {
  if (typeof window === "undefined") return undefined;
  return (window as any).ethereum;
}, []);

// 创建 FHEVM instance
const {
  instance: fhevmInstance,
  status: fhevmStatus,
  error: fhevmError,
} = useFhevm({
  provider,
  chainId,
  enabled: true,
});
```

### 2. 获取 Ethers Signer

```typescript
// 使用 useWagmiEthers hook 获取 ethers signer
const { ethersSigner } = useWagmiEthers();
```

### 3. 使用 useFHEEncryption 进行加密

```typescript
const { canEncrypt, encryptWith } = useFHEEncryption({
  instance: fhevmInstance,
  ethersSigner,
  contractAddress: verificationContract?.address as `0x${string}`,
});

// 在需要加密时调用
const handleVerify = async () => {
  if (!canEncrypt) {
    toast.error("Cannot encrypt - FHEVM instance or signer not ready");
    return;
  }

  // 加密余额
  const encResult = await encryptWith((builder) => {
    builder.add32(balanceInMilliEth); // 添加 uint32 值
  });

  if (!encResult) {
    toast.error("Encryption failed");
    return;
  }

  // 调用合约
  writeContract({
    address: verificationContract.address as `0x${string}`,
    abi: verificationContract.abi,
    functionName: "verifyAndRequestMint",
    args: [BigInt(eventId), encResult.handles[0], encResult.inputProof],
  });
};
```

## 完整示例参考

参见官方示例：
- `/Users/guihaihua/lumao/ZAMA/1014/fhevm-react-template/packages/nextjs/app/_components/FHECounterDemo.tsx`
- `/Users/guihaihua/lumao/ZAMA/1014/fhevm-react-template/packages/nextjs/hooks/fhecounter-example/useFHECounterWagmi.tsx`

## 为什么之前的方法失败了

1. **错误的 provider 类型**：`publicClient` (viem) 不兼容，fhevmjs 需要 EIP-1193 provider
2. **缺少 signer**：useFHEEncryption 需要 ethers signer 来获取用户地址
3. **Gateway URL 格式**：需要确保没有尾部斜杠

## 下一步

更新 `/app/app/events/[eventId]/page.tsx` 使用以上正确的方法。
