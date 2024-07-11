import React from "react";
import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div style={{ marginTop: "calc(95dvh/2)", position: "absolute" }}>
      <Spinner label="Loading..." color="primary" />
    </div>
  );
}
