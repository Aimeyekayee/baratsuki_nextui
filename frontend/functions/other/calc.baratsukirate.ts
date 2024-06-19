// import axios from "axios";
// import { GeneralStore } from "@/store/general.store";
// import {
//   dayShiftTimes1,
//   dayShiftTimes2,
//   nightShiftTimes1,
//   nightShiftTimes2,
//   periodsToExclude1,
//   periodsToExclude2,
// } from "@/utils/period";
// interface Params {
//   section_code: number;
//   line_id: number | undefined;
//   machine_no1: any;
//   machine_no2: any;
//   date_current: string | string[];
//   next_date: string;
//   isOdd?: boolean;
//   shift?: string;
// }

// export async function CalBaratsukiDay(params: Params): Promise<any[]> {
//   const {
//     isOdd,
//     shift,
//     setTargetNotRealTimeMC1,
//     setTargetNotRealTimeMC2,
//     setZone1,
//     setZone2,
//     setActualNotRealTimeMC1,
//     setActualNotRealTimeMC2,
//   } = GeneralStore.getState();
//   //!   "http://127.0.0.1:8000/get_dataparameter_day"
//   const response = await axios.get(
//     "http://127.0.0.1:8000/get_dataparameter_day",
//     {
//       params: params,
//     }
//   );
//   if (response.status === 200) {
//     console.log(response.data);
//     const result = response.data;
//     console.log(result);

//     const uniqueMachines = Array.from(
//       new Set(result.map((item: any) => item.machine_no))
//     );
//     console.log(uniqueMachines);

//     uniqueMachines.sort((a: any, b: any) =>
//       a.toString().localeCompare(b.toString())
//     );
//     const machineNo1Results: any[] = [];
//     const machineNo2Results: any[] = [];

//     result.forEach((item: any) => {
//       if (item.machine_no === uniqueMachines[0]) {
//         machineNo1Results.push(item);
//       } else if (item.machine_no === uniqueMachines[1]) {
//         machineNo2Results.push(item);
//       }
//     });

//     console.log("mc1_result_day", machineNo1Results);
//     console.log("mc2_result_day", machineNo2Results);

//     let previousDayValueMc1 = 0;
//     let previousNightValueMc1 = 0;
//     let previousDayValueMc2 = 0;
//     let previousNightValueMc2 = 0;

//     console.log(machineNo1Results);

//     machineNo1Results.forEach((entry, index) => {
//       const time = new Date(entry.date).toLocaleTimeString("en-US", {
//         hour12: false,
//       });
//       const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
//       const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
//       const isDayShift = dayShiftTimes.includes(time);
//       const isNightShift = nightShiftTimes.includes(time);
//       entry.shift = isDayShift ? "day" : "night";

//       if (isDayShift) {
//         if (
//           time === (isOdd ? "09:40:00" : "09:30:00") ||
//           time === (isOdd ? "12:15:00" : "12:30:00") ||
//           time === (isOdd ? "14:40:00" : "14:30:00") ||
//           time === "16:50:00"
//         ) {
//           entry.value = index > 0 ? machineNo1Results[index - 1].value : 0;
//         } else {
//           entry.value = entry.data.prod_actual - previousDayValueMc1;
//           previousDayValueMc1 = entry.data.prod_actual;
//         }
//       }
//       entry.period = time;
//       entry.type = "actual";
//       entry.zone_number = 1;
//       console.log(entry);
//     });
//     console.log(machineNo1Results);

//     machineNo2Results.forEach((entry, index) => {
//       const time = new Date(entry.date).toLocaleTimeString("en-US", {
//         hour12: false,
//       });
//       const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
//       const isDayShift = dayShiftTimes.includes(time);
//       const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
//       const isNightShift = nightShiftTimes.includes(time);

//       entry.shift = isDayShift ? "day" : "night";

//       if (isDayShift) {
//         if (
//           time === (isOdd ? "09:40:00" : "09:30:00") ||
//           time === (isOdd ? "12:15:00" : "12:30:00") ||
//           time === (isOdd ? "14:40:00" : "14:30:00") ||
//           time === "16:50:00"
//         ) {
//           entry.value = index > 0 ? machineNo2Results[index - 1].value : 0;
//         } else {
//           entry.value = entry.data.prod_actual - previousDayValueMc2;
//           previousDayValueMc2 = entry.data.prod_actual;
//         }
//       }

//       entry.period = time;
//       entry.type = "actual";
//       entry.zone_number = 2;
//       console.log(entry);
//     });

//     const results1 = machineNo1Results.filter(
//       (item: any) => item.shift === shift
//     );
//     const results2 = machineNo2Results.filter(
//       (item: any) => item.shift === shift
//     );

//     const excludedPeriods = ["07:35:00", "19:35:00"];

//     const filteredResults1 = results1.filter(
//       (item: any) => !excludedPeriods.includes(item.period)
//     );
//     console.log(filteredResults1);
//     const filteredResults2 = results2.filter(
//       (item: any) => !excludedPeriods.includes(item.period)
//     );
//     console.log(filteredResults2);

