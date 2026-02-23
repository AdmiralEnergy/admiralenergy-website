import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Admiral Energy",
  description:
    "Reach out for portable power advice, solar consultations, or partnership inquiries. No sales scripts — just a real conversation.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
