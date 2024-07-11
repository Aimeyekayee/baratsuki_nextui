import type { ButtonProps } from "@nextui-org/react";
import type { ButtonWithBorderGradientProps } from "./button-with-border-gradient";

import * as React from "react";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";

import { cn } from "./cn";
import { ButtonWithBorderGradient } from "./button-with-border-gradient";

type MultistepNavigationButtonsProps = React.HTMLAttributes<HTMLDivElement> & {
  onBack?: () => void;
  onNext?: () => void;
  pageActions?: {
    [key: number]: {
      onClick?: () => void;
      isDisabled?: boolean;
    };
  };
  backButtonProps?: ButtonProps;
  nextButtonProps?: ButtonWithBorderGradientProps;
};

const MultistepNavigationButtons = React.forwardRef<
  HTMLDivElement,
  MultistepNavigationButtonsProps
>(
  (
    {
      className,
      onBack,
      pageActions = {},
      backButtonProps,
      nextButtonProps,
      ...props
    },
    ref
  ) => {
    const { onClick, isDisabled } =
      pageActions[nextButtonProps?.page || 0] || {};

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto my-6 flex w-full items-center justify-center gap-x-4 lg:mx-0",
          className
        )}
        {...props}
      >
        <Button
          className="rounded-medium border-default-200 text-medium font-medium text-default-500 lg:hidden"
          variant="bordered"
          onPress={onBack}
          {...backButtonProps}
        >
          <Icon icon="solar:arrow-left-outline" width={24} />
          Go Back
        </Button>

        <ButtonWithBorderGradient
          className="text-medium font-medium"
          type="submit"
          onPress={onClick}
          isDisabled={isDisabled}
          {...nextButtonProps}
          page={nextButtonProps?.page ?? 0}
        >
          {nextButtonProps?.children || "Next Step"}
        </ButtonWithBorderGradient>
      </div>
    );
  }
);

MultistepNavigationButtons.displayName = "MultistepNavigationButtons";

export default MultistepNavigationButtons;
