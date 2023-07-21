import express, { type Request, type Response, type NextFunction } from 'express'
import busboy from 'busboy'
import serverless from 'serverless-http'
import sharp from 'sharp'
import cloudinary from 'cloudinary'
import crypto from 'node:crypto'
import path from 'node:path'

const CLOUD_NAME = process.env.CLOUD_NAME
const KEY = process.env.KEY
const SECRET = process.env.SECRET
const FOLDER = process.env.FOLDER

const app = express()

const uploader = async (request: Request, response: Response, next: NextFunction) => {
  const bb = busboy({
    headers: request.headers,
    limits: {
      fileSize: 1024 * 1024 * 8 // 8Mb
    }
  })

  bb.on('file', (name, file, info) => {
    /*     
    const hash = crypto.randomBytes(16).toString('hex')
    const extension = path.extname(info.filename)
    const filename = `${hash}${extension}` */
    const resize = sharp().resize(512, 512).png().toFormat('png')

    resize.on('error', (error) => {
      next(error)
    })

    cloudinary.v2.config({
      cloud_name: CLOUD_NAME,
      api_key: KEY,
      api_secret: SECRET
    })

    const upload = cloudinary.v2.uploader.upload_stream({
      folder: FOLDER,
    }, function(error, result) {
      if (error) {
        next(error)
        return
      }

      console.log(result?.url)
    })

    file.pipe(resize).pipe(upload)
  })

  request.pipe(bb)

  bb.on('finish', () => {
    next()
  })
}

app.post('/avatar/upload', uploader, async (request, response) => {
  return response.json({
    data: []
  })
})

export const handler = serverless(app)