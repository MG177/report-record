import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let cachedConnection: mongoose.Connection | null = null

export async function dbConnect(): Promise<mongoose.Connection> {
  if (cachedConnection) {
    return cachedConnection
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI)
    cachedConnection = connection.connection

    // Handle connection errors
    cachedConnection.on(
      'error',
      console.error.bind(console, 'MongoDB connection error:')
    )

    return cachedConnection
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    throw error
  }
}
