"use client";

import { SummarySelectStore } from "@/store/summary.select.store";
import type { ButtonProps, LinkProps } from "@nextui-org/react";

import { Button } from "@nextui-org/react";
import { startsWith } from "lodash";
import Link from "next/link";
import { useEffect } from "react";

export type ButtonWithBorderGradientProps = ButtonProps &
  LinkProps & {
    background?: string;
    isDisabled?: boolean;
    page?: number;
  };

export const ButtonWithBorderGradient = ({
  children,
  background = "--nextui-background",
  style: styleProp,
  isDisabled = false,
  page,
  ...props
}: ButtonWithBorderGradientProps) => {
  console.log(page);
  const linearGradientBg = startsWith(background, "--")
    ? `hsl(var(${background}))`
    : background;

  const style = {
    border: "solid 2px transparent",
    backgroundImage: `linear-gradient(${linearGradientBg}, ${linearGradientBg}), linear-gradient(to right, #F871A0, #9353D3)`,
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  };
  const selectLineID = SummarySelectStore((state) => state.selectLineID);
  const selectSectionCode = SummarySelectStore(
    (state) => state.selectSectionCode
  );
  const selectMachineNo = SummarySelectStore((state) => state.selectMachineNo);
  const selectSectionBool = selectSectionCode !== 0 ? true : false;
  const selectLineIDBool = selectLineID !== 0 ? true : false;
  const selectMachineNoBool = selectMachineNo !== "" ? true : false;

  let buttonDisabled = true;

  // Customize disable logic based on different values of 'page'
  if (page === 0) {
    buttonDisabled = !(selectSectionBool && selectLineIDBool && selectMachineNoBool);
  } else {
    buttonDisabled = false; // Customize for other pages as needed
  }
  return (
    <Button
      as={Link}
      href="#"
      {...props}
      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
      style={{
        // ...style,
        ...styleProp,
      }}
      type="submit"
      isDisabled={buttonDisabled}
    >
      {children}
    </Button>
  );
};
