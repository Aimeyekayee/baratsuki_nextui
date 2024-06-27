// import React from "react";
// import {
//   Card,
//   Chip,
//   Tooltip,
//   Tab,
//   Tabs,
//   Input,
//   Button,
// } from "@nextui-org/react";
// import { Divider } from "antd";
// import BaratsukiShiftColumn from "../chart/column/baratsuki.column";
// import { GeneralStore } from "@/store/general.store";
// import { QuestionCircleTwoTone } from "@ant-design/icons";
// import ColumnPlotTest from "../chart/column/main.column";
// import MonitorData from "../monitor/monitor.data";
// import { Empty } from "antd";
// import dayjs from "dayjs";
// import { AdjustCT } from "../input/adjustCT.input";
// import PercentOaBaratsuki from "../chart/line/percent.dot";
// import SunIcon from "@/asset/icon/SunIcon";
// import IconMoon from "@/asset/icon/MoonIcon";
// import { TwoRingShiftChart } from "../chart/ring/twoRingDayNight";
// import BaratsukiChallengeTab from "../tabs/baratsukichallenge.tabs";

// interface Data {
//   ct_actual: number;
//   prod_actual: number;
// }
// interface DataProps {
//   data: Data;
//   date: string;
//   line_id: number;
//   machine_no: string;
//   machine_name: string;
//   period: string;
//   section_code: number;
//   shift: string;
//   type: string;
//   value: number;
//   upper?: number;
//   lower?: number;
// }

// interface IProps {
//   zone: any[];
//   dataColumn: any[];
//   actual: number;
//   target: number;
//   zone_number: number;
//   realtimeActual: number;
// }

// const CardMainDisplay: React.FC<IProps> = ({
//   zone,
//   actual,
//   target,
//   dataColumn,
//   zone_number,
//   realtimeActual,
// }) => {
//   console.log("dataColumn", dataColumn);
//   console.log(zone);
//   const shift = GeneralStore((state) => state.shift);
//   const showGap = GeneralStore((state) => state.showGap);
//   const dateStrings = GeneralStore((state) => state.dateStrings);
//   const baratsukiRate = GeneralStore((state) => state.baratsukiRate);

//   const capitalizedShift =
//     String(shift).charAt(0).toUpperCase() + String(shift).slice(1);

//   const currentDate = dayjs().format("YYYY-MM-DD");
//   //! this is so static please create logic after
//   const dataRealtime = [
//     { shift: "day", actual: realtimeActual },
//     { shift: "night", actual: 0 },
//   ];

//   const prodActualByTime = (time: string, zone_number: number) => {
//     if (zone_number === 1) {
//       const data = dataColumn.find(
//         (item) => dayjs(item.date).format("HH:mm:ss") === time
//       );
//       return data ? data.data.prod_actual : "N/A";
//     } else {
//       const data = dataColumn.find(
//         (item) => dayjs(item.date).format("HH:mm:ss") === time
//       );
//       return data ? data.data.prod_actual : "N/A";
//     }
//   };

//   const prodActual1920 = prodActualByTime("19:20:00", zone_number);
//   const prodActual0720 = prodActualByTime("07:20:00", zone_number);

//   const targetNotRealTimeMC1 = GeneralStore(
//     (state) => state.targetNotRealTimeMC1
//   );
//   const targetNotRealTimeMC2 = GeneralStore(
//     (state) => state.targetNotRealTimeMC2
//   );
//   const targetRealTimeMC1 = GeneralStore((state) => state.targetRealTimeMC1);
//   const targetRealTimeMC2 = GeneralStore((state) => state.targetRealTimeMC2);

//   type TargetKeys = 77 | 81 | 85 | 100;

//   const oaMinMc1Day = GeneralStore((state) => state.oaMinMc1Day);
//   const oaMaxMc1Day = GeneralStore((state) => state.oaMaxMc1Day);
//   const oaMinMc2Day = GeneralStore((state) => state.oaMinMc2Day);
//   const oaMaxMc2Day = GeneralStore((state) => state.oaMaxMc2Day);
//   const oaMinMc1Night = GeneralStore((state) => state.oaMinMc1Night);
//   const oaMaxMc1Night = GeneralStore((state) => state.oaMaxMc1Night);
//   const oaMinMc2Night = GeneralStore((state) => state.oaMinMc2Night);
//   const oaMaxMc2Night = GeneralStore((state) => state.oaMaxMc2Night);
//   const ctTargetZone1 = GeneralStore((state) => state.ctTargetZone1);
//   const ctTargetZone2 = GeneralStore((state) => state.ctTargetZone2);
//   const baratsukiRateNumber = Number(baratsukiRate) as TargetKeys;

