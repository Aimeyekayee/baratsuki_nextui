import React from "react";
import denso_bg from "@/public/Denso.png";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

const listNavigate = siteConfig.navItems;
const filteredList = listNavigate.filter((item) => item.label !== "Home");
const cardVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
  pressed: { scale: 0.95 },
};
const SectionNavigate = () => {
  const router = useRouter();

  const onCardPress = (router_url: string | undefined) => {
    router.push(router_url ? router_url : "/");
  };
  return (
    <div className="relative flex flex-col justify-center items-center w-full h-4/5">
      <div className="h-16"></div>
      <div
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${denso_bg.src})`,
        }}
      ></div>
      <div className="absolute flex gap-6 h-full" style={{ bottom: "5%" }}>
        {filteredList.map((item, index) => (
          <motion.div
            key={index}
            whileHover="hover"
            whileTap="pressed"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="initial"
          >
            <Card
              shadow="sm"
              isPressable
              className="h-full"
              onPress={() => onCardPress(item?.href)}
              style={{ width: "30rem" }}
            >
              <CardBody>
                <p>{item?.label}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectionNavigate;
