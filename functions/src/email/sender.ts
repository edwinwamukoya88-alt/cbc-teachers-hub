import * as functions from 'firebase-functions'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { to, subject, html } = data

  await resend.emails.send({
    from: 'CBC Teachers Hub <noreply@cbc-teachers-hub.com>',
    to,
    subject,
    html,
  })

  return { success: true }
})
