# ระบบจองสนามกีฬา (React TanStack Table)

Next.js + shadcn/ui + TanStack Table สำหรับจัดการรายการจองสนามกีฬา ธีมขาวดำมินิมอล ใช้ฟอนต์ Noto Sans Thai

## เทคโนโลยี

- [Next.js 16](https://nextjs.org/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) — ธีมขาวดำมินิมอล
- [@tanstack/react-table](https://tanstack.com/table) — ตารางขั้นสูง
- [@tanstack/react-virtual](https://tanstack.com/virtual) — Virtual scrolling
- [Noto Sans Thai](https://fonts.google.com/noto/specimen/Noto+Sans+Thai) — ฟอนต์ภาษาไทย

## ฟีเจอร์

- 🔍 ค้นหาแบบ Debounce (พร้อม shortcut ⌘K / Alt+K)
- 🔃 เรียงลำดับคอลัมน์
- 📄 Pagination + เลือกจำนวนแถวต่อหน้า
- 🖥 โหมดขยายเต็มจอ
- 📊 แถวสรุป (Summary row)
- ⚡ Virtual scrolling สำหรับข้อมูลจำนวนมาก
- 🌓 รองรับ Dark mode

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

## โครงสร้างไฟล์สำคัญ

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # หน้าแรก (ใช้ TanstackBookingTable)
│   ├── layout.tsx          # Root layout + Noto Sans Thai
│   └── globals.css         # ธีมขาวดำมินิมอล
├── components/
│   ├── tanstack-booking-table.tsx  # ตารางหลัก (TanStack)
│   ├── booking-table.tsx           # ตารางเดิม (สำรอง)
│   ├── table-no-data.tsx
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── use-debounce.ts
│   └── use-search-shortcut.ts
└── lib/
    ├── utils.ts
    ├── table-styles.ts     # Tailwind classes กลาง
    └── tanstack-helpers.ts # buildColumnDefs, alignment
```

## Build

```bash
npm run build
```

## อ้างอิง

ตัวอย่าง Vue component ต้นฉบับจาก Gist: [ts-table.vue](https://gist.github.com/oooasas12/db72f9d7668f41c1af7af1a2741df312)
