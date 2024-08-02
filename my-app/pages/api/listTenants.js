import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const tenants = db.prepare('SELECT * FROM tenants').all();
        res.status(200).json(tenants);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
