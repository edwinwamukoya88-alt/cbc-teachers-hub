import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const PESAPAL_ENV = process.env.PESAPAL_ENVIRONMENT ?? 'sandbox'
const PESAPAL_BASE = PESAPAL_ENV === 'production'
  ? 'https://pay.pesapal.com/v3'
  : 'https://cybqa.pesapal.com/v3'

export const createPesapalOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { plan, amount } = data

  // TODO: Implement actual Pesapal API integration
  // 1. Get access token
  // 2. Create order
  // 3. Register IPN
  // 4. Return redirect URL

  return {
    orderId: 'mock-order-id',
    redirectUrl: `${PESAPAL_BASE}/api/Transactions/SubmitOrder`,
  }
})

export const checkPesapalPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { orderId } = data

  // TODO: Query Pesapal for payment status

  return {
    status: 'completed',
  }
})

export const processPesapalIPN = functions.https.onRequest(async (req, res) => {
  // Verify IPN signature
  // Process payment notification
  // Update subscription in Firestore

  const db = admin.firestore()
  const { OrderNotification } = req.body

  if (OrderNotification) {
    const { OrderTrackingId, OrderMerchantReference, PaymentStatus } = OrderNotification

    if (PaymentStatus === 'COMPLETED') {
      await db.collection('subscriptions').doc(OrderMerchantReference).update({
        status: 'active',
        pesapalOrderId: OrderTrackingId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    }
  }

  res.status(200).json({ status: 'received' })
})
