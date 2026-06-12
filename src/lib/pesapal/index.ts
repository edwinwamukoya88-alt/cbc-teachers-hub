import crypto from 'crypto'

const BASE_URLS: Record<string, string> = {
  sandbox: 'https://cybqa.pesapal.com/v3',
  production: 'https://pay.pesapal.com/v3',
}

function getBaseUrl(env: string): string {
  return BASE_URLS[env] ?? BASE_URLS.sandbox
}

export interface PesapalOrderParams {
  id: string
  amount: number
  currency: string
  description: string
  callbackUrl: string
  ipnId: string
  customer: {
    email: string
    firstName: string
    lastName: string
    phoneNumber?: string
  }
}

export interface PesapalOrderResult {
  orderTrackingId: string
  redirectUrl: string
}

export async function getAccessToken(env: string): Promise<string> {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET

  if (!consumerKey || !consumerSecret) {
    throw new Error('PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET must be set')
  }

  const res = await fetch(`${getBaseUrl(env)}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ consumer_key: consumerKey, consumer_secret: consumerSecret }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pesapal auth failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.token
}

export async function registerIPNUrl(
  env: string,
  token: string,
  ipnUrl: string,
): Promise<string> {
  const res = await fetch(`${getBaseUrl(env)}/api/URLSetup/RegisterIPN`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: ipnUrl,
      ipn_notification_type: 'GET',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pesapal RegisterIPN failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  return data.ipn_id
}

export async function submitOrderRequest(
  env: string,
  token: string,
  params: PesapalOrderParams,
): Promise<PesapalOrderResult> {
  const body = {
    id: params.id,
    currency: params.currency,
    amount: params.amount,
    description: params.description,
    callback_url: params.callbackUrl,
    notification_id: params.ipnId,
    billing_address: {
      email_address: params.customer.email,
      phone_number: params.customer.phoneNumber ?? '',
      first_name: params.customer.firstName,
      last_name: params.customer.lastName,
    },
  }

  const res = await fetch(`${getBaseUrl(env)}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pesapal SubmitOrderRequest failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  return {
    orderTrackingId: data.order_tracking_id,
    redirectUrl: data.redirect_url,
  }
}

export function verifyIPNSignature(body: string, signature: string): boolean {
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET

  if (!consumerSecret) {
    throw new Error('PESAPAL_CONSUMER_SECRET must be set')
  }

  const hmac = crypto.createHmac('sha256', consumerSecret)
  hmac.update(body, 'utf8')
  const expected = hmac.digest('base64')

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}
