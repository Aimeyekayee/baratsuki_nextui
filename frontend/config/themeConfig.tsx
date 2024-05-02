import React from "react";
import type { ThemeConfig } from "antd";
import { theme } from "antd";

// export default ThemeProvider;
export function configtheme(): ThemeConfig {
  return {
    token: {
      fontFamily: "Noto Sans Thai",
    },
  };
}
