import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { FieldValue } from 'firebase-admin/firestore'

export const onUserCreate = functions.auth.user().onCreate(async (user: any) => {
  const docRef = admin.firestore().collection('users').doc(user.uid)
  const snapshot = await docRef.get()

  if (snapshot.exists) {
    // Doc was already created client-side — only set fields that must exist
    await docRef.set({
      email: user.email,
      displayName: user.displayName ?? snapshot.data()?.displayName ?? '',
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
    return
  }

  await docRef.set({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? '',
    role: 'teacher',
    accountType: 'independent_teacher',
    plan: 'free',
    isActive: true,
    preferences: {
      language: 'en',
      biblicalIntegration: false,
      darkMode: false,
    },
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })
})

export const onUserDelete = functions.auth.user().onDelete(async (user: any) => {
  await admin.firestore().collection('users').doc(user.uid).delete()
})
