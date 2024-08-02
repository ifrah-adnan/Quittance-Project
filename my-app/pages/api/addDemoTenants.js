import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const tenants = [
            { type: 'enterprise', name: 'Enterprise One', ice: 'ICE123456', address: 'Address 1', representative: 'Rep One', representative_cin: 'CIN123', representative_name: 'RepName1', representative_prenom: 'RepPrenom1', cin: '' },
            { type: 'enterprise', name: 'Enterprise Two', ice: 'ICE234567', address: 'Address 2', representative: 'Rep Two', representative_cin: 'CIN234', representative_name: 'RepName2', representative_prenom: 'RepPrenom2', cin: '' },
            { type: 'person', name: 'Person One', ice: '', address: 'Address 3', representative: '', representative_cin: '', representative_name: '', representative_prenom: '', cin: 'CIN345' },
            { type: 'person', name: 'Person Two', ice: '', address: 'Address 4', representative: '', representative_cin: '', representative_name: '', representative_prenom: '', cin: 'CIN456' },
            { type: 'enterprise', name: 'Enterprise Three', ice: 'ICE345678', address: 'Address 5', representative: 'Rep Three', representative_cin: 'CIN567', representative_name: 'RepName3', representative_prenom: 'RepPrenom3', cin: '' },
            { type: 'enterprise', name: 'Enterprise Four', ice: 'ICE456789', address: 'Address 6', representative: 'Rep Four', representative_cin: 'CIN678', representative_name: 'RepName4', representative_prenom: 'RepPrenom4', cin: '' },
            { type: 'person', name: 'Person Three', ice: '', address: 'Address 7', representative: '', representative_cin: '', representative_name: '', representative_prenom: '', cin: 'CIN567' },
            { type: 'person', name: 'Person Four', ice: '', address: 'Address 8', representative: '', representative_cin: '', representative_name: '', representative_prenom: '', cin: 'CIN678' },
            { type: 'enterprise', name: 'Enterprise Five', ice: 'ICE567890', address: 'Address 9', representative: 'Rep Five', representative_cin: 'CIN789', representative_name: 'RepName5', representative_prenom: 'RepPrenom5', cin: '' },
            { type: 'person', name: 'Person Five', ice: '', address: 'Address 10', representative: '', representative_cin: '', representative_name: '', representative_prenom: '', cin: 'CIN789' }
        ];

        tenants.forEach(tenant => {
            const stmt = db.prepare(`
        INSERT INTO tenants (type, name, ice, address, representative, representative_cin, representative_name, representative_prenom, cin) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            stmt.run(tenant.type, tenant.name, tenant.ice, tenant.address, tenant.representative, tenant.representative_cin, tenant.representative_name, tenant.representative_prenom, tenant.cin);
        });

        res.status(200).json({ message: 'Demo tenants added' });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
