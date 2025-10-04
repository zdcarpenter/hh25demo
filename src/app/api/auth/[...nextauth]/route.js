import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../../lib/mongodb';
import bcrypt from 'bcrypt';

const providers = [
  CredentialsProvider({
    name: 'Credentials',
    credentials: { email: { label: 'Email', type: 'text' }, password: { label: 'Password', type: 'password' } },
    async authorize(credentials) {
      try {
        if (!clientPromise) {
          throw new Error('Database not configured');
        }
        const client = await clientPromise;
        if (!client) {
          throw new Error('Database unavailable');
        }
        const users = client.db().collection('users');
        const user = await users.findOne({ email: credentials.email });
        if (!user) return null;
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;
        return { id: user._id.toString(), email: user.email, name: user.name };
      } catch (e) {
        console.error('authorize() DB error:', e?.message || e);
        // Throw to surface a generic sign-in error instead of crashing
        throw new Error('SIGNIN_DB_UNAVAILABLE');
      }
    },
  }),
];

const options = {
  providers,
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

// Only attach adapter if we have a Mongo client configured
if (clientPromise) {
  options.adapter = MongoDBAdapter(clientPromise);
}

const handler = NextAuth(options);

export { handler as GET, handler as POST };
