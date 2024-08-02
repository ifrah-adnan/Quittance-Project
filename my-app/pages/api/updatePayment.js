// pages/api/updatePayment.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { id, status, payment_date } = req.body;

        try {
            db.prepare(`
        UPDATE payments
        SET status = ?, payment_date = ?
        WHERE id = ?
      `).run(status, payment_date, id);
            res.status(200).json({ message: 'Payment status updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
