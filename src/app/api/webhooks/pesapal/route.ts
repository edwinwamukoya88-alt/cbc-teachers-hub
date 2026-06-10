import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Verify Pesapal IPN signature
    // Forward to Firebase Cloud Function for processing
    // const functions = getFunctions()
    // const processPayment = httpsCallable(functions, 'processPesapalIPN')

    return NextResponse.json({ status: 'received' })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Pesapal webhook endpoint active' })
}
