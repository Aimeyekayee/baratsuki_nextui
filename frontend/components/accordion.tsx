import React, { useState } from "react";
import { motion } from "framer-motion";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          cursor: "pointer",
          backgroundColor: "#f1f1f1",
          padding: "1rem",
          borderRadius: "5px",
        }}
      >
        {title}
      </div>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, overflow: "hidden" }}
        transition={{ duration: 0.3 }}
      >
        {isOpen && <div style={{ padding: "1rem" }}>{children}</div>}
      </motion.div>
    </div>
  );
};

export default Accordion;
