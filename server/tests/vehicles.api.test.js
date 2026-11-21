import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

// Mock Prisma so tests never touch a real database.
vi.mock("../prisma.js", () => ({
    prisma: {
        vehicle: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
    },
}));

import { app } from "../index.js";
import { prisma } from "../prisma.js";

const vehicle = {
    id: 1,
    registrationNumber: "กข 1234",
    brand: "Toyota",
    model: "Camry",
    color: "White",
    year: 2020,
    notes: null,
};

const newVehicle = {
    registrationNumber: "กข 1234",
    brand: "Toyota",
    model: "Camry",
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("GET /api/vehicles", () => {
    it("returns the vehicle list", async () => {
        prisma.vehicle.findMany.mockResolvedValue([vehicle]);

        const res = await request(app).get("/api/vehicles");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: [vehicle] });
    });
});

describe("GET /api/vehicles/:id", () => {
    it("returns the vehicle when found", async () => {
        prisma.vehicle.findUnique.mockResolvedValue(vehicle);

        const res = await request(app).get("/api/vehicles/1");

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(vehicle);
        expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("returns 404 when not found", async () => {
        prisma.vehicle.findUnique.mockResolvedValue(null);

        const res = await request(app).get("/api/vehicles/999");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Vehicle not found");
    });
});

describe("POST /api/vehicles", () => {
    it("creates a vehicle", async () => {
        prisma.vehicle.create.mockResolvedValue(vehicle);

        const res = await request(app).post("/api/vehicles").send(newVehicle);

        expect(res.status).toBe(201);
        expect(res.body.data).toEqual(vehicle);
        expect(prisma.vehicle.create).toHaveBeenCalledWith({ data: newVehicle });
    });

    it("returns 400 when validation fails", async () => {
        const res = await request(app).post("/api/vehicles").send({ brand: "Toyota" });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Invalid request data");
        expect(prisma.vehicle.create).not.toHaveBeenCalled();
    });

    it("returns 409 when the registration number already exists", async () => {
        prisma.vehicle.create.mockRejectedValue({ code: "P2002" });

        const res = await request(app).post("/api/vehicles").send(newVehicle);

        expect(res.status).toBe(409);
        expect(res.body.message).toBe("Vehicle registration number already exists");
    });
});

describe("PATCH /api/vehicles/:id", () => {
    it("updates a vehicle", async () => {
        const updated = { ...vehicle, color: "Red" };
        prisma.vehicle.update.mockResolvedValue(updated);

        const res = await request(app).patch("/api/vehicles/1").send({ color: "Red" });

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual(updated);
        expect(prisma.vehicle.update).toHaveBeenCalledWith({
            data: { color: "Red" },
            where: { id: 1 },
        });
    });

    it("returns 404 when not found", async () => {
        prisma.vehicle.update.mockRejectedValue({ code: "P2025" });

        const res = await request(app).patch("/api/vehicles/999").send({ color: "Red" });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Vehicle not found");
    });
});

describe("DELETE /api/vehicles/:id", () => {
    it("deletes a vehicle and returns 204", async () => {
        prisma.vehicle.delete.mockResolvedValue(vehicle);

        const res = await request(app).delete("/api/vehicles/1");

        expect(res.status).toBe(204);
        expect(prisma.vehicle.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("returns 404 when not found", async () => {
        prisma.vehicle.delete.mockRejectedValue({ code: "P2025" });

        const res = await request(app).delete("/api/vehicles/999");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("Vehicle not found");
    });
});