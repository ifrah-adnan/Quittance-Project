import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const properties = db.prepare('SELECT * FROM properties').all();
        res.status(200).json(properties);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
