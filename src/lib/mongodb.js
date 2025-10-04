import { MongoClient } from 'mongodb';

// Prefer explicit MONGODB_URI. If only DATABASE_URL exists, use it
// only when it appears to be a MongoDB connection string.
const envMongo = process.env.MONGODB_URI;
const envDb = process.env.DATABASE_URL;

function looksLikeMongoUri(u) {
  if (!u) return false;
  return u.startsWith('mongodb://') || u.startsWith('mongodb+srv://');
}

const uri = envMongo || (looksLikeMongoUri(envDb) ? envDb : '');

let clientPromise;
if (uri) {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
