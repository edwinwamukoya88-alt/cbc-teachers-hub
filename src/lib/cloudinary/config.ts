const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export const getCloudinaryUrl = (publicId: string, options?: { width?: number; height?: number }) => {
  if (!cloudName) return ''
  const transformations = options ? `c_fill,w_${options.width ?? 300},h_${options.height ?? 300}` : ''
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`
}

export { cloudName }
