# Thai Todo (Vite + React)

Todo app ภาษาไทย สร้างด้วย React, Tailwind CSS และ lucide-react

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด http://localhost:5173

## Build สำหรับ production

```bash
npm run build
npm run preview
```

## โครงสร้าง

- `src/App.jsx` – state หลัก, ฟอร์มเพิ่มงาน, filter, ปุ่มล้างงานที่เสร็จ
- `src/components/TodoItem.jsx` – แถวงาน, inline edit, animation ตอนลบ
- `src/constants.js` – ระดับความสำคัญและตัวกรอง

ข้อมูลเก็บใน React state เท่านั้น (รีเฟรชแล้วรีเซ็ต)
