const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const upload = require("./multerConfig");

require("dotenv").config();

const app = express();
const port = 3001;
const authRoutes = require("./auth");

const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

const PropertyType = {
  VILLA: "VILLA",
  APARTMENT: "APARTMENT",
  HOUSE: "HOUSE",
  STUDIO: "STUDIO",
  OFFICE: "OFFICE",
  GARAGE: "GARAGE",
  AUTRE: "AUTRE",
};

const TenantType = {
  ENTERPRISE: "ENTERPRISE",
  PERSON: "PERSON",
};

// Utility function to fetch allowed types (if using Prisma models)
const getAllowedTypes = async (model) => {
  const types = await prisma[model].findMany();
  return types.map((type) => type.name); // Adjust according to your model's field name
};
app.use("/api", authRoutes);

// Endpoints for property types
app.get("/property-types", (req, res) => {
  const propertyTypes = Object.keys(PropertyType); // ['VILLA', 'APARTMENT', ...]
  res.json(propertyTypes);
});
const JWT_SECRET = "votre_clé_secrète";

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extrait le token
  console.log("this is token ", token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err.message); // Affiche l'erreur
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
app.put(
  "/complete-profile",
  authenticateToken,
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      cin,
      address,
      phoneNumber,
      ice,
      companyName,
      contactName,
      userType,
    } = req.body;

    const userId = req.user.id;
    const signature = req.files["signature"]
      ? req.files["signature"][0].path
      : null;
    const logo = req.files["logo"] ? req.files["logo"][0].path : null;

    try {
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!currentUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updateData = {
        cin: cin || currentUser.cin,
        address: address || currentUser.address,
        phoneNumber: phoneNumber || currentUser.phoneNumber,
        ice: userType === "ENTERPRISE" ? ice || currentUser.ice : null,
        companyName:
          userType === "ENTERPRISE"
            ? companyName || currentUser.companyName
            : null,
        contactName:
          userType === "ENTERPRISE"
            ? contactName || currentUser.contactName
            : null,
        signature: signature || currentUser.signature,
        logo: logo || currentUser.logo,
        userType: userType || currentUser.userType,
      };

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Error updating profile" });
    }
  }
);

