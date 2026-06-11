import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { getStorageInstance } from './config'

export const uploadFile = async (path: string, file: File) => {
  const storageRef = ref(getStorageInstance(), path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export const getFileUrl = async (path: string) => {
  const storageRef = ref(getStorageInstance(), path)
  return getDownloadURL(storageRef)
}

export const deleteFile = async (path: string) => {
  const storageRef = ref(getStorageInstance(), path)
  await deleteObject(storageRef)
}

export { ref }
