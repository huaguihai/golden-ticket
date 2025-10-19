import { NextRequest, NextResponse } from "next/server";

/**
 * FHE Gateway Proxy
 *
 * This proxy helps bypass network restrictions when accessing Zama's FHE Gateway.
 * Instead of the client directly calling gateway.sepolia.zama.ai,
 * it calls this Next.js API route which proxies the request.
 */

const ZAMA_GATEWAY_URL = "https://gateway.sepolia.zama.ai";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path") || "/keyurl";

  try {
    const response = await fetch(`${ZAMA_GATEWAY_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gateway returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[FHE Gateway Proxy] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to reach FHE Gateway",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path") || "";

  try {
    const body = await request.text();

    const response = await fetch(`${ZAMA_GATEWAY_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gateway returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[FHE Gateway Proxy] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to reach FHE Gateway",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
