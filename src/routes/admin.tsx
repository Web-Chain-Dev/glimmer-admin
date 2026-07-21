import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin-shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Панель управления — Ювелирный каталог" },
      { name: "description", content: "Управление товарами и категориями" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
});
