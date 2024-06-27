import React from "react";
import denso_bg from "@/public/Denso.png";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const listNavigate = [
  {
    title: "Daily Performance",
    text: "Daily Performance",
    router: "/daily",
  },
  {
    title: "Summary Dashboard",
    text: "Summary Dashboard",
    router: "/summary",
  },
  ,
  {
    title: "Streaming",
    text: "Streaming",
    router: "/streaming",
  },
];
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
    <div
      className="relative flex flex-col justify-center items-center"
      style={{ width: "100%", height: "80%" }}
    >
      <div className="h-16"></div>
      <div
        style={{
          backgroundImage: `url(${denso_bg.src})`,
          width: "100%",
          height: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div
        className="absolute flex gap-6"
        style={{ bottom: "5%", height: "100%" }}
      >
        {listNavigate.map((item, index) => (
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
              onPress={() => onCardPress(item?.router)}
              style={{ height: "100%", width: "30rem" }}
            >
              <CardBody>
                <p>{item?.title}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectionNavigate;
