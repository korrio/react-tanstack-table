export interface Booking {
  id: number;
  customer: string;
  court: string;
  date: string;
  time: string;
  duration: string;
  status: "confirmed" | "pending" | "cancelled";
}

const initialData: Booking[] = [
  { id: 1, customer: "สมชาย ใจดี", court: "สนามแบดมินตัน A", date: "23 เม.ย. 2026", time: "09:00 - 11:00", duration: "2 ชั่วโมง", status: "confirmed" },
  { id: 2, customer: "วิไลวรรณ สีสุก", court: "สนามแบดมินตัน B", date: "23 เม.ย. 2026", time: "11:00 - 12:00", duration: "1 ชั่วโมง", status: "pending" },
  { id: 3, customer: "ประเสริฐ มากมี", court: "สนามฟุตบอล 1", date: "24 เม.ย. 2026", time: "16:00 - 18:00", duration: "2 ชั่วโมง", status: "confirmed" },
  { id: 4, customer: "อำพร แสงทอง", court: "สนามบาสเกตบอล", date: "24 เม.ย. 2026", time: "18:00 - 20:00", duration: "2 ชั่วโมง", status: "cancelled" },
  { id: 5, customer: "มานี รักเรียน", court: "สนามแบดมินตัน A", date: "25 เม.ย. 2026", time: "08:00 - 10:00", duration: "2 ชั่วโมง", status: "confirmed" },
  { id: 6, customer: "สมศรี มีทรัพย์", court: "สนามเทนนิส", date: "25 เม.ย. 2026", time: "14:00 - 16:00", duration: "2 ชั่วโมง", status: "pending" },
  { id: 7, customer: "ประวิทย์ สุขสม", court: "สนามแบดมินตัน C", date: "26 เม.ย. 2026", time: "10:00 - 12:00", duration: "2 ชั่วโมง", status: "confirmed" },
  { id: 8, customer: "กาญจนา มีสุข", court: "สนามฟุตบอล 2", date: "26 เม.ย. 2026", time: "15:00 - 17:00", duration: "2 ชั่วโมง", status: "confirmed" },
  { id: 9, customer: "สมพงษ์ แก้วกล้า", court: "สนามแบดมินตัน A", date: "27 เม.ย. 2026", time: "09:00 - 10:00", duration: "1 ชั่วโมง", status: "pending" },
  { id: 10, customer: "อรทัย ใจดี", court: "สนามเทนนิส", date: "27 เม.ย. 2026", time: "13:00 - 15:00", duration: "2 ชั่วโมง", status: "confirmed" },
  { id: 11, customer: "ชาญชัย รุ่งเรือง", court: "สนามบาสเกตบอล", date: "28 เม.ย. 2026", time: "17:00 - 19:00", duration: "2 ชั่วโมง", status: "confirmed" },
  { id: 12, customer: "พิมพ์ใจ งามเลิศ", court: "สนามแบดมินตัน B", date: "28 เม.ย. 2026", time: "08:00 - 09:00", duration: "1 ชั่วโมง", status: "cancelled" },
];

// Use global to survive Next.js HMR / hot reload
declare global {
  var __bookings_db: Booking[] | undefined;
}

export const getBookings = (): Booking[] => {
  if (!globalThis.__bookings_db) {
    globalThis.__bookings_db = [...initialData];
  }
  return globalThis.__bookings_db;
};

export const updateBooking = (id: number, updates: Partial<Booking>): Booking | null => {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;
  bookings[index] = { ...bookings[index], ...updates };
  return bookings[index];
};

export const addBooking = (booking: Omit<Booking, "id">): Booking => {
  const bookings = getBookings();
  const newBooking = {
    id: Math.max(...bookings.map((b) => b.id), 0) + 1,
    ...booking,
  };
  bookings.push(newBooking);
  return newBooking;
};

export const deleteBooking = (id: number): boolean => {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return false;
  bookings.splice(index, 1);
  return true;
};
