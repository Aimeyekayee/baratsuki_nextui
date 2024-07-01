// import React, { useEffect } from "react";
// import { Flex, Typography } from "antd";
// import { MQTTStore } from "@/store/mqttStore";
// import dayjs from "dayjs";
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Input,
// } from "@nextui-org/react";
// import { GeneralStore } from "@/store/general.store";
// import isBetween from "dayjs/plugin/isBetween";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import customParseForma from "dayjs/plugin/utc";
// dayjs.extend(isBetween);
// dayjs.extend(customParseFormat);
// interface ShiftBreak {
//   start: string;
//   end: string;
// }

// interface IProps {
//   target: number;
//   actual: number;
//   currentDate: string;
//   dateString: string | string[];
//   zone: number;
// }

// const MonitorData: React.FC<IProps> = ({
//   target,
//   actual,
//   currentDate,
//   dateString,
//   zone,
// }) => {
//   const mqttDataMachine1 = MQTTStore((state) => state.mqttDataMachine1);
//   const mqttDataMachine2 = MQTTStore((state) => state.mqttDataMachine2);
//   const shift = GeneralStore((state) => state.shift);
//   const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
//   const isOdd = GeneralStore((state) => state.isOdd);
//   const actualMqtt1 = mqttDataMachine1.prod_actual;
//   const actualMqtt2 = mqttDataMachine2.prod_actual;
//   const setTargetRealTimeMC1 = GeneralStore(
//     (state) => state.setTargetRealTimeMC1
//   );
//   const targetRealTimeMC1 = GeneralStore((state) => state.targetRealTimeMC1);
//   const targetRealTimeMC2 = GeneralStore((state) => state.targetRealTimeMC2);
//   const setTargetRealTimeMC2 = GeneralStore(
//     (state) => state.setTargetRealTimeMC2
//   );

//   const now1 = dayjs(); // Get the current date and time

//   let breakTimes;
//   let new_brake: any[] = [];

//   if (shift === "day") {
//     breakTimes = isOdd
//       ? [
//           {
//             start: now1.set("hour", 9).set("minute", 30).toDate(),
//             end: now1.set("hour", 9).set("minute", 40).toDate(),
//           },
//           {
//             start: now1.set("hour", 11).set("minute", 15).toDate(),
//             end: now1.set("hour", 12).set("minute", 15).toDate(),
//           },
//           {
//             start: now1.set("hour", 14).set("minute", 30).toDate(),
//             end: now1.set("hour", 14).set("minute", 40).toDate(),
//           },
//           {
//             start: now1.set("hour", 16).set("minute", 30).toDate(),
//             end: now1.set("hour", 16).set("minute", 50).toDate(),
//           },
//         ]
//       : [
//           {
//             start: now1.set("hour", 9).set("minute", 20).toDate(),
//             end: now1.set("hour", 9).set("minute", 30).toDate(),
//           },
//           {
//             start: now1.set("hour", 11).set("minute", 30).toDate(),
//             end: now1.set("hour", 12).set("minute", 30).toDate(),
//           },
//           {
//             start: now1.set("hour", 14).set("minute", 20).toDate(),
//             end: now1.set("hour", 14).set("minute", 30).toDate(),
//           },
//           {
//             start: now1.set("hour", 16).set("minute", 30).toDate(),
//             end: now1.set("hour", 16).set("minute", 50).toDate(),
//           },
//         ];
//   } else {
//     const isBeforeMidnight =
//       now1.hour() < 7 || (now1.hour() === 7 && now1.minute() < 20);

//     breakTimes = isOdd
//       ? [
//           {
//             start: now1.set("hour", 21).set("minute", 30).toDate(),
//             end: now1.set("hour", 21).set("minute", 40).toDate(),
//           },
//           {
//             start: now1.set("hour", 23).set("minute", 15).toDate(),
//             end: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 0)
//               .set("minute", 5)
//               .toDate(),
//           },
//           {
//             start: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 2)
//               .set("minute", 30)
//               .toDate(),
//             end: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 2)
//               .set("minute", 50)
//               .toDate(),
//           },
//           {
//             start: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 4)
//               .set("minute", 30)
//               .toDate(),
//             end: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 4)
//               .set("minute", 50)
//               .toDate(),
//           },
//         ]
//       : [
//           {
//             start: now1.set("hour", 21).set("minute", 30).toDate(),
//             end: now1.set("hour", 21).set("minute", 40).toDate(),
//           },
//           {
//             start: now1.set("hour", 23).set("minute", 30).toDate(),
//             end: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 0)
//               .set("minute", 20)
//               .toDate(),
//           },
//           {
//             start: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 2)
//               .set("minute", 30)
//               .toDate(),
//             end: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 2)
//               .set("minute", 50)
//               .toDate(),
//           },
//           {
//             start: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 4)
//               .set("minute", 30)
//               .toDate(),
//             end: now1
//               .add(isBeforeMidnight ? 1 : 0, "day")
//               .set("hour", 4)
//               .set("minute", 50)
//               .toDate(),
//           },
//         ];
//   }

//   breakTimes.forEach((breakTime: any) => {
//     const start = dayjs(breakTime.start);
//     const end = dayjs(breakTime.end);
//     breakTime.brake_time = end.diff(start, "minute");
//   });
//   // console.log(now1);
//   breakTimes.forEach((breakTime) => {
//     const end = dayjs(breakTime.end);
//     const currentTime = dayjs().add(7, "hour");
//     if (now1.isAfter(end)) {
//       new_brake.push(breakTime);
//     }
//   });

