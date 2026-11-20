import { z } from "zod";

const vehicleFields = {
    // Fields required when creating a vehicle
    registrationNumber: z.string()
        .trim()
        .min(1, "Registration number is required")
        .max(20, "Registration number must not exceed 20 characters"),

    brand: z.string()
        .trim()
        .min(1, "Brand is required")
        .max(50, "Brand must not exceed 50 characters"),

    model: z.string()
        .trim()
        .min(1, "Model is required")
        .max(50, "Model must not exceed 50 characters"),

    // These fields can be omitted or set to null
    color: z.string()
        .trim()
        .min(1, "Color cannot be empty")
        .max(30, "Color must not exceed 30 characters")
        .nullable()
        .optional(),

    year: z.number()
        .int("Year must be an integer")
        .min(1886, "Year must be 1886 or later")
        .max(2100, "Year must not exceed 2100")
        .nullable()
        .optional(),

    notes: z.string()
        .trim()
        .min(1, "Notes cannot be empty")
        .max(1000, "Notes must not exceed 1000 characters")
        .nullable()
        .optional(),
};

// Used when creating a new vehicle
export const createVehicleSchema = z
    .object(vehicleFields)
    .strict();

// For updates, all fields are optional, but at least one must be provided
export const updateVehicleSchema = z
    .object(vehicleFields)
    .partial()
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        "At least one field must be provided"
    );

// Validate the vehicle ID from route parameters
export const vehicleIdSchema = z.object({
    id: z.coerce.number().int().positive(),
});