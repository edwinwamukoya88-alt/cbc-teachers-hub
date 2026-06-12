import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getAdminDb } from '@/lib/ai/firestore'
import { verifyIPNSignature } from '@/lib/pesapal'

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-pesapal-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
    }

    const rawBody = await request.text()

    const isValid = verifyIPNSignature(rawBody, signature)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    let notification: Record<string, unknown>
    try {
      notification = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const orderTrackingId = notification.OrderTrackingId as string | undefined
    const orderMerchantReference = notification.OrderMerchantReference as string | undefined
    const paymentStatus = notification.PaymentStatus as string | undefined

    if (!orderTrackingId || !orderMerchantReference || !paymentStatus) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = getAdminDb()
    const subscriptionRef = db.collection('subscriptions').doc(orderMerchantReference)
    const subDoc = await subscriptionRef.get()

    if (!subDoc.exists) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    const subData = subDoc.data()!

    if (subData.pesapalOrderId && subData.pesapalOrderId !== orderTrackingId) {
      return NextResponse.json({ error: 'Order ID mismatch' }, { status: 409 })
    }

    if (subData.status === 'active' && subData.pesapalOrderId === orderTrackingId) {
      return NextResponse.json({ status: 'already_processed' })
    }

    if (paymentStatus === 'COMPLETED') {
      const now = new Date()
      const periodEnd = new Date(now)
      periodEnd.setMonth(periodEnd.getMonth() + 1)

      await subscriptionRef.update({
        status: 'active',
        pesapalOrderId: orderTrackingId,
        currentPeriodStart: FieldValue.serverTimestamp(),
        currentPeriodEnd: new Date(periodEnd),
        updatedAt: FieldValue.serverTimestamp(),
      })

      await db.collection('users').doc(orderMerchantReference).update({
        plan: 'teacher_pro',
        updatedAt: FieldValue.serverTimestamp(),
      })
    } else {
      await subscriptionRef.update({
        status: 'expired',
        pesapalOrderId: orderTrackingId,
        updatedAt: FieldValue.serverTimestamp(),
      })
    }

    return NextResponse.json({ status: 'received' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Pesapal webhook endpoint active' })
}