//   console.log(new_brake);
//   let brake_time_accum = 0;
//   new_brake.forEach((obj) => {
//     brake_time_accum += obj.brake_time;
//   });
//   // console.log(brake_time_accum);

//   function getWorkingTime(currentTime: Date, isOdd: boolean): number {
//     // Define shift start and end times
//     const dayShiftStart = new Date(
//       currentTime.getFullYear(),
//       currentTime.getMonth(),
//       currentTime.getDate(),
//       7,
//       35
//     );
//     const nightShiftStart = new Date(
//       currentTime.getFullYear(),
//       currentTime.getMonth(),
//       currentTime.getDate(),
//       19,
//       35
//     );
//     // Determine current shift

//     // Calculate working time
//     let workingTime = 0;

//     // Find the appropriate start and end times for the current time
//     let startTime: Date;
//     let endTime = currentTime;
//     if (shift === "day") {
//       startTime = dayShiftStart;
//       // console.log("day", startTime);
//       // console.log("end", endTime);
//     } else {
//       startTime = nightShiftStart;
//       // console.log("night", startTime);
//       // Handle cases where current time is past midnight (night shift)
//       if (currentTime < dayShiftStart) {
//         startTime.setDate(startTime.getDate() - 1); // Adjust for previous day
//       }
//     }

//     // Calculate difference between current time and start time (in minutes)
//     const diffInMinutes = dayjs(endTime).diff(dayjs(startTime), "minute");
//     console.log(diffInMinutes);

//     return diffInMinutes;
//   }

//   // Example usage
//   const now = new Date();
//   // const isOdd = true; // Change this to true or false as needed
//   const workingMinutes = getWorkingTime(now, isOdd);
//   const workingMinuteExcludeBrake = workingMinutes - brake_time_accum;

//   const ctTargetZone1 = GeneralStore((state) => state.ctTargetZone1);
//   const ctTargetZone2 = GeneralStore((state) => state.ctTargetZone2);

//   const targetZoneRate = zone === 1 ? ctTargetZone1 : ctTargetZone2;

//   const targetMq = (workingMinuteExcludeBrake * 60) / targetZoneRate;
//   if (zone === 1) {
//     setTargetRealTimeMC1(Math.floor(targetMq));
//   } else {
//     setTargetRealTimeMC2(Math.floor(targetMq));
//   }

//   useEffect(() => {
//     console.log("targetMQMC1", targetRealTimeMC1);
//     console.log("targetMQMC2", targetRealTimeMC2);
//   }, [targetRealTimeMC1, targetRealTimeMC2]);
//   return (
//     <Flex
//       style={{ height: "20%", width: "100%", display: "none" }}
//       gap={10}
//       align="center"
//       justify="center"
//     >
//       <Flex justify="center" align="center">
//         <Typography
//           style={{
//             textAlign: "center",
//             fontSize: "1.5rem",
//             color: shift === "day" ? "black" : "white",
//           }}
//         >
//           Target(100%) : &nbsp;
//         </Typography>
//         <Card
//           shadow="sm"
//           radius="sm"
//           style={{
//             background: "black",
//             height: "100%",
//             width: "10rem",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Typography
//             style={{
//               color: "white",
//               fontWeight: "600",
//               fontSize: "2rem",
//             }}
//           >
//             {dateString === currentDate ? targetMq.toFixed(0) : target}
//           </Typography>
//         </Card>
//       </Flex>
//       <Flex justify="center" align="center">
//         <Typography
//           style={{
//             textAlign: "center",
//             fontSize: "1.5rem",
//             color: shift === "day" ? "black" : "white",
//           }}
//         >
//           Actual :&nbsp;&nbsp;
//         </Typography>
//         <Card
//           shadow="sm"
//           radius="sm"
//           style={{
//             background: "black",
//             height: "100%",
//             width: "10rem",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Typography
//             style={{
//               color: "white",
//               fontWeight: "600",
//               fontSize: "2rem",
//             }}
//           >
//             {dateString === currentDate
//               ? zone === 1
//                 ? mqttDataMachine1.prod_actual
//                 : mqttDataMachine2.prod_actual
//               : actual}
//           </Typography>
//         </Card>
//       </Flex>
//       <Flex justify="center" align="center">
//         <Typography
//           style={{
//             textAlign: "center",
//             fontSize: "1.5rem",
//             color: shift === "day" ? "black" : "white",
//           }}
//         >
//           OA : &nbsp;
//         </Typography>
//         <Card
//           shadow="sm"
//           radius="sm"
//           style={{
//             background: "black",
//             height: "100%",
//             width: "10rem",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Typography
//             style={{
//               color: "white",
//               fontWeight: "600",
//               fontSize: "2rem",
//             }}
//           >
//             {dateString === currentDate
//               ? zone === 1
//                 ? ((mqttDataMachine1.prod_actual / targetMq) * 100).toFixed(2)
//                 : ((mqttDataMachine2.prod_actual / targetMq) * 100).toFixed(2)
//               : ((actual / target) * 100).toFixed(2)}
//           </Typography>
//         </Card>
//       </Flex>
//     </Flex>
//   );
// };

// export default MonitorData;
