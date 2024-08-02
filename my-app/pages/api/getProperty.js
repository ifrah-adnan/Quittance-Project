// pages/api/getProperty.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;

        try {
            const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(id);
            if (property) {
                res.status(200).json(property);
            } else {
                res.status(404).json({ message: 'Property not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
