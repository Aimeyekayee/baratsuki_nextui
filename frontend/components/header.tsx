import React from "react";
import { title, subtitle } from "@/components/primitives";
import { ConfigProvider } from "antd";
import { configtheme } from "@/config/themeConfig";

const HeaderBaratsuki = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 className={title()} style={{ fontSize: "2rem" }}>
        Red Ratio Graph
      </h1>
      <br />
      <h1 className={title()} style={{ fontSize: "2rem" }}>
        by Time Zone&nbsp;
      </h1>

      <h1 className={title({ color: "blue" })} style={{ fontSize: "2rem" }}>
        (Baratsuki)
      </h1>
      <ConfigProvider theme={configtheme()}>
        <h2 className={subtitle({ class: "mt-2" })}>
          กราฟแสดงชั่วโมงที่ผลิตไม่ได้ตามแผนแยกตามช่วงเวลา
        </h2>
      </ConfigProvider>
    </div>
  );
};

export default HeaderBaratsuki;
