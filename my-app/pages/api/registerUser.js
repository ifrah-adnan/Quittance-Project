// pages/api/registerUser.js
import bcrypt from 'bcrypt';
import db from '../../database';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password, tenantId } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        try {
            db.prepare(`
        INSERT INTO users (email, password, tenant_id)
        VALUES (?, ?, ?)
      `).run(email, hashedPassword, tenantId);
            res.status(200).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
