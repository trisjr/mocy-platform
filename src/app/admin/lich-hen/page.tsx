import type { Metadata } from "next";
import { AppointmentsPanel } from "@/components/admin/AppointmentsPanel";

export const metadata: Metadata = { title: "Lịch hẹn và tư vấn" };

export default function AdminAppointmentsPage() {
  return <AppointmentsPanel />;
}
