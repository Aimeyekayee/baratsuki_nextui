"use client";
import React from "react";
import { IconMathIntegralBox } from "@/components/icon";
import FormSearchSummary from "./form/form.search.summary";
import { ThemeSwitcher } from "./themeSwitcher";
import { SidebarItem } from "./sidebar-item";
import { SidebarStyles } from "./sidebar/sidebar.style";
import { HomeIcon } from "./sidebar/home-icon";
import { usePathname } from "next/navigation";
import { SidebarMenu } from "./sidebar/sidebar-menu";
import { AccountsIcon } from "./sidebar/accounts-icon";
import { PaymentsIcon } from "./sidebar/payments-icon";
import { CustomersIcon } from "./sidebar/customers-icon";
import { MathIcon } from "./sidebar/math-icon";
import { Suspense } from "react";

const SideBar = () => {
  const pathname = usePathname();
  return (
    <div
      style={{ width: "15%", height: "100%" }}
      className="border-r-small border-divider border-t-small pt-8 px-8 flex flex-col gap-10 "
    >
      <div>
        <header className="flex gap-2 items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
              <svg
                fill="none"
                height="36"
                viewBox="0 0 32 32"
                width="36"
                className="text-background"
              >
                <path
                  clipRule="evenodd"
                  d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <span className="text-l font-bold uppercase">TPMTECH</span>
          </div>
          <ThemeSwitcher />
        </header>
        <div className="flex flex-col justify-between h-full">
          <div className={SidebarStyles.Body()}>
            <SidebarMenu title="Home">
              <SidebarItem
                isActive={pathname === "/"}
                title="Home"
                icon={<HomeIcon />}
                href="/"
              />
              <SidebarItem
                isActive={pathname === "/daily"}
                title="Dailys Performance"
                icon={<PaymentsIcon />}
                href="/daily"
              />
              <SidebarItem
                isActive={pathname === "/summary"}
                title="Summary"
                icon={<MathIcon />}
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
      <Suspense>
        <FormSearchSummary />
      </Suspense>
    </div>
  );
};

export default SideBar;
