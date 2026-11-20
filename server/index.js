
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";
import { createVehicleSchema, vehicleIdSchema } from "./schemas/vehicle.schema.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// Get all vehicles
app.get("/api/vehicles", async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: [
                { createdAt: "desc" },
                { id: "desc" },
            ]
        });
        // Sort by auto-increment ID to ensure a consistent order,
        // as multiple records may share the same createdAt timestamp.

        return res.status(200).json({
            data: vehicles,
        });
    } catch (error) {
        console.error("Get vehicles error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Get vehicle by ID
app.get("/api/vehicles/:id", async (req, res) => {
    try {
        const validation = vehicleIdSchema.safeParse(req.params);

        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid vehicle ID",
                errors: validation.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const { id } = validation.data;

        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
        });

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found",
            });
        }

        return res.status(200).json({
            data: vehicle,
        });
    } catch (error) {
        console.error("Get vehicle by ID error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Create vehicle
app.post("/api/vehicles", async (req, res) => {
    try {
        const validation = createVehicleSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "Invalid request data",
                errors: validation.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const vehicle = await prisma.vehicle.create({
            data: validation.data,
        });

        return res.status(201).json({
            message: "Vehicle created successfully",
            data: vehicle,
        });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Vehicle registration number already exists",
            });
        }

        console.error("Create vehicle error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
