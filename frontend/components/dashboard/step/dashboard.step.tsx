"use client";

import React from "react";
import { domAnimation, LazyMotion, m } from "framer-motion";

import MultistepSidebar from "./multistep-sidebar";
import SelectForm from "./select-form";
import CompanyInformationForm from "./company-information-form";
import ChooseAddressForm from "./choose-address-form";
import ReviewAndPaymentForm from "./review-and-payment-form";
import MultistepNavigationButtons from "./multistep-navigation-buttons";

const variants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    y: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

export default function DashboardStep() {
  const [[page, direction], setPage] = React.useState([0, 0]);

  const paginate = React.useCallback((newDirection: number) => {
    setPage((prev) => {
      console.log(prev);
      const nextPage = prev[0] + newDirection;

      if (nextPage < 0 || nextPage > 3) return prev;

      console.log([nextPage, newDirection]);
      return [nextPage, newDirection];
    });
  }, []);

  const onChangePage = React.useCallback((newPage: number) => {
    setPage((prev) => {
      if (newPage < 0 || newPage > 3) return prev;
      const currentPage = prev[0];

      return [newPage, newPage > currentPage ? 1 : -1];
    });
  }, []);

  const onBack = React.useCallback(() => {
    paginate(-1);
  }, [paginate]);

  const onNext = React.useCallback(() => {
    paginate(1);
  }, [paginate]);

  const handleActionForPage0 = () => {
    // Action for page 0
    console.log("Action for page 0");
    onNext();
  };

  const handleActionForPage1 = () => {
    // Action for page 1
    console.log("Action for page 1");
    onNext();
  };

  const pageActions = {
    0: {
      onClick: handleActionForPage0,
      isDisabled: false, // Replace with your condition
    },
    1: {
      onClick: handleActionForPage1,
      isDisabled: false, // Replace with your condition
    },
    2: {
      onClick: onNext,
      isDisabled: false, // Replace with your condition
    },
    3: {
      onClick: onNext,
      isDisabled: false, // Replace with your condition
    },
  };

  const content = React.useMemo(() => {
    let component = <SelectForm />;

    switch (page) {
      case 1:
        component = <CompanyInformationForm />;
        break;
      case 2:
        component = <ChooseAddressForm />;
        break;
      case 3:
        component = <ReviewAndPaymentForm />;
        break;
    }

    return (
      <LazyMotion features={domAnimation}>
        <m.div
          key={page}
          animate="center"
          className="col-span-12"
          custom={direction}
          exit="exit"
          initial="exit"
          transition={{
            y: {
              ease: "backOut",
              duration: 0.35,
            },
            opacity: { duration: 0.4 },
          }}
          variants={variants}
        >
          {component}
        </m.div>
      </LazyMotion>
    );
  }, [direction, page]);

  return (
    <MultistepSidebar
      currentPage={page}
      onBack={onBack}
      onChangePage={onChangePage}
      onNext={onNext}
    >
      <div className="relative flex h-fit w-full flex-col pt-6 text-center lg:h-full lg:justify-center lg:pt-0">
        {content}
        <MultistepNavigationButtons
          backButtonProps={{ isDisabled: page === 0 }}
          className="hidden justify-center lg:flex"
          nextButtonProps={{
            children:
              page === 0
                ? "Next Step"
                : page === 3
                ? "Go to Payment"
                : "Continue",
            page,
          }}
          onBack={onBack}
          onNext={onNext}
          pageActions={pageActions}
        />
      </div>
    </MultistepSidebar>
  );
}
