import { NextResponse } from "next/server";

async function getPaypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secretKey = process.env.PAYPAL_SECRET;

  const auth = Buffer.from(`${clientId}:${secretKey}`).toString("base64");

  const response = await fetch(`https://api-m.paypal.com/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const { country } = await request.json();
    const price = process.env.PRICE || "0.99"; // 환경변수에서 금액 로드

    const accessToken = await getPaypalAccessToken();

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: `AI Stadium Cam - ${country} Edition`,
          amount: {
            currency_code: "USD",
            value: price,
          },
        },
      ],
    };

    const response = await fetch(`https://api-m.paypal.com/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("PayPal API Error Details:", errorData);
      return NextResponse.json(
          { error: "PayPal rejected order creation", detail: errorData },
          { status: response.status } // 500으로 고정하지 않고 페이팔이 준 실제 상태코드(예: 400, 401 등)를 그대로 전달
      );
    }

    const order = await response.json();
    return NextResponse.json({ id: order.id });

  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create order", message: error.message }, { status: 500 });
  }
}