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
  const mongoOptions = {
    // Make server selection fail fast instead of hanging forever
    serverSelectionTimeoutMS: Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || 10000),
  };

  // Allow toggling TLS verification or custom CA for providers like AWS DocDB
  if (process.env.MONGODB_TLS_INSECURE === 'true') {
    mongoOptions.tlsAllowInvalidCertificates = true;
  }
  if (process.env.MONGODB_CA_FILE) {
    mongoOptions.tlsCAFile = process.env.MONGODB_CA_FILE; // e.g. /path/to/rds-combined-ca-bundle.pem
  }
  if (process.env.MONGODB_DIRECT === 'true') {
    mongoOptions.directConnection = true; // helpful for some single-node/self-hosted setups
  }

  const client = new MongoClient(uri, mongoOptions);
  clientPromise = client.connect().catch((err) => {
    // Surface a clearer error in dev; NextAuth will behave if this is undefined
    console.error('MongoDB connection failed:', err?.message || err);
    return undefined;
  });
}

export default clientPromise;
