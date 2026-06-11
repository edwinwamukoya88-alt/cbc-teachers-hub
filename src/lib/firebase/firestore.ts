import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  serverTimestamp,
  type QueryConstraint,
} from 'firebase/firestore'
import { getFirestoreInstance } from './config'

export {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  serverTimestamp,
}

export type { QueryConstraint }

export { getFirestoreInstance }
