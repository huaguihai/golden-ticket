import { NextResponse } from "next/server";

/**
 * Environment Variables Check API
 *
 * This endpoint helps verify which environment variables are configured.
 * Used for debugging deployment issues.
 */
export async function GET() {
  const envStatus = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    variables: {
      NEXT_PUBLIC_INFURA_API_KEY: {
        configured: !!process.env.NEXT_PUBLIC_INFURA_API_KEY,
        value: process.env.NEXT_PUBLIC_INFURA_API_KEY
          ? `${process.env.NEXT_PUBLIC_INFURA_API_KEY.substring(0, 8)}...`
          : "not set",
      },
      NEXT_PUBLIC_ALCHEMY_API_KEY: {
        configured: !!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        value: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
          ? `${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY.substring(0, 8)}...`
          : "not set",
      },
      NEXT_PUBLIC_USE_FHE_PROXY: {
        configured: !!process.env.NEXT_PUBLIC_USE_FHE_PROXY,
        value: process.env.NEXT_PUBLIC_USE_FHE_PROXY || "not set (defaults to false)",
      },
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: {
        configured: !!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
        value: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
          ? `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID.substring(0, 8)}...`
          : "not set",
      },
    },
    recommendations: [],
  };

  // Add recommendations based on configuration
  if (!envStatus.variables.NEXT_PUBLIC_INFURA_API_KEY.configured &&
      !envStatus.variables.NEXT_PUBLIC_ALCHEMY_API_KEY.configured) {
    envStatus.recommendations.push(
      "⚠️  No RPC provider configured. Please add NEXT_PUBLIC_INFURA_API_KEY or NEXT_PUBLIC_ALCHEMY_API_KEY for better stability."
    );
  }

  if (envStatus.variables.NEXT_PUBLIC_USE_FHE_PROXY.value === "not set (defaults to false)") {
    envStatus.recommendations.push(
      "ℹ️  FHE Proxy is disabled. If you experience network issues accessing Zama Gateway, set NEXT_PUBLIC_USE_FHE_PROXY=true"
    );
  }

  if (envStatus.variables.NEXT_PUBLIC_INFURA_API_KEY.configured) {
    envStatus.recommendations.push("✅ Infura RPC is configured and ready to use");
  }

  if (envStatus.variables.NEXT_PUBLIC_USE_FHE_PROXY.value === "true") {
    envStatus.recommendations.push("✅ FHE Proxy is enabled - requests will route through /api/fhe-gateway");
  }

  return NextResponse.json(envStatus, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
