import { readFile } from "node:fs/promises";

const API = "http://localhost:3001/api/vehicles";
const items = JSON.parse(await readFile("./seed.json", "utf8"));

for (const item of items) {
    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });
    console.log(res.status, item.registrationNumber);
}