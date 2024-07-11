'use client'
import LoadingSpinner from "@/components/loading.spinner";

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      className="flex flex-col items-center justify-center p-4"
      style={{ position: "relative" }}
    >
      {children}
      <LoadingSpinner />
    </section>
  );
}
