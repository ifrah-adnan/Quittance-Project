// pages/api/addTenant.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const {
            type,
            name,
            ice,
            address,
            representative,
            representative_cin,
            representative_name,
            representative_prenom,
            cin,
        } = req.body;

        try {
            if (type === 'enterprise') {
                db.prepare(`
          INSERT INTO tenants (type, name, ice, address, representative, representative_cin, representative_name, representative_prenom)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(type, name, ice, address, representative, representative_cin, representative_name, representative_prenom);
            } else if (type === 'person') {
                db.prepare(`
          INSERT INTO tenants (type, name, address, cin)
          VALUES (?, ?, ?, ?)
        `).run(type, name, address, cin);
            }
            res.status(200).json({ message: 'Tenant added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
