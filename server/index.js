import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.get("/api/vehicles", async (req, res) => {
    const vehicle = await prisma.vehicle.findMany();
    res.json(vehicle);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});