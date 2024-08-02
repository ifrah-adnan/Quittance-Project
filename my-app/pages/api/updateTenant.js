// pages/api/updateTenant.js
import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { id, type, name, ice, address, representative, representative_cin, representative_name, representative_prenom, cin } = req.body;

        try {
            if (type === 'enterprise') {
                db.prepare(`
          UPDATE tenants
          SET type = ?, name = ?, ice = ?, address = ?, representative = ?, representative_cin = ?, representative_name = ?, representative_prenom = ?
          WHERE id = ?
        `).run(type, name, ice, address, representative, representative_cin, representative_name, representative_prenom, id);
            } else if (type === 'person') {
                db.prepare(`
          UPDATE tenants
          SET type = ?, name = ?, address = ?, cin = ?
          WHERE id = ?
        `).run(type, name, address, cin, id);
            }
            res.status(200).json({ message: 'Tenant updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
