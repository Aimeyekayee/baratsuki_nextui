"use Effect";
import React from "react";
import { Spinner } from "@nextui-org/react";
import { GeneralStore } from "@/store/general.store";

export default function LoadingSpinner() {
  const isLoading = GeneralStore((state) => state.isLoading);
  return (
    <div style={{ marginTop: "calc(85dvh/2)", position: "absolute" }}>
      {isLoading ? <Spinner label="Loading..." color="primary" /> : <></>}
    </div>
  );
}
