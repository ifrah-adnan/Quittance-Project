import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { name, address, postal_code, city, land_title } = req.body;
        const stmt = db.prepare('INSERT INTO properties (name, address, postal_code, city, land_title) VALUES (?, ?, ?, ?, ?)');
        stmt.run(name, address, postal_code, city, land_title);
        res.status(200).json({ message: 'Property added' });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
