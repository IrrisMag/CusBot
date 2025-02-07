import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

let cached = global.mongoose || { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'bot',
        bufferCommands: false, // Ensures queries don’t execute before connection
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongooseInstance) => {
        console.log('✅ Connected to MongoDB');
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
