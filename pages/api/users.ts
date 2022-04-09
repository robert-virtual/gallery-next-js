import { hash } from 'argon2'
import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'
import { getConnection } from '../../config/db'
import { ncops } from '../../config/ncops'
const router = nc<NextApiRequest, NextApiResponse>(ncops)

router.post(async (req, res) => {
  let { password } = req.body
  const User = await getConnection('users')
  password = await hash(password)

  const user = await User.insertOne({ ...req.body, password })
  res.json({ user })
})

export default router
