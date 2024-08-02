// pages/api/addContract.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { property_id, tenant_id, start_date, price } = req.body;

        try {
            db.prepare(`
        INSERT INTO contracts (property_id, tenant_id, start_date, price)
        VALUES (?, ?, ?, ?)
      `).run(property_id, tenant_id, start_date, price);
            res.status(200).json({ message: 'Contract added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
