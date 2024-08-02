import db from '../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const properties = [
            { name: 'Property One', address: 'Property Address 1', postal_code: '10001', city: 'City1', land_title: 'LT123' },
            { name: 'Property Two', address: 'Property Address 2', postal_code: '10002', city: 'City2', land_title: 'LT234' },
            { name: 'Property Three', address: 'Property Address 3', postal_code: '10003', city: 'City3', land_title: 'LT345' },
            { name: 'Property Four', address: 'Property Address 4', postal_code: '10004', city: 'City4', land_title: 'LT456' },
            { name: 'Property Five', address: 'Property Address 5', postal_code: '10005', city: 'City5', land_title: 'LT567' },
            { name: 'Property Six', address: 'Property Address 6', postal_code: '10006', city: 'City6', land_title: 'LT678' },
            { name: 'Property Seven', address: 'Property Address 7', postal_code: '10007', city: 'City7', land_title: 'LT789' },
            { name: 'Property Eight', address: 'Property Address 8', postal_code: '10008', city: 'City8', land_title: 'LT890' },
            { name: 'Property Nine', address: 'Property Address 9', postal_code: '10009', city: 'City9', land_title: 'LT901' },
            { name: 'Property Ten', address: 'Property Address 10', postal_code: '10010', city: 'City10', land_title: 'LT012' },
            { name: 'Property Eleven', address: 'Property Address 11', postal_code: '10011', city: 'City11', land_title: 'LT111' },
            { name: 'Property Twelve', address: 'Property Address 12', postal_code: '10012', city: 'City12', land_title: 'LT222' },
            { name: 'Property Thirteen', address: 'Property Address 13', postal_code: '10013', city: 'City13', land_title: 'LT333' },
            { name: 'Property Fourteen', address: 'Property Address 14', postal_code: '10014', city: 'City14', land_title: 'LT444' },
            { name: 'Property Fifteen', address: 'Property Address 15', postal_code: '10015', city: 'City15', land_title: 'LT555' }
        ];

        properties.forEach(property => {
            const stmt = db.prepare(`
        INSERT INTO properties (name, address, postal_code, city, land_title) 
        VALUES (?, ?, ?, ?, ?)
      `);
            stmt.run(property.name, property.address, property.postal_code, property.city, property.land_title);
        });

        res.status(200).json({ message: 'Demo properties added' });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
