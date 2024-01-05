import { Injectable } from '@nestjs/common'
import { UploadFileDTO, UploadFileRes } from 'src/dtos/upload-file.dto'
import { v2 as cloudinary } from 'cloudinary'

@Injectable()
export class UploadedFilesService {
  constructor() {}

  async uploadToCloudinary(uploadFileDTO: UploadFileDTO): Promise<UploadFileRes> {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    })
    const { base64, name, type } = uploadFileDTO
    // const a = await sharp(base64).toBuffer()
    const formattedName = name.replace(' ', '_').split('.')[0]
    let resourceType: 'image' | 'video' | 'auto' | 'raw' = 'raw'
    let subPath = ''
    if (type.includes('image')) {
      subPath = 'images'
      resourceType = 'image'
    } else if (type.includes('audio')) {
      subPath = 'audio'
      resourceType = 'video'
    } else if (type.includes('video')) {
      subPath = 'videos'
      resourceType = 'video'
    } else {
      subPath = 'others'
      resourceType = 'raw'
    }
    try {
      const responseUpload = await cloudinary.uploader.upload(base64, { public_id: formattedName, folder: subPath, resource_type: resourceType })
      return {
        public_id: responseUpload.public_id,
        secure_url: responseUpload.secure_url,
        created_at: responseUpload.created_at,
        format: responseUpload.format,
        original_filename: responseUpload.original_filename,
        height: responseUpload.height,
        width: responseUpload.width,
        resource_type: responseUpload.resource_type,
      }
    } catch (error) {
      return null
    }
  }
}
