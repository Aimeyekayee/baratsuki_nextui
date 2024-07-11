"use client";

import React from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "./cn";
import SupportCard from "./support-card";
import VerticalSteps from "./vertical-steps";

import RowSteps from "./row-steps";
import MultistepNavigationButtons from "./multistep-navigation-buttons";
import { ThemeSwitcher } from "@/components/themeSwitcher";

export type MultiStepSidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  currentPage: number;
  onBack: () => void;
  onNext: () => void;
  onChangePage: (page: number) => void;
};

const stepperClasses = cn(
  // light
  "[--step-color:hsl(var(--nextui-primary-400))]",
  "[--active-color:hsl(var(--nextui-primary-400))]",
  "[--inactive-border-color:hsl(var(--nextui-primary-200))]",
  "[--inactive-bar-color:hsl(var(--nextui-primary-200))]",
  "[--inactive-color:hsl(var(--nextui-primary-300))]",
  // dark
  "dark:[--step-color:rgba(255,255,255,0.1)]",
  "dark:[--active-color:hsl(var(--nextui-foreground-600))]",
  "dark:[--active-border-color:rgba(255,255,255,0.5)]",
  "dark:[--inactive-border-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-bar-color:rgba(255,255,255,0.1)]",
  "dark:[--inactive-color:rgba(255,255,255,0.2)]"
);

const MultiStepSidebar = React.forwardRef<
  HTMLDivElement,
  MultiStepSidebarProps
>(
  (
    {
      children,
      className,
      currentPage,
      onBack,
      onNext,
      onChangePage,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex h-[calc(100vh_-_40px)] w-full gap-x-2", className)}
        {...props}
      >
        <div className="flex hidden h-full w-[344px] flex-shrink-0 flex-col items-start gap-y-8 rounded-large bg-gradient-to-b from-default-100 via-primary-100 to-secondary-100 px-8 py-6 shadow-small lg:flex">
          <div className="flex justify-between w-full">
            <Button
              className="bg-default-50 text-small font-medium text-default-500 shadow-lg"
              isDisabled={currentPage === 0}
              radius="full"
              variant="flat"
              onPress={onBack}
            >
              <Icon icon="solar:arrow-left-outline" width={18} />
              Back
            </Button>
            <ThemeSwitcher />
          </div>
          <div>
            <div className="text-xl font-medium leading-7 text-default-foreground">
              Summary Dashboard
            </div>
            <div className="mt-1 text-base font-medium leading-6 text-default-500">
              Please follow the steps below to explore the summary dashboard.
            </div>
          </div>
          {/* Desktop Steps */}
          <VerticalSteps
            className={stepperClasses}
            color="secondary"
            currentStep={currentPage}
            steps={[
              {
                title: "Choose a option",
                description: "Setting an option.",
              },
              {
                title: "Loading Calendar",
                description: "Preparing calendar to choose working date.",
              },
              {
                title: "Choose Working date",
                description: "Drag you date to see summary.",
              },
              {
                title: "Explore!",
                description: "Finalize your registration",
              },
            ]}
            onStepChange={onChangePage}
          />
          <SupportCard className="w-full backdrop-blur-lg lg:bg-white/40 lg:shadow-none dark:lg:bg-white/20" />
        </div>
        <div className="flex h-full w-full flex-col items-center gap-4 md:p-4">
          <div className="sticky top-0 z-10 w-full rounded-large bg-gradient-to-r from-default-100 via-danger-100 to-secondary-100 py-4 shadow-small md:max-w-xl lg:hidden">
            <div className="flex justify-center">
              {/* Mobile Steps */}
              <RowSteps
                className={cn("pl-6", stepperClasses)}
                currentStep={currentPage}
                steps={[
                  {
                    title: "Account",
                  },
                  {
                    title: "Information",
                  },
                  {
                    title: "Address",
                  },
                  {
                    title: "Payment",
                  },
                ]}
                onStepChange={onChangePage}
              />
            </div>
          </div>
          <div className="h-full w-full p-4 sm:max-w-md md:max-w-lg">
            {children}
            <MultistepNavigationButtons
              backButtonProps={{ isDisabled: currentPage === 0 }}
              className="lg:hidden"
              nextButtonProps={{
                children:
                  currentPage === 0
                    ? "Next Step"
                    : currentPage === 3
                    ? "Go to Payment"
                    : "Continue",
              }}
              onBack={onBack}
              onNext={onNext}
            />
          </div>
        </div>
      </div>
    );
  }
);

MultiStepSidebar.displayName = "MultiStepSidebar";

export default MultiStepSidebar;
