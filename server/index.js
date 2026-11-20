import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";
import { createVehicleSchema } from "./schemas/vehicle.schema.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// testing api
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/vehicles", async (req, res) => {
    try {
        const vehicle = await prisma.vehicle.findMany({ orderBy: { "id": "desc" } });
        // order by id because id is  autoincrement and the most num is the lastest row created
        // case createdAt same milli second cant compare sequence

        return res.status(200).json({
            data: vehicle
        })
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        });
    }
});

app.post("/api/vehicles", async (req, res) => {
    try {
        const validation = createVehicleSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                message: "ข้อมูลไม่ถูกต้อง",
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
            message: "เพิ่มข้อมูลรถยนต์สำเร็จ",
            data: vehicle,
        });

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "ทะเบียนรถนี้มีในระบบแล้ว",
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});