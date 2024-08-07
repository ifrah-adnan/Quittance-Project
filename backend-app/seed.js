const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const propertiesData = [
    { propertyNumber: 'P001', name: 'Villa Sunshine', address: '123 Sunny St', city: 'Sun City', state: 'SC', zipCode: '12345', propertyType: 'VILLA' },
    { propertyNumber: 'P002', name: 'Ocean View Apartment', address: '456 Ocean Ave', city: 'Ocean City', state: 'OC', zipCode: '23456', propertyType: 'APARTMENT' },
    { propertyNumber: 'P003', name: 'Mountain Retreat', address: '789 Mountain Rd', city: 'Mountain City', state: 'MC', zipCode: '34567', propertyType: 'HOUSE' },
    { propertyNumber: 'P004', name: 'Downtown Studio', address: '101 Downtown St', city: 'City Center', state: 'CC', zipCode: '45678', propertyType: 'STUDIO' },
    { propertyNumber: 'P005', name: 'Suburban House', address: '202 Suburb Ln', city: 'Suburb City', state: 'SC', zipCode: '56789', propertyType: 'HOUSE' },
    { propertyNumber: 'P006', name: 'Lakefront Cottage', address: '303 Lakefront Dr', city: 'Lake City', state: 'LC', zipCode: '67890', propertyType: 'VILLA' },
    { propertyNumber: 'P007', name: 'Modern Office', address: '404 Office Blvd', city: 'Business City', state: 'BC', zipCode: '78901', propertyType: 'OFFICE' },
    { propertyNumber: 'P008', name: 'Historic Garage', address: '505 Historic St', city: 'Historic City', state: 'HC', zipCode: '89012', propertyType: 'GARAGE' },
    { propertyNumber: 'P009', name: 'Luxury Studio', address: '606 Luxury Ave', city: 'Luxury City', state: 'LC', zipCode: '90123', propertyType: 'STUDIO' },
    { propertyNumber: 'P010', name: 'Eco House', address: '707 Eco Rd', city: 'Eco City', state: 'EC', zipCode: '01234', propertyType: 'HOUSE' },
];


const tenantsData = [
    { tenantType: 'ENTERPRISE', name: 'Tech Corp', ice: '123456', address: '123 Tech St', contactName: 'Alice', contactCin: 'CIN123', contactInfo: 'alice@techcorp.com', propertyNumbers: ['P001', 'P002'] },
    { tenantType: 'PERSON', name: 'John Doe', ice: '654321', address: '456 Main St', contactName: 'John Doe', contactCin: 'CIN456', contactInfo: 'john.doe@example.com', propertyNumbers: ['P003'] },
    { tenantType: 'ENTERPRISE', name: 'Biz LLC', ice: '789012', address: '789 Biz Blvd', contactName: 'Bob', contactCin: 'CIN789', contactInfo: 'bob@bizllc.com', propertyNumbers: ['P004', 'P005'] },
    { tenantType: 'PERSON', name: 'Jane Smith', ice: '345678', address: '101 State St', contactName: 'Jane Smith', contactCin: 'CIN101', contactInfo: 'jane.smith@example.com', propertyNumbers: ['P006'] },
    { tenantType: 'ENTERPRISE', name: 'Enterprise Inc', ice: '890123', address: '202 Commerce St', contactName: 'Charlie', contactCin: 'CIN202', contactInfo: 'charlie@enterpriseinc.com', propertyNumbers: ['P007', 'P008'] },
    { tenantType: 'PERSON', name: 'Emily Johnson', ice: '567890', address: '303 Country Rd', contactName: 'Emily Johnson', contactCin: 'CIN303', contactInfo: 'emily.johnson@example.com', propertyNumbers: ['P009'] },
    { tenantType: 'ENTERPRISE', name: 'Global Co', ice: '678901', address: '404 World Ave', contactName: 'David', contactCin: 'CIN404', contactInfo: 'david@globalco.com', propertyNumbers: ['P010'] },
    { tenantType: 'PERSON', name: 'Michael Brown', ice: '234567', address: '505 Park St', contactName: 'Michael Brown', contactCin: 'CIN505', contactInfo: 'michael.brown@example.com', propertyNumbers: ['P001'] },
    { tenantType: 'ENTERPRISE', name: 'Innovate LLC', ice: '345678', address: '606 Innovation Way', contactName: 'Eve', contactCin: 'CIN606', contactInfo: 'eve@innovatellc.com', propertyNumbers: ['P002'] },
    { tenantType: 'PERSON', name: 'Chris Green', ice: '456789', address: '707 Forest Rd', contactName: 'Chris Green', contactCin: 'CIN707', contactInfo: 'chris.green@example.com', propertyNumbers: ['P003'] },
    { tenantType: 'ENTERPRISE', name: 'StartUp Inc', ice: '567890', address: '808 StartUp Blvd', contactName: 'Frank', contactCin: 'CIN808', contactInfo: 'frank@startupinc.com', propertyNumbers: ['P004'] },
    { tenantType: 'PERSON', name: 'Sarah White', ice: '678901', address: '909 White St', contactName: 'Sarah White', contactCin: 'CIN909', contactInfo: 'sarah.white@example.com', propertyNumbers: ['P005'] },
    { tenantType: 'ENTERPRISE', name: 'Creative Co', ice: '789012', address: '1010 Creative Ln', contactName: 'Grace', contactCin: 'CIN1010', contactInfo: 'grace@creativeco.com', propertyNumbers: ['P006'] },
    { tenantType: 'PERSON', name: 'Daniel Black', ice: '890123', address: '1111 Black Rd', contactName: 'Daniel Black', contactCin: 'CIN1111', contactInfo: 'daniel.black@example.com', propertyNumbers: ['P007'] },
    { tenantType: 'ENTERPRISE', name: 'Visionary Ltd', ice: '901234', address: '1212 Vision St', contactName: 'Hannah', contactCin: 'CIN1212', contactInfo: 'hannah@visionaryltd.com', propertyNumbers: ['P008'] },
];

async function main() {
    console.log('Seeding data...');

    for (const propertyData of propertiesData) {
        await prisma.property.create({
            data: propertyData,
        });
    }

    for (const tenantData of tenantsData) {
        const { propertyNumbers, ...tenant } = tenantData;
        const createdTenant = await prisma.tenant.create({
            data: tenant,
        });

        for (const propertyNumber of propertyNumbers) {
            const property = await prisma.property.findUnique({
                where: { propertyNumber },
            });
            await prisma.tenantProperties.create({
                data: {
                    tenantId: createdTenant.id,
                    propertyId: property.id,
                },
            });
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
