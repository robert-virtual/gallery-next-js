import Head from 'next/head'
import { useReducer } from 'react'
import Button from '../components/Buttom'
interface User {
  name: string
  email: string
  password: string
}
interface Action {
  type: keyof User
  payload: User
}

export default function Register() {
  const [body, dispatch] = useReducer(
    (state: User, { type, payload }: Action): User => {
      switch (type) {
        case 'name':
          return { ...state, name: payload.name }
        case 'email':
          return { ...state, email: payload.email }
        case 'password':
          return { ...state, password: payload.password }

        default:
          return state
      }
    },
    {} as User
  )
  function createUser() {
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  return (
    <div>
      <Head>
        <title>Registrar Usuario</title>
      </Head>
      <main className="p-20">
        <input value={body.name} type="text" placeholder="Nombre" />
        <input value={body.email} type="email" placeholder="Correo" />
        <input value={body.password} type="password" placeholder="Clave" />
        <input type="password" placeholder="Confirme clave" />
        <Button onClick={createUser}>Crear</Button>
      </main>
    </div>
  )
}
