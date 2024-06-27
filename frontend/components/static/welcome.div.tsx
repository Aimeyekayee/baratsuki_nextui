import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { title, subtitle } from "@/components/primitives";

const WelcomeText = () => {
  const [isWaving, setIsWaving] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaving(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="text-center flex flex-col gap-6" style={{ height: "20%" }}>
      <div className="flex text-center justify-center items-center">
        <motion.div
          initial={{ rotate: -25 }}
          animate={isWaving ? { rotate: 25 } : { rotate: 0 }}
          transition={{
            duration: isWaving ? 1 : 0,
            repeat: isWaving ? Infinity : 0,
            repeatType: "mirror",
            ease: "linear",
          }}
        >
          <h2 className="text-3xl font-bold"> &#128075; &nbsp;</h2>
        </motion.div>
        <div className="flex">
          <h2 className="text-3xl font-bold">Welcome to&nbsp;</h2>
          <h2 className="text-3xl font-bold">E-Performance Analysis</h2>
        </div>
      </div>

      <span>
        Welcome to the Manufacturing Productivity and Operation Availability
        Tracking System! Monitor and analyze your production performance in
        real-time.
        <br />
        Click on the sections below to explore Daily Performance for daily
        insights, Summary for weekly/monthly reports, and Streaming to watch
        production live.
      </span>
    </div>
  );
};

export default WelcomeText;
