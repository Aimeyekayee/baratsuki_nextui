import React from "react";
import { Flex, Typography } from "antd";
import { MQTTStore } from "@/store/mqttStore";
import dayjs from "dayjs";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
} from "@nextui-org/react";
import { GeneralStore } from "@/store/general.store";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";
import customParseForma from "dayjs/plugin/utc";
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
interface ShiftBreak {
  start: string;
  end: string;
}

interface IProps {
  target: number;
  actual: number;
  currentDate: string;
  dateString: string | string[];
  zone: number;
}

const MonitorData: React.FC<IProps> = ({
  target,
  actual,
  currentDate,
  dateString,
  zone,
}) => {
  const mqttDataMachine1 = MQTTStore((state) => state.mqttDataMachine1);
  const mqttDataMachine2 = MQTTStore((state) => state.mqttDataMachine2);
  const shift = GeneralStore((state) => state.shift);
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const isOdd = GeneralStore((state) => state.isOdd);
  const targetNotRealtime = 2200;
  const actualMqtt1 = mqttDataMachine1.prod_actual;
  const actualMqtt2 = mqttDataMachine2.prod_actual;

  const targetValues: { [key: number]: number } = {
    70: 1540,
    77: 1694,
    85: 1870,
    100: 2200,
  };
  const baratsukiRateNumber = Number(baratsukiRate);
  let targets: number = targetValues[baratsukiRateNumber] || 0;

  const now1 = dayjs(); // Get the current date and time

  let breakTimes;
  let new_brake: any[] = [];

  if (shift === "day") {
    breakTimes = isOdd
      ? [
          {
            start: now1.set("hour", 9).set("minute", 30).toDate(),
            end: now1.set("hour", 9).set("minute", 40).toDate(),
          },
          {
            start: now1.set("hour", 11).set("minute", 15).toDate(),
            end: now1.set("hour", 12).set("minute", 15).toDate(),
          },
          {
            start: now1.set("hour", 14).set("minute", 30).toDate(),
            end: now1.set("hour", 14).set("minute", 40).toDate(),
          },
          {
            start: now1.set("hour", 16).set("minute", 30).toDate(),
            end: now1.set("hour", 16).set("minute", 50).toDate(),
          },
        ]
      : [
          {
            start: now1.set("hour", 9).set("minute", 20).toDate(),
            end: now1.set("hour", 9).set("minute", 30).toDate(),
          },
          {
            start: now1.set("hour", 11).set("minute", 30).toDate(),
            end: now1.set("hour", 12).set("minute", 30).toDate(),
          },
          {
            start: now1.set("hour", 14).set("minute", 20).toDate(),
            end: now1.set("hour", 14).set("minute", 30).toDate(),
          },
          {
            start: now1.set("hour", 16).set("minute", 30).toDate(),
            end: now1.set("hour", 16).set("minute", 50).toDate(),
          },
        ];
  } else {
    const isBeforeMidnight =
      now1.hour() < 7 || (now1.hour() === 7 && now1.minute() < 20);

    breakTimes = isOdd
      ? [
          {
            start: now1.set("hour", 21).set("minute", 30).toDate(),
            end: now1.set("hour", 21).set("minute", 40).toDate(),
          },
          {
            start: now1.set("hour", 23).set("minute", 15).toDate(),
            end: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 0)
              .set("minute", 5)
              .toDate(),
          },
          {
            start: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 2)
              .set("minute", 30)
              .toDate(),
            end: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 2)
              .set("minute", 50)
              .toDate(),
          },
          {
            start: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 4)
              .set("minute", 30)
              .toDate(),
            end: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 4)
              .set("minute", 50)
              .toDate(),
          },
        ]
      : [
          {
            start: now1.set("hour", 21).set("minute", 30).toDate(),
            end: now1.set("hour", 21).set("minute", 40).toDate(),
          },
          {
            start: now1.set("hour", 23).set("minute", 30).toDate(),
            end: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 0)
              .set("minute", 20)
              .toDate(),
          },
          {
            start: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 2)
              .set("minute", 30)
              .toDate(),
            end: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 2)
              .set("minute", 50)
              .toDate(),
          },
          {
            start: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 4)
              .set("minute", 30)
              .toDate(),
            end: now1
              .add(isBeforeMidnight ? 1 : 0, "day")
              .set("hour", 4)
              .set("minute", 50)
              .toDate(),
          },
        ];
  }

  breakTimes.forEach((breakTime: any) => {
    const start = dayjs(breakTime.start);
    const end = dayjs(breakTime.end);
    breakTime.brake_time = end.diff(start, "minute");
  });
  // console.log(now1);
  breakTimes.forEach((breakTime) => {
    const end = dayjs(breakTime.end);
    const currentTime = dayjs().add(7, "hour");
    if (now1.isAfter(end)) {
      new_brake.push(breakTime);
    }
  });

  console.log(new_brake);
  let brake_time_accum = 0;
  new_brake.forEach((obj) => {
    brake_time_accum += obj.brake_time;
  });
  // console.log(brake_time_accum);

  function getWorkingTime(currentTime: Date, isOdd: boolean): number {
    // Define shift start and end times
    const dayShiftStart = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      7,
      35
    );
    const nightShiftStart = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth(),
      currentTime.getDate(),
      19,
      35
    );
    // Determine current shift

    // Calculate working time
    let workingTime = 0;

    // Find the appropriate start and end times for the current time
    let startTime: Date;
    let endTime = currentTime;
    if (shift === "day") {
      startTime = dayShiftStart;
      // console.log("day", startTime);
      // console.log("end", endTime);
    } else {
      startTime = nightShiftStart;
      // console.log("night", startTime);
      // Handle cases where current time is past midnight (night shift)
      if (currentTime < dayShiftStart) {
        startTime.setDate(startTime.getDate() - 1); // Adjust for previous day
      }
    }

    // Calculate difference between current time and start time (in minutes)
    const diffInMinutes = dayjs(endTime).diff(dayjs(startTime), "minute");
    console.log(diffInMinutes);

    return diffInMinutes;
  }

  // Example usage
  const now = new Date();
  // const isOdd = true; // Change this to true or false as needed
  const workingMinutes = getWorkingTime(now, isOdd);
  const workingMinuteExcludeBrake = workingMinutes - brake_time_accum;
  const targetMq = (workingMinuteExcludeBrake * 60) / 16.5;
  // console.log(workingMinuteExcludeBrake);
  return (
    <Flex
      style={{ height: "20%", width: "100%" }}
      gap={10}
      align="center"
      justify="center"
    >
      <Flex justify="center" align="center">
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: shift === "day" ? "black" : "white",
          }}
        >
          Target : &nbsp;
        </Typography>
        <Card
          shadow="sm"
          radius="sm"
          style={{
            background: "black",
            height: "100%",
            width: "10rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: "2rem",
            }}
          >
            {dateString === currentDate ? targetMq.toFixed(0) : target}
          </Typography>
        </Card>
      </Flex>
      <Flex justify="center" align="center">
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: shift === "day" ? "black" : "white",
          }}
        >
          Actual :&nbsp;&nbsp;
        </Typography>
        <Card
          shadow="sm"
          radius="sm"
          style={{
            background: "black",
            height: "100%",
            width: "10rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: "2rem",
            }}
          >
            {dateString === currentDate
              ? zone === 1
                ? mqttDataMachine1.prod_actual
                : mqttDataMachine2.prod_actual
              : actual}
          </Typography>
        </Card>
      </Flex>
      <Flex justify="center" align="center">
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: shift === "day" ? "black" : "white",
          }}
        >
          OA : &nbsp;
        </Typography>
        <Card
          shadow="sm"
          radius="sm"
          style={{
            background: "black",
            height: "100%",
            width: "10rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: "2rem",
            }}
          >
            {dateString === currentDate
              ? zone === 1
                ? ((mqttDataMachine1.prod_actual / targetMq) * 100).toFixed(2)
                : ((mqttDataMachine2.prod_actual / targetMq) * 100).toFixed(2)
              : ((actual / target) * 100).toFixed(2)}
          </Typography>
        </Card>
      </Flex>
    </Flex>
  );
};

export default MonitorData;
