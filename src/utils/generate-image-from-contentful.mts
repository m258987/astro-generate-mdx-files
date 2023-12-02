type ImageType = {
  url: string
  details: {
    size: number
    image: {
      width: number
      height: number
    }
  }
  fileName: string
  contentType: string
}

export default function generateImageFromContentful(
  image: ImageType,
  format: 'webp' | 'original' = 'webp'
) {
  return JSON.stringify({
    src: `https:${image.url}${format == 'webp' ? '?fm=webp' : ''}`,
    width: image.details.image.width,
    height: image.details.image.height,
    alt: image.fileName,
    format: image.contentType?.split('/')[1],
  })
}
