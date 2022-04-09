import { signOut, signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Button from './Buttom'

export default function Nav() {
  const session = useSession()

  return (
    <nav className="sticky top-0 flex w-full items-center justify-between border-b-2 bg-white p-2">
      <span className="text-xl">
        <Link href="/">Gallery</Link>
      </span>

      <div className="flex items-center gap-2">
        <Link href="/register">Crear Usuario</Link>
        {session.data ? (
          <div>
            <span>{session.data?.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="rounded-md bg-black py-2 px-1 text-white"
            >
              Cerrar Session
            </button>
          </div>
        ) : (
          <Button onClick={() => signIn()}>Iniciar Session</Button>
        )}
      </div>
    </nav>
  )
}
