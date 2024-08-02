// pages/api/listProperties.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const properties = db.prepare('SELECT * FROM properties').all();
            res.status(200).json(properties);
        } catch (error) {
            console.error('Error fetching properties:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
