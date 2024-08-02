import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const contracts = db.prepare(`
      SELECT contracts.*, properties.name AS property_name, tenants.name AS tenant_name
      FROM contracts
      JOIN properties ON contracts.property_id = properties.id
      JOIN tenants ON contracts.tenant_id = tenants.id
    `).all();
        res.status(200).json(contracts);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
