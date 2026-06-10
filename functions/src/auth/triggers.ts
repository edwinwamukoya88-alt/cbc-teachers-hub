import * as admin from 'firebase-admin'

export const onUserCreate = admin.auth().user().onCreate(async (user) => {
  await admin.firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName ?? '',
    role: 'teacher',
    plan: 'free',
    isActive: true,
    preferences: {
      language: 'en',
      biblicalIntegration: false,
      darkMode: false,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  })
})

export const onUserDelete = admin.auth().user().onDelete(async (user) => {
  await admin.firestore().collection('users').doc(user.uid).delete()
})
