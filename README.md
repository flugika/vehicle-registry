# Vehicle Management

เว็บจัดการข้อมูลรถของบริษัท ทำตามโจทย์ทดสอบ Full-Stack Developer (ฮ้อปคาร์)

ทำได้: ดูรายการรถ / เพิ่ม / แก้ไข / ลบ
ข้อมูลรถ: ทะเบียน, ยี่ห้อ, รุ่น, สี, ปี, หมายเหตุ (ทะเบียน ยี่ห้อ รุ่น ต้องกรอก)

## ใช้อะไรบ้าง

- Frontend: React (Vite), Ant Design
- Backend: Node.js, Express, Prisma, Zod
- Database: PostgreSQL

## วิธีรัน

**1. เปิด database** (ต้องมี Docker)

```bash
docker run --name vehicle-db -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=vehicles -p 5433:5432 -d postgres
```

**2. Backend**

```bash
cd server
npm install
```

สร้างไฟล์ `server/.env`

```
DATABASE_URL="postgresql://postgres:devpassword@localhost:5433/vehicles"
PORT=3001
```

```bash
npx prisma migrate dev
npm run dev
```

**3. Frontend**

```bash
cd client
npm install
```

สร้างไฟล์ `client/.env`

```
VITE_API_URL=http://localhost:3001/api
```

```bash
npm run dev
```

เปิด http://localhost:5173

## ใส่ข้อมูลตัวอย่างจาก JSON

สคริปต์ `server/scripts/seed.mjs` จะอ่านไฟล์ `seed.json` แล้ววนลูปทีละแถว
แต่ละแถวจะส่ง `POST /api/vehicles` 1 ครั้ง (ไม่ได้ส่งทีเดียวทั้งก้อน) และพิมพ์ผลลัพธ์ออกมาทีละบรรทัด

ต้องเปิด backend ก่อน แล้วรัน

```bash
cd server/scripts
node seed.mjs
```

บรรทัดละ 1 คัน ถ้าขึ้น `201` คือเพิ่มสำเร็จ ถ้าขึ้น `409` คือทะเบียนนั้นมีอยู่แล้ว (เจอตอนรันซ้ำ) แถวอื่นยังทำต่อตามปกติ

## API

ดูรายละเอียดที่ [docs/API.md](docs/API.md)

## หมายเหตุ

- Docker ใช้แค่เปิด PostgreSQL ถ้าไม่ใช้ Docker ก็ลง PostgreSQL เองแล้วแก้ `DATABASE_URL` ได้
- ตรวจข้อมูลทั้งฝั่งหน้าเว็บและ server
- ลบรถจะมีให้กดยืนยันก่อน
