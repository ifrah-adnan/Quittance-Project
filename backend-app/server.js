const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

const prisma = new PrismaClient();

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

const PropertyType = {
    VILLA: 'VILLA',
    APARTMENT: 'APARTMENT',
    HOUSE: 'HOUSE',
    STUDIO: 'STUDIO',
    OFFICE: 'OFFICE',
    GARAGE: 'GARAGE',
    AUTRE: 'AUTRE'
};

const TenantType = {
    ENTERPRISE: 'ENTERPRISE',
    PERSON: 'PERSON'
};

// Utility function to fetch allowed types (if using Prisma models)
const getAllowedTypes = async (model) => {
    const types = await prisma[model].findMany();
    return types.map(type => type.name); // Adjust according to your model's field name
};

// Endpoints for property types
app.get('/property-types', (req, res) => {
    const propertyTypes = Object.keys(PropertyType); // ['VILLA', 'APARTMENT', ...]
    res.json(propertyTypes);
});

// Endpoints for tenant types
app.get('/tenant-types', (req, res) => {
    const tenantTypes = Object.keys(TenantType); // ['ENTERPRISE', 'PERSON']
    res.json(tenantTypes);
});

// CRUD operations for Property model

// Create a property
app.post('/properties', async (req, res) => {
    try {
        const allowedTypes = Object.keys(PropertyType); // ['VILLA', 'APARTMENT', ...]

        const { propertyType, ...rest } = req.body;
        if (!allowedTypes.includes(propertyType)) {
            return res.status(400).json({ message: 'Invalid propertyType' });
        }

        const property = await prisma.property.create({
            data: {
                propertyType,
                ...rest,
            },
        });
        res.status(201).json(property);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read all properties
app.get('/properties', async (req, res) => {
    try {
        const properties = await prisma.property.findMany();
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Read a single property
app.get('/properties/:id', async (req, res) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
        });
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a property
app.put('/properties/:id', async (req, res) => {
    try {
        const allowedTypes = Object.keys(PropertyType); // ['VILLA', 'APARTMENT', ...]

        const { propertyType, ...rest } = req.body;
        if (propertyType && !allowedTypes.includes(propertyType)) {
            return res.status(400).json({ message: 'Invalid propertyType' });
        }

        const property = await prisma.property.update({
            where: { id: req.params.id },
            data: {
                propertyType,
                ...rest,
            },
        });
        res.json(property);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a property
app.delete('/properties/:id', async (req, res) => {
    try {
        await prisma.property.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Property deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CRUD operations for Tenant model

// Create a tenant
app.post('/tenants', async (req, res) => {
    try {
        const allowedTypes = Object.keys(TenantType); // ['ENTERPRISE', 'PERSON']

        const { tenantType, ...rest } = req.body;
        if (!allowedTypes.includes(tenantType)) {
            return res.status(400).json({ message: 'Invalid tenantType' });
        }

        const tenant = await prisma.tenant.create({
            data: {
                tenantType,
                ...rest,
            },
        });
        res.status(201).json(tenant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Read all tenants
app.get('/tenants', async (req, res) => {
    try {
        const tenants = await prisma.tenant.findMany();
        res.json(tenants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Read a single tenant
app.get('/tenants/:id', async (req, res) => {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: req.params.id },
        });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json(tenant);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a tenant
app.put('/tenants/:id', async (req, res) => {
    try {
        const allowedTypes = Object.keys(TenantType); // ['ENTERPRISE', 'PERSON']

        const { tenantType, ...rest } = req.body;
        if (tenantType && !allowedTypes.includes(tenantType)) {
            return res.status(400).json({ message: 'Invalid tenantType' });
        }

        const tenant = await prisma.tenant.update({
            where: { id: req.params.id },
            data: {
                tenantType,
                ...rest,
            },
        });
        res.json(tenant);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a tenant
app.delete('/tenants/:id', async (req, res) => {
    try {
        await prisma.tenant.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Tenant deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
