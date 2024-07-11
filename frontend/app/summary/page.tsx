"use client";
import SideBar from "@/components/sidebar";

import Nodata from "@/components/nodata.summary";
import { Button } from "@nextui-org/button";
import Dashboard from "@/components/dashboard/dashboard";
import { GeneralStore } from "@/store/general.store";
import DashboardStep from "@/components/dashboard/step/dashboard.step";

export default function BlogPage() {
  const showData = GeneralStore((state) => state.showData);
  return (
    <div className="flex justify-start p-4 " style={{ width: "100%" }}>
      <SideBar></SideBar>
      <div style={{ width: "85%", minHeight: "100%" }} className="pt-6 px-6">
        {showData ? <Dashboard /> : <Nodata></Nodata>}
      </div>
      {/* <DashboardStep /> */}
    </div>
  );
}
