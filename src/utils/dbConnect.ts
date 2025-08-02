import mongoose from 'mongoose'

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/report-record'

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

let cachedConnection: mongoose.Connection | null = null

export async function dbConnect(): Promise<mongoose.Connection> {
  try {
    console.log('dbConnect called') // Debug log
    console.log('MongoDB URI:', MONGODB_URI ? 'Set' : 'Not set') // Debug log

    if (cachedConnection) {
      console.log('Using cached connection') // Debug log
      return cachedConnection
    }

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined')
    }

    console.log('Connecting to MongoDB...') // Debug log
    const connection = await mongoose.connect(MONGODB_URI)
    cachedConnection = connection.connection
    console.log('MongoDB connected successfully') // Debug log

    // Handle connection errors
    cachedConnection.on('error', (error) => {
      console.error('MongoDB connection error:', error)
      cachedConnection = null // Reset cache on error
    })

    cachedConnection.on('disconnected', () => {
      console.log('MongoDB disconnected')
      cachedConnection = null // Reset cache on disconnect
    })

    return cachedConnection
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    cachedConnection = null // Reset cache on error
    throw error
  }
}
