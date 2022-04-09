import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getConnection } from '../../../config/db'
import { ncops } from '../../../config/ncops'
import { upload } from '../../../config/upload'

const router = nc<NextApiRequest, NextApiResponse>(ncops)

router.get(async (req, res) => {
  const Image = await getConnection('images')
  let host = req.headers.host

  const images = await Image.find()
    .map((i) => {
      return {
        ...i,
        url: `${host}/uploads/${i.filename}`,
      }
    })
    .toArray()

  res.json(images)
})

router.post(upload.single('image'), async (req, res) => {
  const Image = await getConnection('images')
  const image = await Image.insertOne({
    ...req.body,
    filename: req.file?.filename,
  })
  res.json({ image, body: req.body })
})

export default router
export const config = {
  api: {
    bodyParser: false,
  },
}