// Route pour récupérer les informations utilisateur
app.get("/user", authenticateToken, async (req, res) => {
  try {
    // Trouver l'utilisateur dans la base de données en utilisant l'ID du token
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Répondre avec les informations utilisateur
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Endpoints for tenant types
app.get("/tenant-types", (req, res) => {
  const tenantTypes = Object.keys(TenantType); // ['ENTERPRISE', 'PERSON']
  res.json(tenantTypes);
});

// CRUD operations for Property model

// Create a property
app.post("/properties", upload.array("images", 10), async (req, res) => {
  try {
    const allowedTypes = Object.keys(PropertyType);

    const { propertyType, userId, ...rest } = req.body;

    console.log("Received body:", req.body);
    console.log("Received files:", req.files);

    if (!allowedTypes.includes(propertyType)) {
      return res.status(400).json({ message: "Invalid propertyType" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const imagePaths = req.files.map((file) => file.path);

    const property = await prisma.property.create({
      data: {
        propertyType,
        user: {
          connect: { id: userId },
        },
        images: {
          create: imagePaths.map((url) => ({ url })),
        },
        ...rest,
      },
      include: {
        images: true,
      },
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// Read all properties
app.get("/properties", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const properties = await prisma.property.findMany({
      where: { userId: userId },
      include: {
        images: true,
      },
    });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read a single property
app.get("/properties/:id", async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
      },
    });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.delete("/properties/:id/images/:imageId", async (req, res) => {
  const { id, imageId } = req.params;

  try {
    // Vérifiez si l'image existe
    const image = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Supprimez l'image
    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting image" });
  }
});

// Update a property
app.put("/properties/:id", async (req, res) => {
  try {
    const allowedTypes = Object.keys(PropertyType);

    const {
      propertyType,
      propertyNumber,
      name,
      address,
      city,
      state,
      zipCode,
      userId,
      images,
    } = req.body;

    // Validation du type de propriété
    if (propertyType && !allowedTypes.includes(propertyType)) {
      return res.status(400).json({ message: "Invalid propertyType" });
    }

    // Mise à jour de la propriété
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: {
        propertyType,
        propertyNumber,
        name,
        address,
        city,
        state,
        zipCode,
        userId,
        images: {
          // Mise à jour des images existantes
          update:
            images
              ?.filter((image) => image.id)
              .map((image) => ({
                where: { id: image.id },
                data: {
                  url: image.url,
                  description: image.description,
                  updatedAt: new Date(),
                },
              })) || [],
          create:
            images
              ?.filter((image) => !image.id)
              .map((image) => ({
                url: image.url,
                description: image.description,
                createdAt: new Date(),
                updatedAt: new Date(),
              })) || [],
          deleteMany: {
            id: { notIn: images?.map((image) => image.id) || [] },
          },
        },
      },
    });

    res.json(property);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a property
app.delete("/properties/:id", async (req, res) => {
  const propertyId = req.params.id;

  try {
    await prisma.contract.deleteMany({
      where: { propertyId: propertyId },
    });

    await prisma.rentalPayment.deleteMany({
      where: { contract: { propertyId: propertyId } },
    });

    await prisma.tenantProperties.deleteMany({
      where: { propertyId: propertyId },
    });

    await prisma.property.delete({
      where: { id: propertyId },
    });

    res.json({ message: "Property and related records deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CRUD operations for Tenant model

// Create a tenant
const nodemailer = require("nodemailer");
const { connect } = require("http2");
const path = require("path");

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ifrahadnan61@gmail.com",
    pass: "xout wivk byca sdrb",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Route pour créer un tenant
app.post("/tenants", async (req, res) => {
  try {
    const allowedTypes = Object.keys(TenantType);

    const { tenantType, email, userId, ...rest } = req.body;
    if (!allowedTypes.includes(tenantType)) {
      return res.status(400).json({ message: "Invalid tenantType" });
    }

    const tenant = await prisma.tenant.create({
      data: {
        tenantType,
        email,
        user: {
          connect: { id: userId },
        },
        ...rest,
      },
    });

    // Envoi de l'email
    const mailOptions = {
      from: "ifrahadnan61@gmail.com",
      to: email,
      subject: "Bienvenue chez notre service",
      text: `Bonjour ${tenant.name},\n\nMerci d'avoir rejoint notre service en tant que ${tenantType}.\n\nCordialement,\nL'équipe`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Erreur lors de l'envoi de l'email:", error);
      } else {
        console.log("Email envoyé: " + info.response);
      }
    });

    res.status(201).json(tenant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all tenants
app.get("/tenants", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const tenants = await prisma.tenant.findMany({
      where: { userId: userId },
    });
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read a single tenant
app.get("/tenants/:id", async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: req.params.id },
    });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/tenants/:id", async (req, res) => {
  try {
    const allowedTypes = Object.keys(TenantType);

    const { tenantType, ...rest } = req.body;
    if (tenantType && !allowedTypes.includes(tenantType)) {
      return res.status(400).json({ message: "Invalid tenantType" });
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
// Create a contract
app.post("/contracts", async (req, res) => {
  try {
    const {
      tenantId,
      userId,
      propertyId,
      startDate,
      endDate,
      rentAmount,
      terms,
    } = req.body;

    if (
      !tenantId ||
      !userId ||
      !propertyId ||
      !startDate ||
      !endDate ||
      rentAmount === undefined ||
      terms === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Créer un contrat dans la base de données
    const contract = await prisma.contract.create({
      data: {
        tenantId,
        propertyId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId, // Utilisez directement userId au lieu de user.connect
        rentAmount: parseFloat(rentAmount),
        terms,
      },
    });

    res.status(201).json(contract);
  } catch (err) {
    console.error(err); // Log l'erreur complète pour le débogage
    res.status(400).json({ message: err.message });
  }
});

app.post("/generate-rental-payments", async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
    });

    for (const contract of contracts) {
      let currentDate = new Date(contract.startDate);
      while (currentDate <= new Date()) {
        const nextDueDate = new Date(currentDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        // Vérifiez si un paiement pour cette date d'échéance existe déjà
        const existingPayment = await prisma.rentalPayment.findFirst({
          where: {
            contractId: contract.id,
            dueDate: currentDate,
          },
        });

        if (!existingPayment) {
          await prisma.rentalPayment.create({
            data: {
              contractId: contract.id,
              dueDate: currentDate,
              amountDue: contract.rentAmount,
              amountPaid: 0,
              paymentStatus: "PENDING",
            },
          });
        }

        // Avancer d'un mois
        currentDate = nextDueDate;
      }
    }

    res.status(200).json({ message: "Rental payments generated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while generating rental payments" });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        tenants: {
          include: {
            contracts: {
              include: {
                rentalPayments: true,
              },
            },
          },
        },
        properties: true,
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Read all contracts
app.get("/contracts", async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const contracts = await prisma.contract.findMany({
      where: { userId: userId },

      include: {
        tenant: true,
        property: true,
      },
    });

    res.status(200).json(contracts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Read all rental records
app.get("/rentalRecords", async (req, res) => {
  const { userId } = req.query;

  try {
    const rentalRecords = await prisma.rentalPayment.findMany({
      where: {
        contract: {
          userId: userId,
        },
      },
      include: {
        contract: {
          include: {
            tenant: true,
            property: true,
            user: true,
          },
        },
      },
    });

    res.status(200).json(rentalRecords);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.post("/rental-payments", async (req, res) => {
  const {
    contractId,
    dueDate,
    amountDue,
    amountPaid,
    paymentStatus,
    paymentDate,
    userId,
  } = req.body;

  console.log("Données reçues:", req.body);

  try {
    // Validation et conversion des données
    if (!contractId || typeof contractId !== "string") {
      throw new Error("Invalid contractId");
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      throw new Error("Invalid dueDate");
    }

    const parsedAmountDue = parseFloat(amountDue);
    if (isNaN(parsedAmountDue)) {
      throw new Error("Invalid amountDue");
    }

    const parsedAmountPaid = parseFloat(amountPaid);
    if (isNaN(parsedAmountPaid)) {
      throw new Error("Invalid amountPaid");
    }

    if (!["PENDING", "PAID", "PARTIAL", "LATE"].includes(paymentStatus)) {
      throw new Error("Invalid paymentStatus");
    }

    let parsedPaymentDate = null;
    if (paymentDate) {
      parsedPaymentDate = new Date(paymentDate);
      if (isNaN(parsedPaymentDate.getTime())) {
        throw new Error("Invalid paymentDate");
      }
    }
    const contract = await prisma.contract.findUnique({
      where: {
        id: contractId,
        userId: userId,
      },
    });

    if (!contract) {
      throw new Error(
        "Contract not found or does not belong to the specified user"
      );
    }

    const rentalPayment = await prisma.rentalPayment.create({
      data: {
        dueDate: parsedDueDate,
        amountDue: parsedAmountDue,
        amountPaid: parsedAmountPaid,
        paymentStatus,
        paymentDate: parsedPaymentDate,
        contract: {
          connect: {
            id: contractId,
          },
        },
      },
      include: {
        contract: true,
      },
    });

    console.log("RentalPayment créé:", rentalPayment);

    res.status(201).json(rentalPayment);
  } catch (err) {
    console.error("Erreur lors de la création du RentalPayment:", err);
    res.status(400).json({ message: err.message });
  }
});
app.get("/rental-payments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const rentalPayment = await prisma.rentalPayment.findUnique({
      where: { id: id },
      include: {
        contract: {
          include: {
            property: true,
            tenant: true,
          },
        },
      },
    });

    if (!rentalPayment) {
      return res.status(404).json({ message: "Rental Payment not found" });
    }

    res.status(200).json(rentalPayment);
  } catch (err) {
    console.error("Error fetching rental payment:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.patch("/rentalrecords/:id", async (req, res) => {
  const { id } = req.params;

  const { paymentStatus } = req.body;

  try {
    const updatedPayment = await prisma.rentalPayment.update({
      where: { id: id },
      data: { paymentStatus: paymentStatus },
    });

    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: "Failed to update payment status", error });
  }
});
app.get("/property/:id/status", async (req, res) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        contracts: {
          include: {
            rentalPayments: {
              orderBy: { dueDate: "desc" },
              take: 1,
            },
          },
          orderBy: { endDate: "desc" },
          take: 1,
        },
      },
    });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const latestContract = property.contracts[0];
    const isRented =
      latestContract && new Date(latestContract.endDate) > new Date();
    const latestPayment = latestContract?.rentalPayments[0];
    const isPaid = latestPayment?.paymentStatus === "PAID";

    res.json({
      isRented,
      isPaid,
      contractDetails: latestContract
        ? {
            startDate: latestContract.startDate,
            endDate: latestContract.endDate,
            rentAmount: latestContract.rentAmount,
          }
        : null,
      latestPayment: latestPayment
        ? {
            dueDate: latestPayment.dueDate,
            amountDue: latestPayment.amountDue,
            amountPaid: latestPayment.amountPaid,
            paymentStatus: latestPayment.paymentStatus,
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
// Route pour mettre à jour un enregistrement de paiement de location
app.put("/rental-payments/:id", async (req, res) => {
  const { id } = req.params;
  const {
    contractId,
    dueDate,
    amountDue,
    amountPaid,
    paymentStatus,
    paymentDate,
  } = req.body;

  try {
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      throw new Error("Invalid dueDate");
    }

    const parsedAmountDue = parseFloat(amountDue);
    if (isNaN(parsedAmountDue)) {
      throw new Error("Invalid amountDue");
    }

    const parsedAmountPaid = parseFloat(amountPaid);
    if (isNaN(parsedAmountPaid)) {
      throw new Error("Invalid amountPaid");
    }

    if (!["PENDING", "PAID", "PARTIAL", "LATE"].includes(paymentStatus)) {
      throw new Error("Invalid paymentStatus");
    }

    let parsedPaymentDate = null;
    if (paymentDate) {
      parsedPaymentDate = new Date(paymentDate);
      if (isNaN(parsedPaymentDate.getTime())) {
        throw new Error("Invalid paymentDate");
      }
    }

    const rentalPayment = await prisma.rentalPayment.update({
      where: { id },
      data: {
        contractId,
        dueDate: parsedDueDate,
        amountDue: parsedAmountDue,
        amountPaid: parsedAmountPaid,
        paymentStatus,
        paymentDate: parsedPaymentDate,
      },
    });

    res.status(200).json(rentalPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour supprimer un enregistrement de paiement de location
app.delete("/rental-payments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.rentalPayment.delete({
      where: { id },
    });

    res.status(204).send(); // No content
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read a single contract
app.get("/contracts/:id", async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: {
        tenant: true,
        property: true,
      },
    });
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.json(contract);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a contract
app.put("/contracts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { tenantId, propertyId, startDate, endDate, rentAmount, terms } =
      req.body;

    const contract = await prisma.contract.update({
      where: { id },
      data: {
        tenantId,
        propertyId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentAmount: parseFloat(rentAmount),
        terms,
      },
    });

    res.status(200).json(contract);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a contract
app.delete("/contracts/:id", async (req, res) => {
  try {
    await prisma.contract.delete({
      where: { id: req.params.id },
    });
    res.json({ message: "Contract deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a tenant
app.delete("/tenants/:id", async (req, res) => {
  const tenantId = req.params.id;

  try {
    // Supprimer les associations de propriétés liées au locataire
    await prisma.tenantProperties.deleteMany({
      where: {
        tenantId: tenantId,
      },
    });
    await prisma.contract.deleteMany({
      where: {
        tenantId: tenantId,
      },
    });

    // Supprimer le locataire
    await prisma.tenant.delete({
      where: {
        id: tenantId,
      },
    });

    res.json({ message: "Tenant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
