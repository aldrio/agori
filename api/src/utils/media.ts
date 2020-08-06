import Config from 'utils/config'
import AWS from 'aws-sdk'
import { ManagedUpload, PutObjectRequest } from 'aws-sdk/clients/s3'
import logger from './logger'

const s3 = new AWS.S3({
  endpoint: Config.s3.endpoint,
  accessKeyId: Config.s3.accessKey,
  secretAccessKey: Config.s3.secretKey,
})

/**
 * Uploads a buffer and returns it's publicly reachable URL
 *
 * @param key s3 key to upload to
 * @param buffer Buffer to upload
 * @param mime mimetype
 */
export async function uploadBuffer(
  key: string,
  buffer: Buffer,
  mime?: string
): Promise<string> {
  const params: PutObjectRequest = {
    Bucket: Config.s3.bucket,
    Key: key,
    Body: buffer,
    ACL: 'public-read',
    ContentType: mime,
  }

  return await new Promise<string>((resolve, reject) => {
    s3.upload(params, (error: Error, data: ManagedUpload.SendData) => {
      if (error) {
        logger.error({ error }, 'error uploading buffer to s3')
        reject(error)
        return
      }

      logger.debug({ data }, 'uploaded buffer to s3')
      resolve(data.Location)
    })
  })
}
