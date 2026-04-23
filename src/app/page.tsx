import { TanstackBookingTable } from "@/components/tanstack-booking-table";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
          <h1 className="text-lg font-semibold tracking-tight">
            ระบบจองสนามกีฬา
          </h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <TanstackBookingTable />
      </main>
    </div>
  );
}
