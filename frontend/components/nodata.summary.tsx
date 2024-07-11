import React from "react";
import Image from "next/image";
import imagenotion from "@/public/325.Fast-Worker.png";
import { title } from "@/components/primitives";

const Nodata = () => {
  return (
    <div
      style={{ height: "100%", width: "100%" }}
      className="flex flex-col justify-center items-center"
    >
      <div className="mb-20">
        <Image src={imagenotion} alt="" width={400}></Image>
        <div className="flex justify-center items-center gap-2">
          <span
            className={title({ color: "blue" })}
            style={{ fontSize: "1.5rem", fontWeight: "bold" }}
          >
            No Summary Data to Display!
          </span>
        </div>
        <span className="text-xl text-bold">
          Please Select Option on the left side to explore dashboard.
        </span>
      </div>
    </div>
  );
};

export default Nodata;
