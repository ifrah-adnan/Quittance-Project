// pages/api/getContract.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;

        try {
            const contract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(id);
            if (contract) {
                res.status(200).json(contract);
            } else {
                res.status(404).json({ message: 'Contract not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
