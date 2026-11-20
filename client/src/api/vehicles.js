import { apiFetch } from "./client";

const BASE = "/vehicles";

export async function listVehicle() {
    return apiFetch(BASE);
}

export async function getVehicle(id) {
    return apiFetch(`${BASE}/${id}`);
}

export async function createVehicle(payload) {
    return apiFetch(BASE, { method: "POST", body: JSON.stringify(payload) });
}

export async function updateVehicle(id, payload) {
    return apiFetch(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export async function deleteVehicle(id) {
    return apiFetch(`${BASE}/${id}`, { method: "DELETE" });
}