//     const periodsToExclude = isOdd ? periodsToExclude1 : periodsToExclude2;

//     const sumOfNumbers1 = filteredResults1.reduce(
//       (accumulator, currentValue) => {
//         if (!periodsToExclude.includes(currentValue.period)) {
//           return accumulator + currentValue.value;
//         } else {
//           return accumulator;
//         }
//       },
//       0
//     );

//     const sumOfNumbers2 = filteredResults2.reduce(
//       (accumulator, currentValue) => {
//         if (!periodsToExclude.includes(currentValue.period)) {
//           return accumulator + currentValue.value;
//         } else {
//           return accumulator;
//         }
//       },
//       0
//     );

//     console.log("filterRes2", filteredResults2);

//     console.log("res1", results1);
//     console.log("res2", results2);
//     const returnData = [
//       { zone1: filteredResults1 },
//       { zone2: filteredResults2 },
//     ];
//     //!----------------------------zone1-------------------------
//     const formattedData1 = filteredResults1.map((entry) => {
//       const period = entry.period.slice(0, -3); // Remove the last three characters (":00")
//       return { ...entry, period };
//     });
//     const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
//     const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;

//     const ctTargetZone1 = GeneralStore((state) => state.ctTargetZone1);
//     const ctTargetZone2 = GeneralStore((state) => state.ctTargetZone2);

//     const ctTarget1 = ctTargetZone1
//     const ctTarget2 = ctTargetZone2;
//     const updatePeriod = (period: string, shift: string): string => {
//       let index = -1;
//       if (shift === "day") {
//         index = dayShiftTimes.indexOf(period);
//         if (index !== -1 && index > 0) {
//           return `${dayShiftTimes[index - 1]} - ${period}`;
//         }
//       } else if (shift === "night") {
//         index = nightShiftTimes.indexOf(period);
//         if (index !== -1 && index > 0) {
//           return `${nightShiftTimes[index - 1]} - ${period}`;
//         }
//       }
//       return period;
//     };
//     const excludedTitles1 = [
//       "09:30 - 09:40",
//       "11:15 - 12:15",
//       "14:30 - 14:40",
//       "21:30 - 21:40",
//       "23:15 - 00:05",
//       "02:30 - 02:50",
//       "04:30 - 04:50",
//       "16:30 - 16:50",
//     ];
//     const excludedTitles2 = [
//       "09:20 - 09:30",
//       "11:30 - 12:30",
//       "14:20 - 14:30",
//       "21:30 - 21:40",
//       "23:30 - 00:20",
//       "02:30 - 02:50",
//       "04:30 - 04:50",
//       "16:30 - 16:50",
//     ];
//     const excludedTitles = isOdd ? excludedTitles1 : excludedTitles2;
//     const updatedParameter1 = formattedData1.map((item) => ({
//       ...item,
//       period: updatePeriod(item.period, item.shift),
//     }));
//     updatedParameter1.forEach((item) => {
//       if (excludedTitles.includes(item.period)) {
//         item.value = 0;
//       }
//     });

