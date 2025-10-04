import pkg from 'pg';
const { Pool } = pkg;
import format from 'pg-format';

const pool = new Pool({ connectionString: process.env.DATABASE_URL || null });

async function initialize() {
  // Create users and sessions tables if they don't exist
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      created_at BIGINT NOT NULL
    );
  `);
}

// Ensure tables are ready (best-effort; if no DATABASE_URL, pool will throw when used)
initialize().catch(() => {});

function genId() {
  if (typeof globalThis?.crypto?.randomUUID === 'function') return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random()*100000)}`;
}

export async function createUser({ name, email, password }) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('User already exists');
  const id = genId();
  await pool.query(
    'INSERT INTO users(id, name, email, password) VALUES($1,$2,$3,$4)',
    [id, name || '', email, password]
  );
  return { id, name: name || '', email, password };
}

export async function findUserByEmail(email) {
  const res = await pool.query('SELECT id, name, email, password FROM users WHERE email=$1', [email]);
  return res.rows[0] || null;
}

export async function createSession(userId) {
  const sid = genId();
  await pool.query('INSERT INTO sessions(sid, user_id, created_at) VALUES($1,$2,$3)', [sid, userId, Date.now()]);
  return sid;
}

export async function getUserBySession(sid) {
  const res = await pool.query(
    'SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.sid=$1',
    [sid]
  );
  return res.rows[0] || null;
}

export async function deleteSession(sid) {
  await pool.query('DELETE FROM sessions WHERE sid=$1', [sid]);
  return true;
}

