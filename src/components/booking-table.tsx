"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, MapPin, User } from "lucide-react";

interface Booking {
  id: number;
  customer: string;
  court: string;
  date: string;
  time: string;
  duration: string;
  status: "confirmed" | "pending" | "cancelled";
}

const bookingData: Booking[] = [
  {
    id: 1,
    customer: "สมชาย ใจดี",
    court: "สนามแบดมินตัน A",
    date: "23 เม.ย. 2026",
    time: "09:00 - 11:00",
    duration: "2 ชั่วโมง",
    status: "confirmed",
  },
  {
    id: 2,
    customer: "วิไลวรรณ สีสุก",
    court: "สนามแบดมินตัน B",
    date: "23 เม.ย. 2026",
    time: "11:00 - 12:00",
    duration: "1 ชั่วโมง",
    status: "pending",
  },
  {
    id: 3,
    customer: "ประเสริฐ มากมี",
    court: "สนามฟุตบอล 1",
    date: "24 เม.ย. 2026",
    time: "16:00 - 18:00",
    duration: "2 ชั่วโมง",
    status: "confirmed",
  },
  {
    id: 4,
    customer: "อำพร แสงทอง",
    court: "สนามบาสเกตบอล",
    date: "24 เม.ย. 2026",
    time: "18:00 - 20:00",
    duration: "2 ชั่วโมง",
    status: "cancelled",
  },
  {
    id: 5,
    customer: "มานี รักเรียน",
    court: "สนามแบดมินตัน A",
    date: "25 เม.ย. 2026",
    time: "08:00 - 10:00",
    duration: "2 ชั่วโมง",
    status: "confirmed",
  },
  {
    id: 6,
    customer: "สมศรี มีทรัพย์",
    court: "สนามเทนนิส",
    date: "25 เม.ย. 2026",
    time: "14:00 - 16:00",
    duration: "2 ชั่วโมง",
    status: "pending",
  },
];

function getStatusBadge(status: Booking["status"]) {
  switch (status) {
    case "confirmed":
      return (
        <Badge variant="default" className="bg-black text-white hover:bg-black/80">
          ยืนยันแล้ว
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="border-black text-black">
          รออนุมัติ
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="secondary" className="bg-neutral-200 text-neutral-600">
          ยกเลิก
        </Badge>
      );
    default:
      return null;
  }
}

export function BookingTable() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [bookings, setBookings] = React.useState<Booking[]>(bookingData);

  const filteredBookings = React.useMemo(() => {
    if (!searchQuery.trim()) return bookings;
    const query = searchQuery.toLowerCase();
    return bookings.filter(
      (booking) =>
        booking.customer.toLowerCase().includes(query) ||
        booking.court.toLowerCase().includes(query) ||
        booking.date.includes(query)
    );
  }, [bookings, searchQuery]);

  function handleCancel(id: number) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
  }

  function handleConfirm(id: number) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b))
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            รายการจองสนาม
          </h2>
          <p className="text-sm text-muted-foreground">
            จัดการรายการจองสนามกีฬาทั้งหมด
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ค้นหาลูกค้า หรือสนาม..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[60px]">#</TableHead>
              <TableHead>ลูกค้า</TableHead>
              <TableHead>สนาม</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>เวลา</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  ไม่พบรายการจอง
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {booking.customer}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {booking.court}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {booking.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {booking.time}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {booking.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs border-black hover:bg-black hover:text-white"
                          onClick={() => handleConfirm(booking.id)}
                        >
                          อนุมัติ
                        </Button>
                      )}
                      {booking.status !== "cancelled" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-black"
                          onClick={() => handleCancel(booking.id)}
                        >
                          ยกเลิก
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          แสดง {filteredBookings.length} จาก {bookings.length} รายการ
        </span>
      </div>
    </div>
  );
}
