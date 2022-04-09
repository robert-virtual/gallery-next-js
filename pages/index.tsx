import { NextPage } from 'next'

import Head from 'next/head'
import { useRouter } from 'next/router'
import { DragEventHandler, useEffect, useState } from 'react'

interface Props {
  images: any[]
}

const Home: NextPage<Props> = ({ images }) => {
  const [error, setError] = useState<string | undefined>()
  const [title, setTitle] = useState<string | undefined>()
  const [image, setImage] = useState<File | null>()
  const [dragging, setDragging] = useState(false)
  const [time, setTime] = useState<NodeJS.Timeout>()
  useEffect(() => {
    setTime(
      setTimeout(() => {
        setError(undefined)
      }, 5000)
    )

    return () => {
      clearTimeout(time!)
    }
  }, [error])
  const router = useRouter()

  async function upload() {
    if (!title || !image) {
      setError('Falta informacion necesaria')
      return
    }
    const body = new FormData()
    body.append('image', image!, image?.name)
    body.append('title', title)
    const res = await fetch('/api/images', {
      method: 'post',
      body,
    })
    console.log(await res.json())
    router.replace(router.asPath)
    setImage(null)
    setTitle(undefined)
  }
  const drop: DragEventHandler<HTMLElement> = (e) => {
    let { dataTransfer } = e
    e.preventDefault()
    setDragging(!dragging)
    console.log(dataTransfer)
    setImage(dataTransfer.files.item(0))
  }

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        {error && (
          <p className="fixed top-0 w-screen bg-red-400 text-red-900">
            {error}
          </p>
        )}
        <h1 className="text-6xl font-bold">
          Welcome to <p className="text-blue-600">Gallery</p>
        </h1>
        <input
          type="text"
          placeholder="title"
          className="mt-4 rounded-md border-2 border-solid border-gray-400 p-2"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <div className="m-4">
          {image ? (
            <img src={URL.createObjectURL(image)} alt="" className="w-72" />
          ) : (
            <article
              onDragLeave={(e) => {
                e.preventDefault()
                setDragging(false)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDrop={drop}
              className={
                'm-2 h-72 w-72 border-4 border-dashed border-gray-500 ' +
                (dragging ? 'animate-pulse border-blue-500' : '')
              }
            ></article>
          )}
        </div>

        <button onClick={upload} className=" bg-blue-600 px-4 py-2 text-white ">
          Subir
        </button>
        {images && (
          <div
            className="m-4 grid w-full items-start"
            style={{
              gridTemplateColumns: 'repeat(auto-fit,minmax(288px,1fr))',
              gap: '1rem',
            }}
          >
            {images.map((i) => (
              <div key={i._id} className="bg-gray-100 p-2 ">
                <img className="m-auto w-full" src={'http://' + i.url} alt="" />
                <p>{i.title}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t"></footer>
    </div>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/images')
  const images = await res.json()
  return {
    props: { images },
  }
}
export default Home
