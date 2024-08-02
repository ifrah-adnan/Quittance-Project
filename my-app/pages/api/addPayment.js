// pages/api/addPayment.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { contract_id, due_date, amount } = req.body;

        try {
            db.prepare(`
        INSERT INTO payments (contract_id, due_date, amount)
        VALUES (?, ?, ?)
      `).run(contract_id, due_date, amount);
            res.status(200).json({ message: 'Payment added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
