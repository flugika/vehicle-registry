
import { z } from "zod";

export const createVehicleSchema = z.object({
    registrationNumber: z.string().trim().min(1, "กรุณาระบุทะเบียนรถ"),
    brand: z.string().trim().optional(),
    model: z.string().trim().optional(),
});
