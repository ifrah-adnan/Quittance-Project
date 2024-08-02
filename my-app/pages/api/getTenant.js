// pages/api/getTenant.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;

        try {
            const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(id);
            if (tenant) {
                res.status(200).json(tenant);
            } else {
                res.status(404).json({ message: 'Tenant not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
