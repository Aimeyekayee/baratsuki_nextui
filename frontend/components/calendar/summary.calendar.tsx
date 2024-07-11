import React, { useEffect } from "react";
import {
  RangeCalendar,
  Radio,
  RadioGroup,
  Button,
  ButtonGroup,
  cn,
} from "@nextui-org/react";
import debounce from "lodash.debounce";
import type { DateValue } from "@react-types/calendar";
import type { RangeValue } from "@react-types/shared";
import {
  today,
  getLocalTimeZone,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
} from "@internationalized/date";
import { useLocale } from "@react-aria/i18n";
import { QueryParameterStore } from "@/store/query.params.store";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { QueryParameter } from "@/store/interfaces/queryparams.interface";

export default function RangeCalendars() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  let [value, setValue] = React.useState<RangeValue<DateValue>>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1, days: 3 }),
  });

  let [focusedValue, setFocusedValue] = React.useState<DateValue>(
    today(getLocalTimeZone())
  );

  let { locale } = useLocale();

  let now = today(getLocalTimeZone());
  let thisWeek = {
    start: startOfWeek(now, locale),
    end: endOfWeek(now, locale),
  };

  let lastWeek = {
    start: startOfWeek(now.add({ weeks: -1 }), locale),
    end: endOfWeek(now.add({ weeks: -1 }), locale),
  };
  let thisMonth = { start: startOfMonth(now), end: endOfMonth(now) };

  const { replaceWorkingDate, addWorkingDate, searchQuery } =
    QueryParameterStore();

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
  const updateSearchQuery = debounce(() => {
    const params = new URLSearchParams();
    Object.keys(searchQuery).forEach((key) => {
      if (searchQuery[key as keyof QueryParameter]) {
        params.set(key, searchQuery[key as keyof QueryParameter] as string);
      }
    });
    params.set("shift", "1");
    const queryString = params.toString();
    const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(updatedPath);
  }, 500);

  useEffect(() => {
    updateSearchQuery();
    return () => {
      updateSearchQuery.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);
  const handleChange = (newValue: RangeValue<DateValue>) => {
    const id = "";
    setValue(newValue);
    const startDate = `${newValue.start.year}-${newValue.start.month}-${newValue.start.day}`;
    const endDate = `${newValue.end.year}-${newValue.end.month}-${newValue.end.day}`;
    const workingDateParams = searchParams.get("working_date");
    if (workingDateParams?.includes("x")) {
      console.log("yes");
      replaceWorkingDate(id, `${startDate}x${endDate}`);
    } else {
      addWorkingDate(`${startDate}x${endDate}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <RangeCalendar
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
              onPress={() => {
                setValue(lastWeek);
                setFocusedValue(lastWeek.end);
              }}
            >
              Last week
            </Button>
            <Button
              onPress={() => {
                setValue(thisWeek);
                setFocusedValue(thisWeek.start);
              }}
            >
              This week
            </Button>
            <Button
              onPress={() => {
                setValue(thisMonth);
                setFocusedValue(thisMonth.start);
              }}
            >
              This month
            </Button>
          </ButtonGroup>
        }
        value={value}
        onChange={handleChange}
        onFocusChange={setFocusedValue}
      />
    </div>
  );
}