//     const period1 = [
//       {
//         periodTime: "07:35 - 08:30",
//         time: 3300,
//         status: 1,
//       },
//       {
//         periodTime: "08:30 - 09:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "09:30 - 09:40", time: 600, status: 2 },
//       {
//         periodTime: "09:40 - 10:30",
//         time: 3000,
//       },
//       {
//         periodTime: "10:30 - 11:15",
//         time: 2700,
//         status: 1,
//       },
//       { periodTime: "11:15 - 12:15", time: 3600, status: 3 },
//       {
//         periodTime: "12:15 - 13:30",
//         time: 4500,
//         status: 1,
//       },
//       {
//         periodTime: "13:30 - 14:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "14:30 - 14:40", time: 600, status: 2 },
//       {
//         periodTime: "14:40 - 15:30",
//         time: 3000,
//         status: 1,
//       },
//       {
//         periodTime: "15:30 - 16:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
//       {
//         periodTime: "16:50 - 17:50",
//         time: 3600,
//         status: 1,
//       },
//       {
//         periodTime: "17:50 - 19:20",
//         time: 5400,
//         status: 1,
//       },
//       {
//         periodTime: "19:35 - 20:30",
//         time: 3300,
//         status: 1,
//       },
//       {
//         periodTime: "20:30 - 21:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "21:30 - 21:40", time: 600, status: 2 },
//       {
//         periodTime: "21:40 - 22:30",
//         time: 3000,
//         status: 1,
//       },
//       {
//         periodTime: "22:30 - 23:15",
//         time: 2700,
//         status: 1,
//       },
//       { periodTime: "23:15 - 00:05", time: 3000, status: 3 },
//       {
//         periodTime: "00:05 - 01:30",
//         time: 5100,
//         status: 1,
//       },
//       {
//         periodTime: "01:30 - 02:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
//       {
//         periodTime: "02:50 - 03:30",
//         time: 2400,
//         status: 1,
//       },
//       {
//         periodTime: "03:30 - 04:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
//       {
//         periodTime: "04:50 - 05:50",
//         time: 3600,
//         status: 1,
//       },
//       {
//         periodTime: "05:50 - 07:20",
//         time: 5400,
//         status: 1,
//       },
//     ];
//     const period1_aftermap = period1.map((item) => {
//       if (item.status === 2 || item.status === 3) {
//         return { ...item, upper: 0, lower: 0 };
//       } else {
//         return {
//           ...item,
//           upper: Math.floor((item.time / ctTarget1) * targetUpper),
//           lower: Math.floor((item.time / ctTarget1) * targetLower),
//         };
//       }
//     });
//     const period2 = [
//       {
//         periodTime: "07:35 - 08:30",
//         time: 3300,
//         status: 1,
//       },
//       {
//         periodTime: "08:30 - 09:20",
//         time: 3000,
//         status: 1,
//       },
//       { periodTime: "09:20 - 09:30", time: 600, status: 2 },
//       {
//         periodTime: "09:30 - 10:30",
//         time: 3600,
//         status: 1,
//       },
//       {
//         periodTime: "10:30 - 11:30",
//         time: 3600,
//       },
//       { periodTime: "11:30 - 12:30", time: 3600, status: 3 },
//       {
//         periodTime: "12:30 - 13:30",
//         time: 3600,
//         status: 1,
//       },
//       {
//         periodTime: "13:30 - 14:20",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "14:20 - 14:30", time: 600, status: 2 },
//       {
//         periodTime: "14:30 - 15:30",
//         time: 3600,
//         status: 1,
//       },
//       {
//         periodTime: "15:30 - 16:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
//       {
//         periodTime: "16:50 - 17:50",
//         time: 3600,
//         status: 1,
//       },
//       {
//         periodTime: "17:50 - 19:20",
//         time: 5400,
//         status: 1,
//       },
//       {
//         periodTime: "19:35 - 20:30",
//         time: 3300,
//       },
//       {
//         periodTime: "20:30 - 21:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "21:30 - 21:40", time: 600, status: 2 },
//       {
//         periodTime: "21:40 - 22:30",
//         time: 3000,
//         status: 1,
//       },
//       {
//         periodTime: "22:30 - 23:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "23:30 - 00:20", time: 3000, status: 3 },
//       {
//         periodTime: "00:20 - 01:30",
//         time: 4200,
//         status: 1,
//       },
//       {
//         periodTime: "01:30 - 02:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
//       {
//         periodTime: "02:50 - 03:30",
//         time: 2400,
//         status: 1,
//       },
//       {
//         periodTime: "03:30 - 04:30",
//         time: 3600,
//         status: 1,
//       },
//       { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
//       {
//         periodTime: "04:50 - 05:50",
//         time: 3600,
//         status: 1,
//       },
//       {
//         periodTime: "05:50 - 07:20",
//         time: 5400,
//         status: 1,
//       },
//     ];
//     const period2_aftermap = period2.map((item: any) => {
//       if (item.status === 2 || item.status === 3) {
//         return { ...item, upper: 0, lower: 0 };
//       } else {
//         return {
//           ...item,
//           upper: Math.floor((item.time / ctTarget) * targetUpper),
//           lower: Math.floor((item.time / ctTarget) * targetLower),
//         };
//       }
//     });

//     const period = isOdd ? period1_aftermap : period2_aftermap;

//     updatedParameter1.forEach((item: any) => {
//       const matchingPeriod = period.find(
//         (periodItem) => periodItem.periodTime === item.period
//       );
//       if (matchingPeriod) {
//         item.upper = matchingPeriod.upper;
//         item.lower = matchingPeriod.lower;
//         if (item.value >= item.lower && item.value <= item.upper) {
//           item.color = "red";
//         } else {
//           item.color = "green";
//         }
//       }
//     });

//     const graphData1 = updatedParameter1?.map((update) => {
//       const matchingPeriod = period.find(
//         (periodItem) => periodItem.periodTime === update.period
//       );
//       if (matchingPeriod) {
//         update.upper = matchingPeriod.upper;
//         update.lower = matchingPeriod.lower;
//       }
//       return update; // Return the updated object
//     });
//     for (let i = 1; i < graphData1.length; i++) {
//       const currentPeriod = graphData1[i].period;
//       const currentProdActual = graphData1[i].data.prod_actual;
//       const previousProdActual = graphData1[i - 1].data.prod_actual;

//       if (periodsRest.includes(currentPeriod)) {
//         graphData1[i].value = 0;
//       } else {
//         graphData1[i].value = currentProdActual - previousProdActual;
//       }
//     }

//     console.log(graphData1);

//     //!----------------------------zone1-------------------------
//     return returnData;
//   } else {
//     return response.data;
//   }
// }
