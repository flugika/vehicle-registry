import { describe, it, expect } from "vitest";
import { createVehicleSchema, updateVehicleSchema } from "../schemas/vehicle.schema.js";

describe("createVehicleSchema", () => {
    it("accepts valid data", () => {
        const result = createVehicleSchema.safeParse({
            registrationNumber: "กข 1234",
            brand: "Toyota",
            model: "Camry",
            year: 2020,
            color: null,
        });

        expect(result.success).toBe(true);
    });

    it("rejects invalid required fields", () => {
        const result = createVehicleSchema.safeParse({
            registrationNumber: "   ",
            brand: "",
        });

        expect(result.success).toBe(false);
        const fields = result.error.issues.map((i) => i.path.join("."));
        expect(fields).toEqual(
            expect.arrayContaining(["registrationNumber", "brand", "model"])
        );
    });
});

describe("updateVehicleSchema", () => {
    it("accepts a partial update", () => {
        const result = updateVehicleSchema.safeParse({ color: "Red" });

        expect(result.success).toBe(true);
        expect(result.data).toEqual({ color: "Red" });
    });

    it("rejects an empty object", () => {
        const result = updateVehicleSchema.safeParse({});

        expect(result.success).toBe(false);
    });
});