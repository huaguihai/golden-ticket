import { NextRequest, NextResponse } from "next/server";

/**
 * FHE Gateway Proxy (supports arbitrary paths)
 *
 * This API route proxies requests from the frontend to Zama's Sepolia gateway.
 * It allows the frontend to use `/api/fhe-gateway` as the base URL while
 * still reaching nested resources such as `/key`, `/token`, etc.
 */

const ZAMA_GATEWAY_URL = "https://gateway.sepolia.zama.ai";

function buildGatewayUrl(request: NextRequest, pathSegments?: string[]): string {
  const path = pathSegments && pathSegments.length > 0 ? `/${pathSegments.join("/")}` : "";
  const query = request.nextUrl.search; // includes leading "?" if present
  return `${ZAMA_GATEWAY_URL}${path}${query}`;
}

export async function GET(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const targetUrl = buildGatewayUrl(request, params.path);

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Gateway returned ${response.status}` },
        { status: response.status }
      );
    }

    const body = await response.text();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[FHE Gateway Proxy] GET error:", error);
    return NextResponse.json(
      {
        error: "Failed to reach FHE Gateway",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { path?: string[] } }) {
  const targetUrl = buildGatewayUrl(request, params.path);

  try {
    const body = await request.text();

    const response = await fetch(targetUrl, {
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
    console.error("[FHE Gateway Proxy] POST error:", error);
    return NextResponse.json(
      {
        error: "Failed to reach FHE Gateway",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
