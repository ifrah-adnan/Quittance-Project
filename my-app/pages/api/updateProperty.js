// pages/api/updateProperty.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { id, name, address, postal_code, city, land_title } = req.body;

        try {
            db.prepare(`
        UPDATE properties
        SET name = ?, address = ?, postal_code = ?, city = ?, land_title = ?
        WHERE id = ?
      `).run(name, address, postal_code, city, land_title, id);
            res.status(200).json({ message: 'Property updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
