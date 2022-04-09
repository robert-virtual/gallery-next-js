import NextAuth from 'next-auth'
import { verify } from 'argon2'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getConnection } from '../../../config/db'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Clave', type: 'password' },
      },
      async authorize(credentials, req) {
        const User = await getConnection('users')
        const user = await User.findOne({
          $where: {
            email: credentials?.email,
          },
        })
        if (!user) {
          return null
        }
        let valid = await verify(user.password, credentials!.password)
        if (!valid) {
          // If you return null then an error will be displayed advising the user to check their details.
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          return null
        }
        // Any object returned will be saved in `user` property of the JWT
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (user) {
        token.id = user.id
        // token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      if (token) {
        session.id = token.id
        // session.accessToken = token.accessToken
      }
      return session
    },
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
})
