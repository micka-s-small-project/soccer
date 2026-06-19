import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { captureId } = await request.json();

    // 1. PayPal Access Token 발급 받기 (Client ID와 Secret 필요)
    const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", { // 운영계는 api-m.paypal.com
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const { access_token } = await tokenRes.json();

    const refundRes = await fetch(`https://api-m.sandbox.paypal.com/v2/payments/captures/${captureId}/refund`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}), // 필요시 금액 지정 가능 (비우면 전액 환불)
    });

    if (!refundRes.ok) throw new Error("PayPal Refund API Failed");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}