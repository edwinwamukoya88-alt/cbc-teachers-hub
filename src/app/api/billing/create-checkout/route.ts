import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/ai/firestore'
import { verifyAuthToken } from '@/lib/ai/auth'
import { getAccessToken, submitOrderRequest } from '@/lib/pesapal'

const PRO_PLAN_PRICE = 499
const PESAPAL_ENV = process.env.PESAPAL_ENVIRONMENT ?? 'sandbox'
const IPN_ID = process.env.PESAPAL_IPN_ID ?? ''

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BASE_URL
  if (!url) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not set. Set it to your production URL (e.g. https://cbc-teachers-hub.vercel.app).')
  }
  return url
}

export async function POST(request: Request) {
  try {
    const { plan } = await request.json()

    if (plan !== 'teacher_pro') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const authHeader = request.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    let uid: string
    try {
      const decoded = await verifyAuthToken(token)
      uid = decoded.uid
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const db = getAdminDb()

    const userDoc = await db.collection('users').doc(uid).get()
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    const userData = userDoc.data()!

    const existingSub = await db.collection('subscriptions').doc(uid).get()
    if (existingSub.exists) {
      const subData = existingSub.data()!
      if (subData.status === 'active' || subData.status === 'grace_period') {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
      }
    }

    const subscriptionRef = db.collection('subscriptions').doc(uid)
    await subscriptionRef.set({
      userId: uid,
      entityType: 'user',
      plan: 'teacher_pro',
      status: 'pending',
      amount: PRO_PLAN_PRICE,
      currency: 'KES',
      paymentMethod: 'mpesa',
      pesapalOrderId: '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    })

    const pesapalToken = await getAccessToken(PESAPAL_ENV)

    const orderResult = await submitOrderRequest(PESAPAL_ENV, pesapalToken, {
      id: uid,
      amount: PRO_PLAN_PRICE,
      currency: 'KES',
      description: 'CBC Teachers Hub - Teacher Pro Subscription',
      callbackUrl: `${getBaseUrl()}/teacher/subscription?success=1`,
      ipnId: IPN_ID,
      customer: {
        email: userData.email ?? '',
        firstName: userData.displayName ?? '',
        lastName: '',
        phoneNumber: userData.phone ?? undefined,
      },
    })

    await subscriptionRef.update({
      pesapalOrderId: orderResult.orderTrackingId,
      updatedAt: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({
      redirectUrl: orderResult.redirectUrl,
      orderTrackingId: orderResult.orderTrackingId,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
