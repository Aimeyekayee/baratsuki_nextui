"use client";
import { Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import HeaderBaratsuki from "@/components/header";
import FormContainer from "@/components/form/form.container";
import { Empty } from "antd";
import CoverDivCardDisplay from "@/components/card/cover.div.card";
import { useTheme } from "next-themes";

export default function Daily() {
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setTheme("light");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: "flex", flexDirection: "column", width: "100%" }}
    >
      <div className="flex flex-col items-center justify-center">
        <Suspense>
          <HeaderBaratsuki />
          <FormContainer />
        </Suspense>
      </div>
      <CoverDivCardDisplay />
    </motion.div>
  );
}
