"use client";
import React from "react";
import {
  RangeCalendar,
  Radio,
  RadioGroup,
  Button,
  ButtonGroup,
  cn,
} from "@nextui-org/react";
import type { DateValue } from "@react-types/calendar";
import type { RangeValue } from "@react-types/shared";
import { isWeekend } from "@internationalized/date";
import {
  today,
  getLocalTimeZone,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";

export default function CalendarSummary() {
  let [value, setValue] = React.useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1, days: 3 }),
  });

  let [focusedValue, setFocusedValue] = React.useState<DateValue>(
    today(getLocalTimeZone())
  );

  let { locale } = useLocale();

  let now = today(getLocalTimeZone());
  let startOfThisWeek = startOfWeek(now, locale);
  let endOfThisWeek = endOfWeek(now, locale);
  let startOfLastWeek = startOfWeek(now.add({ weeks: -1 }), locale);
  let endOfLastWeek = endOfWeek(now.add({ weeks: -1 }), locale);
  let startOfThisMonth = startOfMonth(now);
  let endOfThisMonth = endOfMonth(now);
  let startOfLastMonth = startOfMonth(now.add({ months: -1 }));
  let endOfLastMonth = endOfMonth(now.add({ months: -1 }));

  const CustomRadio = (props: any) => {
    const { children, ...otherProps } = props;

    return (
      <Radio
        {...otherProps}
        classNames={{
          base: cn(
            "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
            "cursor-pointer rounded-full border-2 border-default-200/60",
            "data-[selected=true]:border-primary"
          ),
          label: "text-tiny text-default-500",
          labelWrapper: "px-1 m-0",
          wrapper: "hidden",
        }}
      >
        {children}
      </Radio>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <RangeCalendar
        allowsNonContiguousRanges
        aria-label="Time off request"
        focusedValue={focusedValue}
        nextButtonProps={{
          variant: "bordered",
        }}
        prevButtonProps={{
          variant: "bordered",
        }}
        bottomContent={
            <ButtonGroup
            fullWidth
            className="px-3 max-w-full pb-2 pt-3 bg-content1 [&>button]:text-default-500 [&>button]:border-default-200/60"
            radius="full"
            size="sm"
            variant="bordered"
          >
            <Button
              className="max-w-[100px]" // Add this line to limit the width
              onPress={() => {
                setValue({ start: startOfLastWeek, end: endOfLastWeek });
                setFocusedValue(endOfLastWeek);
              }}
            >
              Last week
            </Button>
            <Button
              className="max-w-[100px]" // Add this line to limit the width
              onPress={() => {
                setValue({ start: startOfThisWeek, end: endOfThisWeek });
                setFocusedValue(endOfThisWeek);
              }}
            >
              This week
            </Button>
            <Button
              className="max-w-[100px]" // Add this line to limit the width
              onPress={() => {
                setValue({ start: startOfLastMonth, end: endOfLastMonth });
                setFocusedValue(endOfLastMonth);
              }}
            >
              Last month
            </Button>
            <Button
              className="max-w-[100px]" // Add this line to limit the width
              onPress={() => {
                setValue({ start: startOfThisMonth, end: endOfThisMonth });
                setFocusedValue(endOfThisMonth);
              }}
            >
              This month
            </Button>
          </ButtonGroup>
        }
        value={value}
        onChange={setValue}
        onFocusChange={setFocusedValue}
      />
    </div>
  );
}
