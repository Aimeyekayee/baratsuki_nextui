"use client";
import SectionNavigate from "@/components/static/section.navigate";
import WelcomeText from "@/components/static/welcome.div";

export default function Home() {
  return (
    <section
      className="flex flex-col items-center justify-center gap-4"
      style={{ height: "calc(100dvh - 7rem)" }}
    >
      <WelcomeText />
      <SectionNavigate />
    </section>
  );
}
