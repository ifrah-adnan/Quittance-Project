// pages/api/updateContract.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { id, property_id, tenant_id, start_date, price } = req.body;

        try {
            db.prepare(`
        UPDATE contracts
        SET property_id = ?, tenant_id = ?, start_date = ?, price = ?
        WHERE id = ?
      `).run(property_id, tenant_id, start_date, price, id);
            res.status(200).json({ message: 'Contract updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
