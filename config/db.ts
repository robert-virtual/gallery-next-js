import { Collection, Db, MongoClient } from 'mongodb'
declare global {
  var _mongoClientPromise: MongoClient
}

const uri: string = process.env.MONGODB_URI || ''
const options = {}

let client
let clientPromise
let db: Db
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}
export async function getConnection(collection: string): Promise<Collection> {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = await client.connect()
    }
    clientPromise = global._mongoClientPromise
    db = clientPromise.db('myFirstDatabase')
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = await client.connect()
    db = clientPromise.db('myFirstDatabase')
  }
  return db.collection(collection)
  // Export a module-scoped MongoClient promise. By doing this in a
  // separate module, the client can be shared across functions.
}
