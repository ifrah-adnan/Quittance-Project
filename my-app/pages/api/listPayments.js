import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const payments = db.prepare('SELECT * FROM payments').all();
            res.status(200).json(payments);
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
