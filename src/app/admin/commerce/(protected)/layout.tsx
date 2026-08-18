import AdminShell from "@/components/commerce/AdminShell";
import { requireCommerceAdmin } from "@/lib/commerce/auth";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default async function ProtectedCommerceLayout({ children }: { children: ReactNode }) {
  const session = await requireCommerceAdmin();
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
