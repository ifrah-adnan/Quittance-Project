import db from '../../database';
import jsPDF from 'jspdf';

export default async function handler(req, res) {
    const { propertyId, tenantId } = req.query;

    const property = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId);
    const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(tenantId);

    if (!property || !tenant) {
        return res.status(404).json({ message: 'Property or Tenant not found' });
    }

    const doc = new jsPDF();

    doc.text('Q U I T T A N C E D E L O Y E R', 20, 20);
    doc.text(`REF : QL 47-92418-2405`, 20, 30);
    doc.text(`Quittance de loyer du mois de Mai 2024`, 20, 40);
    doc.text(`Adresse du bien : ${property.address}`, 20, 50);
    doc.text(`Code postal : ${property.postal_code}`, 20, 60);
    doc.text(`Ville : ${property.city}`, 20, 70);
    doc.text(`Titre foncier N° ${property.land_title}`, 20, 80);

    doc.text('Déclarant :', 20, 90);
    doc.text(`Je soussigné(e), NISSAY Immo Société à Responsabilité Limitée à Associé Unique, au capital de 6 069 000 DHS, immatriculée au registre de commerce de Casablanca sous le numéro 541253, représentée par son gérant unique Monsieur ABOUCH Yassine, titulaire de la CIN N° FC35117, propriétaire du logement désigné ci-dessus,`, 20, 100);

    doc.text('Déclare avoir reçu de :', 20, 120);
    doc.text(`La société ${tenant.name}, ICE ${tenant.ice}, siège social ${tenant.address}, représentée par son gérant ${tenant.representative}, titulaire de la CIN N°${tenant.cin},`, 20, 130);
    doc.text('La somme de :', 20, 140);
    doc.text('Douze mille dirhams (12 000 DHS),', 20, 150);
    doc.text('Au titre de :', 20, 160);
    doc.text('Paiement du loyer pour la période de location du 01/05/2024 au 31/05/2024 : 6000 DHS', 20, 170);
    doc.text('Un mois de caution : 6000 DHS', 20, 180);
    doc.text('Et lui en donne quittance, sous réserve de tous mes droits.', 20, 190);

    doc.text('DÉTAIL DU RÈGLEMENT :', 20, 200);
    doc.text('Loyer : 6000,00 Dirhams', 20, 210);
    doc.text('Provision pour charges : 0,00 Dirhams', 20, 220);
    doc.text('Caution : 6000,00 Dirhams', 20, 230);
    doc.text('Total : 12 000,00 Dirhams', 20, 240);

    doc.text('Date du paiement: 18/03/2024', 20, 250);
    doc.text('Fait à : Casablanca  le 23/03/2024', 20, 260);
    doc.text('Signature du bailleur', 20, 270);

    const pdfData = doc.output('datauristring');
    const buffer = await doc.save();
    res.send(buffer);

    // res.status(200).json({ pdf: pdfData });

}