//   const determineTarget = (currentDate: string, zone_number: number) => {
//     if (currentDate === dateStrings) {
//       if (zone_number === 1) {
//         return targetRealTimeMC1;
//       } else {
//         return targetRealTimeMC2;
//       }
//     } else {
//       if (zone_number === 1) {
//         return Math.floor(targetNotRealTimeMC1 - 600 / ctTargetZone1);
//       } else {
//         return Math.floor(targetNotRealTimeMC2 - 600 / ctTargetZone2);
//       }
//     }
//   };
//   console.log("data Column", dataColumn);
//   return (
//     <Card
//       shadow="md"
//       style={{
//         width: "100%",
//         height: "100%",
//         padding: "1rem 2rem 2rem 2rem",
//         display: "flex",
//         flexDirection: "column",
//         gap: "1rem",
//         justifyContent: "center",
//         alignItems: "center",
//         background: shift === "day" ? "white" : "#182228",
//       }}
//     >
//       <div style={{ height: "2rem" }}>
//         <Chip color="warning" variant="flat" size="lg">
//           <p className="font-semibold">
//             Zone : {zone[0]?.machine_no} - {zone[0]?.machine_name} (
//             {capitalizedShift})
//           </p>
//         </Chip>
//       </div>
//       {zone.length > 0 ? (
//         <div
//           style={{
//             width: "100%",
//             height: "calc(100% - 2rem)",
//             display: "flex",
//             gap: "2rem",
//           }}
//         >
//           <Card
//             style={{
//               width: "30%",
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               gap: "1rem",
//               padding: "2rem 0rem 1rem 0rem",
//               background: shift === "day" ? "white" : "rgba(251,255,255,0.2)",
//             }}
//           >
//             <p
//               style={{
//                 fontSize: "1.5rem",
//                 fontWeight: "bold",
//                 color: shift === "day" ? "black" : "white",
//               }}
//             >
//               <Tooltip content="Click at Column to change view to that shift.">
//                 <QuestionCircleTwoTone style={{ fontSize: "1.5rem" }} />
//               </Tooltip>
//               &nbsp;OA By Shift
//             </p>
//             <div className="flex items-center justify-center">
//               <BaratsukiChallengeTab />
//             </div>
//             <div className="flex flex-col gap-2">
//               <TwoRingShiftChart
//                 parameter={dataColumn}
//                 zone_number={zone_number}
//                 parameter_static_realtime={dataRealtime}
//               />
//               <div className="flex flex-col justify-center items-center">
//                 <div className="flex gap-4 justify-center items-center">
//                   <div
//                     className="flex flex-col justify-center items-center"
//                     style={{ width: "49.5%" }}
//                   >
//                     <div className="flex">
//                       <p>Actual :&nbsp;</p>
//                       <p className="font-semibold">
//                         {currentDate !== dateStrings
//                           ? prodActual1920
//                           : realtimeActual}
//                       </p>
//                     </div>
//                     <div className="flex">
//                       <p>Target :&nbsp;</p>
//                       <p className="font-semibold">
//                         {determineTarget(currentDate, zone_number)}
//                       </p>
//                     </div>{" "}
//                     <div className="flex">
//                       <p>Baratsuki&nbsp;:&nbsp;</p>
//                       <p className="font-semibold">
//                         {zone_number === 1
//                           ? `${(oaMaxMc1Day - oaMinMc1Day).toFixed(2)}%`
//                           : `${(oaMaxMc2Day - oaMinMc2Day).toFixed(2)}%`}
//                       </p>
//                     </div>
//                   </div>
//                   <div style={{ width: "1%" }}>
//                     <Divider
//                       type="vertical"
//                       style={{
//                         height: "5rem",
//                         fontSize: "3rem",
//                         border: `1.5px solid ${
//                           shift === "day" ? "rgba(0, 0, 0, 0.2)" : "white"
//                         }`,
//                         borderStyle: "dashed",
//                       }}
//                       dashed
//                     />
//                   </div>
//                   <div
//                     className="flex flex-col justify-center items-center"
//                     style={{ width: "49.5%" }}
//                   >
//                     <div className="flex">
//                       <p>Actual :&nbsp;</p>
//                       <p className="font-semibold">
//                         {dateStrings !== currentDate ? prodActual0720 : "-"}
//                       </p>
//                     </div>
//                     <div className="flex">
//                       <p>Target :&nbsp;</p>
//                       <p className="font-semibold">
//                         {dateStrings !== currentDate
//                           ? determineTarget(currentDate, zone_number)
//                           : "-"}
//                       </p>
//                     </div>
//                     <div className="flex">
//                       <p>Baratsuki&nbsp;:&nbsp;</p>
//                       <p className="font-semibold">
//                         {dateStrings !== currentDate
//                           ? zone_number === 1
//                             ? `${(oaMaxMc1Night - oaMinMc1Night).toFixed(2)}%`
//                             : `${(oaMaxMc2Night - oaMinMc2Night).toFixed(2)}%`
//                           : "-"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <AdjustCT zone_number={zone_number} />
//               </div>
//             </div>
//             <div style={{ height: "25rem" }}>
//               <BaratsukiShiftColumn
//                 parameter={dataColumn}
//                 parameter_static_realtime={dataRealtime}
//                 zone_number={zone_number}
//               />
//             </div>
//           </Card>
//           <div
//             style={{
//               height: "100%",
//               width: "70%",
//               display: "flex",
//               flexDirection: "column",
//               textAlign: "right",
//               gap: "1rem",
//             }}
//           >
//             <div className="flex justify-between items-center">
//               {/* <div className="flex justify-center items-center">
//                 <div className="flex">
//                   <p
//                     className="flex items-center"
//                     style={{
//                       paddingLeft: "1.7rem",
//                       color: shift === "day" ? "black" : "white",
//                     }}
//                   >
//                     Show Gap :&nbsp;
//                   </p>
//                 </div>
//                 <Tabs
//                   aria-label="Tabs sizes"
//                   size="sm"
//                   selectedKey={showGap}
//                   onSelectionChange={setShowGap}
//                 >
//                   <Tab key="on" title="On" />
//                   <Tab key="off" title="Off" />
//                 </Tabs>
//               </div> */}
//               {/* <div className="flex">
//                 <p>{shift === "day" ? "Day Shift" : "Night Shift"}</p>
//               </div> */}
//               <p
//                 style={{
//                   fontSize: "1.5rem",
//                   fontWeight: "bold",
//                   color: shift === "day" ? "black" : "white",
//                 }}
//               >
//                 <Tooltip content="asda">
//                   <QuestionCircleTwoTone style={{ fontSize: "1.5rem" }} />
//                 </Tooltip>
//                 &nbsp;By Period-Working
//               </p>
//               <div className="flex gap-2">
//                 <Chip
//                   color="danger"
//                   variant="dot"
//                   classNames={{
//                     base: "bg-red-200 border-0",
//                     content: "text-black ",
//                   }}
//                 >
//                   จำนวนชิ้นงานในชั่วโมงการผลิตไม่อยู่ในเกณฑ์ที่ยอมรับได้ ({"<"}
//                   {Number(baratsukiRate)}%)
//                 </Chip>
//                 <Chip
//                   variant="dot"
//                   color="primary"
//                   classNames={{
//                     base: "bg-blue-200 border-0",
//                     content: "text-black ",
//                   }}
//                 >
//                   จำนวนชิ้นงานในชั่วโมงการผลิตอยู่ในเกณฑ์ที่ยอมรับได้ (
//                   {Number(baratsukiRate)}% - 100%)
//                 </Chip>
//               </div>
//             </div>
//             <div className="flex flex-col  gap-4">
//               <div className="h-80">
//                 <div style={{ height: "100%" }}>
//                   <PercentOaBaratsuki
//                     parameter={zone}
//                     zone_number={zone_number}
//                   />
//                 </div>
//               </div>
//               <p className="text-center font-light">
//                 You&apos;re watching &apos;Performance Analysis&apos; of {shift}
//                 &nbsp;shift
//               </p>
//               <div style={{ height: "28rem" }}>
//                 <ColumnPlotTest parameter={zone} zone_number={zone_number} />
//               </div>
//             </div>
//             <MonitorData
//               actual={actual}
//               target={target}
//               dateString={dateStrings}
//               currentDate={currentDate}
//               zone={zone_number}
//             />
//           </div>
//         </div>
//       ) : (
//         <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
//       )}
//     </Card>
//   );
// };

// export default CardMainDisplay;
