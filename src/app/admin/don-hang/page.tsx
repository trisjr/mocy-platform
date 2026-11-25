import type { Metadata } from "next";
import { OrdersPanel } from "@/components/admin/OrdersPanel";

export const metadata: Metadata = { title: "Đơn hàng" };

export default function AdminOrdersPage() {
  return <OrdersPanel />;
}
