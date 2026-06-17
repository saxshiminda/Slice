/**
 * Payment gateway abstraction — BoG iPay v2 (hosted checkout).
 *
 * When BOG_CLIENT_ID is absent the module runs in mock mode: it returns a
 * local callback URL so the full checkout flow can be tested without real
 * credentials. Set BOG_MOCK_PAYMENT=false to disable the mock even if
 * credentials are provided (useful for staging verification).
 */

import { env } from '../../config/env.js';

const BOG_AUTH_URL = 'https://account.bog.ge/auth/realms/bog/protocol/openid-connect/token';
const BOG_ORDERS_URL = 'https://api.bog.ge/payments/v1/ecommerce/orders';
const BOG_ORDER_STATUS_URL = 'https://api.bog.ge/payments/v1/ecommerce/orders';

export interface CreatePaymentResult {
  paymentId: string;
  redirectUrl: string;
}

export interface PaymentStatus {
  paymentId: string;
  paid: boolean;
  status: string;
}

function isMockMode(): boolean {
  return !env.bogClientId || env.bogMockPayment;
}

async function getBogAccessToken(): Promise<string> {
  const res = await fetch(BOG_AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.bogClientId!,
      client_secret: env.bogClientSecret!,
    }),
  });
  if (!res.ok) {
    throw new Error(`BoG auth failed: ${res.status}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

export async function createPayment(params: {
  orderId: string;
  totalGel: number;
  description: string;
}): Promise<CreatePaymentResult> {
  if (isMockMode()) {
    // In mock mode redirect straight to our own callback so the dev flow works end-to-end.
    const serverBaseUrl = env.clientUrl.replace('5173', '3001').replace(':5173', ':3001');
    const callbackBase = `${serverBaseUrl}/api/shop/callback`;
    return {
      paymentId: `mock_${Date.now()}`,
      redirectUrl: `${callbackBase}?orderId=${params.orderId}&status=success&mock=1`,
    };
  }

  const token = await getBogAccessToken();
  const callbackBase = `${env.clientUrl}/api/shop/callback`;

  const body = {
    callback_url: `${env.clientUrl.replace('5173', '3001')}/api/payments/webhook`,
    external_order_id: params.orderId,
    purchase_units: {
      currency: 'GEL',
      total_amount: params.totalGel,
      basket: [
        {
          product_id: params.orderId,
          description: params.description,
          quantity: 1,
          unit_price: params.totalGel,
        },
      ],
    },
    redirect_urls: {
      success: `${callbackBase}?orderId=${params.orderId}&status=success`,
      fail: `${callbackBase}?orderId=${params.orderId}&status=fail`,
    },
  };

  const res = await fetch(BOG_ORDERS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`BoG order creation failed: ${err}`);
  }

  const data = (await res.json()) as {
    id: string;
    _links?: { redirect?: { href?: string } };
  };

  return {
    paymentId: data.id,
    redirectUrl: data._links?.redirect?.href ?? '',
  };
}

export async function verifyPayment(paymentId: string): Promise<PaymentStatus> {
  if (isMockMode() || paymentId.startsWith('mock_')) {
    return { paymentId, paid: true, status: 'SUCCESS' };
  }

  const token = await getBogAccessToken();
  const res = await fetch(`${BOG_ORDER_STATUS_URL}/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return { paymentId, paid: false, status: 'UNKNOWN' };
  }

  const data = (await res.json()) as { id: string; order_status?: { key?: string } };
  const status = data.order_status?.key ?? 'UNKNOWN';
  return { paymentId, paid: status === 'completed', status };
}
