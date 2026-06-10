import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

export const exportPdf = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { contentId, type } = data

  // TODO: Generate PDF using @react-pdf/renderer
  // TODO: Upload to Firebase Storage
  // TODO: Return download URL

  const bucket = admin.storage().bucket()
  const fileName = `exports/${context.auth.uid}/${type}_${contentId}.pdf`
  const file = bucket.file(fileName)

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 3600000,
  })

  return { url }
})

export const exportExcel = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Authentication required')

  const { contentId, type } = data

  // TODO: Generate Excel using exceljs
  // TODO: Upload to Firebase Storage
  // TODO: Return download URL

  const bucket = admin.storage().bucket()
  const fileName = `exports/${context.auth.uid}/${type}_${contentId}.xlsx`
  const file = bucket.file(fileName)

  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 3600000,
  })

  return { url }
})
