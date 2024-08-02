// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import db from '../../../database';

const options = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = db.prepare('SELECT * FROM users WHERE email = ?').get(credentials.email);
                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    return { id: user.id, email: user.email, tenantId: user.tenant_id };
                }
                return null;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.tenantId = user.tenantId;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.tenantId = token.tenantId;
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};

export default (req, res) => NextAuth(req, res, options);
