import axios from "axios";
import dayjs from "dayjs";
import {
  nightShiftTimes1,
  dayShiftTimes1,
  dayShiftTimes2,
  nightShiftTimes2,
  periodsToExclude1,
  periodsToExclude2,
} from "@/utils/period";
import { GeneralStore } from "@/store/general.store";

interface Params {
  section_code: number;
  line_id: number | undefined;
  machine_no1: any;
  machine_no2: any;
  date_current: string | string[];
  next_date: string;
  isOdd?: boolean;
  shift?: string;
}

interface Data {
  ct_actual: number;
  prod_actual: number;
}
interface DataProps {
  data: Data;
  date_working: string;
  line_id: number;
  machine_no: string;
  machine_name?: string;
  period: string;
  section_code: number;
  shift: string;
  type: string;
  value: number;
  upper?: number;
  lower?: number;
  zone_number?: number;
}

export async function requestDataDay(params: Params): Promise<any[]> {
  const {
    isOdd,
    shift,
    setTargetNotRealTimeMC1,
    setTargetNotRealTimeMC2,
    setZone1,
    setZone2,
    setActualNotRealTimeMC1,
    setActualNotRealTimeMC2,
  } = GeneralStore.getState();
  //!   "http://127.0.0.1:8000/get_dataparameter_day"
  const response = await axios.get(
    "http://127.0.0.1:8000/get_dataparameter_day",
    {
      params: params,
    }
  );
  if (response.status === 200) {
    console.log(response.data);
    const result = response.data;
    console.log(result);

    const uniqueMachines = Array.from(
      new Set(result.map((item: any) => item.machine_no))
    );
    console.log(uniqueMachines);

    uniqueMachines.sort((a: any, b: any) =>
      a.toString().localeCompare(b.toString())
    );
    const machineNo1Results: any[] = [];
    const machineNo2Results: any[] = [];

    result.forEach((item: any) => {
      if (item.machine_no === uniqueMachines[0]) {
        machineNo1Results.push(item);
      } else if (item.machine_no === uniqueMachines[1]) {
        machineNo2Results.push(item);
      }
    });

    console.log("mc1_result_day", machineNo1Results);
    console.log("mc2_result_day", machineNo2Results);

    let previousDayValueMc1 = 0;
    let previousNightValueMc1 = 0;
    let previousDayValueMc2 = 0;
    let previousNightValueMc2 = 0;

    console.log(machineNo1Results);

    machineNo1Results.forEach((entry, index) => {
      const time = new Date(entry.date).toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
      const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
      const isDayShift = dayShiftTimes.includes(time);
      const isNightShift = nightShiftTimes.includes(time);
      entry.shift = isDayShift ? "day" : "night";

      if (isDayShift) {
        if (
          time === (isOdd ? "09:40:00" : "09:30:00") ||
          time === (isOdd ? "12:15:00" : "12:30:00") ||
          time === (isOdd ? "14:40:00" : "14:30:00") ||
          time === "16:50:00"
        ) {
          entry.value = index > 0 ? machineNo1Results[index - 1].value : 0;
        } else {
          entry.value = entry.data.prod_actual - previousDayValueMc1;
          previousDayValueMc1 = entry.data.prod_actual;
        }
      }
      entry.period = time;
      entry.type = "actual";
      entry.zone_number = 1;
      console.log(entry);
    });
    console.log(machineNo1Results);

    machineNo2Results.forEach((entry, index) => {
      const time = new Date(entry.date).toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
      const isDayShift = dayShiftTimes.includes(time);
      const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
      const isNightShift = nightShiftTimes.includes(time);

      entry.shift = isDayShift ? "day" : "night";

      if (isDayShift) {
        if (
          time === (isOdd ? "09:40:00" : "09:30:00") ||
          time === (isOdd ? "12:15:00" : "12:30:00") ||
          time === (isOdd ? "14:40:00" : "14:30:00") ||
          time === "16:50:00"
        ) {
          entry.value = index > 0 ? machineNo2Results[index - 1].value : 0;
        } else {
          entry.value = entry.data.prod_actual - previousDayValueMc2;
          previousDayValueMc2 = entry.data.prod_actual;
        }
      }

      entry.period = time;
      entry.type = "actual";
      entry.zone_number = 2;
      console.log(entry);
    });

    const results1 = machineNo1Results.filter(
      (item: any) => item.shift === shift
    );
    const results2 = machineNo2Results.filter(
      (item: any) => item.shift === shift
    );

    const excludedPeriods = ["07:35:00", "19:35:00"];

    const filteredResults1 = results1.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    console.log(filteredResults1);
    const filteredResults2 = results2.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    console.log(filteredResults2);

    if (shift === "day") {
      setZone1(filteredResults1);
      setTargetNotRealTimeMC1();
    } else {
    }

    const periodsToExclude = isOdd ? periodsToExclude1 : periodsToExclude2;

    const sumOfNumbers1 = filteredResults1.reduce(
      (accumulator, currentValue) => {
        if (!periodsToExclude.includes(currentValue.period)) {
          return accumulator + currentValue.value;
        } else {
          return accumulator;
        }
      },
      0
    );

    const sumOfNumbers2 = filteredResults2.reduce(
      (accumulator, currentValue) => {
        if (!periodsToExclude.includes(currentValue.period)) {
          return accumulator + currentValue.value;
        } else {
          return accumulator;
        }
      },
      0
    );

    if (shift === "day") {
      setZone2(filteredResults2);
      setActualNotRealTimeMC1(sumOfNumbers1);
      setActualNotRealTimeMC2(sumOfNumbers2);
      setTargetNotRealTimeMC2();
    } else {
    }

    console.log("filterRes2", filteredResults2);
    console.log("filterRes1", filteredResults1);

    console.log("res1", results1);
    console.log("res2", results2);
    const returnData = [
      { zone1: filteredResults1 },
      { zone2: filteredResults2 },
    ];
    return returnData;
  } else {
    return response.data;
  }
}

export async function requestDataNight(params: Params): Promise<any[]> {
  const {
    isOdd,
    shift,
    setTargetNotRealTimeMC1,
    setTargetNotRealTimeMC2,
    setZone1,
    setZone2,
    setActualNotRealTimeMC1,
    setActualNotRealTimeMC2,
  } = GeneralStore.getState();

  const response = await axios.get(
    "http://127.0.0.1:8000/get_dataparameter_night",
    {
      params: params,
    }
  );
  if (response.status === 200) {
    console.log(response.data);
    const result = response.data;
    console.log(result);

    const uniqueMachines = Array.from(
      new Set(result.map((item: any) => item.machine_no))
    );
    console.log(uniqueMachines);

    uniqueMachines.sort((a: any, b: any) =>
      a.toString().localeCompare(b.toString())
    );
    const machineNo1Results: any[] = [];
    const machineNo2Results: any[] = [];

    result.forEach((item: any) => {
      if (item.machine_no === uniqueMachines[0]) {
        machineNo1Results.push(item);
      } else if (item.machine_no === uniqueMachines[1]) {
        machineNo2Results.push(item);
      }
    });

    console.log("mc1_result_night", machineNo1Results);
    console.log("mc2_result_night", machineNo2Results);

    let previousDayValueMc1 = 0;
    let previousNightValueMc1 = 0;
    let previousDayValueMc2 = 0;
    let previousNightValueMc2 = 0;

    console.log(machineNo1Results);

    machineNo1Results.forEach((entry, index) => {
      const time = new Date(entry.date).toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
      const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
      const isDayShift = dayShiftTimes.includes(time);
      const isNightShift = nightShiftTimes.includes(time);
      entry.shift = isDayShift ? "day" : "night";

      if (isNightShift) {
        if (
          time === "21:40:00" ||
          time === (isOdd ? "00:05:00" : "00:20:00") ||
          time === "02:50:00" ||
          time === "04:50:00"
        ) {
          entry.value = index > 0 ? machineNo1Results[index - 1].value : 0;
        } else {
          entry.value =
            time === "19:35:00"
              ? 0
              : entry.data.prod_actual - previousNightValueMc1;
          previousNightValueMc1 = entry.data.prod_actual;
        }
      }
      entry.period = time;
      entry.type = "actual";
      console.log(entry);
    });
    console.log(machineNo1Results);

    machineNo2Results.forEach((entry, index) => {
      const time = new Date(entry.date).toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
      const isDayShift = dayShiftTimes.includes(time);
      const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
      const isNightShift = nightShiftTimes.includes(time);

      entry.shift = isDayShift ? "day" : "night";

      if (isNightShift) {
        if (
          time === "21:40:00" ||
          time === (isOdd ? "00:05:00" : "00:20:00") ||
          time === "02:50:00" ||
          time === "04:50:00"
        ) {
          entry.value = index > 0 ? machineNo2Results[index - 1].value : 0;
        } else {
          entry.value =
            time === "19:35:00"
              ? 0
              : entry.data.prod_actual - previousNightValueMc2;
          previousNightValueMc2 = entry.data.prod_actual;
        }
      }

      entry.period = time;
      entry.type = "actual";
      console.log(entry);
    });

    const results1 = machineNo1Results.filter(
      (item: any) => item.shift === shift
    );
    const results2 = machineNo2Results.filter(
      (item: any) => item.shift === shift
    );

    const excludedPeriods = ["07:35:00", "19:35:00"];

    const filteredResults1 = results1.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    const filteredResults2 = results2.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    console.log(filteredResults1);
    if (shift === "night") {
      setZone1(filteredResults1);
    } else {
    }
    const periodsToExclude = isOdd ? periodsToExclude1 : periodsToExclude2;

    const sumOfNumbers1 = filteredResults1.reduce(
      (accumulator, currentValue) => {
        if (!periodsToExclude.includes(currentValue.period)) {
          return accumulator + currentValue.value;
        } else {
          return accumulator;
        }
      },
      0
    );
    console.log(sumOfNumbers1);
    const sumOfNumbers2 = filteredResults2.reduce(
      (accumulator, currentValue) => {
        if (!periodsToExclude.includes(currentValue.period)) {
          return accumulator + currentValue.value;
        } else {
          return accumulator;
        }
      },
      0
    );
    if (shift === "night") {
      setZone2(filteredResults2);
      setActualNotRealTimeMC1(sumOfNumbers1);
      setActualNotRealTimeMC2(sumOfNumbers2);
    } else {
    }

    console.log("filterRes2", filteredResults2);

    console.log("res1", results1);
    console.log("res2", results2);
    const returnData = [
      { zone1: filteredResults1 },
      { zone2: filteredResults2 },
    ];

    return returnData;
  } else {
    return response.data;
  }
}

export async function requestDataByShiftColumn(params: Params): Promise<any[]> {
  const { setDataByShiftColumnMC1, setDataByShiftColumnMC2 } =
    GeneralStore.getState();
  console.log("eie", params);
  const response = await axios.get(
    "http://127.0.0.1:8000/get_dataparameter_by_shift_column",
    {
      params: params,
    }
  );
  if (response.status === 200) {
    const result = response.data;

    const timesToCompare = [
      { time1: "16:50:00", time2: "19:20:00" },
      { time1: "04:50:00", time2: "07:20:00" },
    ];
    result.forEach((obj: any) => {
      obj.ot = true; // Default value
    });

    timesToCompare.forEach((pair) => {
      const { time1, time2 } = pair;

      const itemsToCompare = result.filter((item: any) => {
        const itemTime = item.date.split("T")[1];
        return itemTime === time1 || itemTime === time2;
      });

      const groupedByDateAndMachine = itemsToCompare.reduce(
        (acc: any, item: any) => {
          const key = `${item.date.split("T")[0]}-${item.machine_name}`;
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(item);
          return acc;
        },
        {}
      );

      Object.values(groupedByDateAndMachine).forEach((group: any) => {
        if (group.length === 2) {
          const [item1, item2] = group;
          const isEqual = item1.data.prod_actual === item2.data.prod_actual;
          item1.ot = item2.ot = !isEqual;
        }
      });
    });
    const filteredResult = result.filter((item: any) => {
      const itemTime = item.date.split("T")[1];
      return itemTime !== "16:50:00" && itemTime !== "04:50:00";
    });
    console.log(filteredResult);

    const uniqueMachines = Array.from(
      new Set(filteredResult.map((item: any) => item.machine_no))
    );
    console.log(uniqueMachines);

    uniqueMachines.sort((a: any, b: any) =>
      a.toString().localeCompare(b.toString())
    );
    const machineNo1Results: any[] = [];
    const machineNo2Results: any[] = [];

    filteredResult.forEach((item: any) => {
      if (item.machine_no === uniqueMachines[0]) {
        machineNo1Results.push(item);
      } else if (item.machine_no === uniqueMachines[1]) {
        machineNo2Results.push(item);
      }
    });
    setDataByShiftColumnMC1(machineNo1Results);
    setDataByShiftColumnMC2(machineNo2Results);
  }
  return response.data;
}

export async function calBaratsukiDay(params: Params): Promise<any[]> {
  const { isOdd, shift } = GeneralStore.getState();
  const response = await axios.get(
    "http://127.0.0.1:8000/get_dataparameter_day",
    {
      params: params,
    }
  );
  if (response.status === 200) {
    const result = response.data;
    console.log(result);

    const uniqueMachines = Array.from(
      new Set(result.map((item: any) => item.machine_no))
    );
    console.log(uniqueMachines);

    uniqueMachines.sort((a: any, b: any) =>
      a.toString().localeCompare(b.toString())
    );
    const machineNo1Results: any[] = [];
    const machineNo2Results: any[] = [];

    result.forEach((item: any) => {
      if (item.machine_no === uniqueMachines[0]) {
        machineNo1Results.push(item);
      } else if (item.machine_no === uniqueMachines[1]) {
        machineNo2Results.push(item);
      }
    });

    console.log("mc1_result_day", machineNo1Results);
    console.log("mc2_result_day", machineNo2Results);

    let previousDayValueMc1 = 0;
    let previousNightValueMc1 = 0;
    let previousDayValueMc2 = 0;
    let previousNightValueMc2 = 0;

    console.log(machineNo1Results);

    machineNo1Results.forEach((entry, index) => {
      const time = new Date(entry.date).toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
      const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
      const isDayShift = dayShiftTimes.includes(time);
      const isNightShift = nightShiftTimes.includes(time);
      entry.shift = isDayShift ? "day" : "night";

      if (isDayShift) {
        if (
          time === (isOdd ? "09:40:00" : "09:30:00") ||
          time === (isOdd ? "12:15:00" : "12:30:00") ||
          time === (isOdd ? "14:40:00" : "14:30:00") ||
          time === "16:50:00"
        ) {
          entry.value = index > 0 ? machineNo1Results[index - 1].value : 0;
        } else {
          entry.value = entry.data.prod_actual - previousDayValueMc1;
          previousDayValueMc1 = entry.data.prod_actual;
        }
      }
      entry.period = time;
      entry.type = "actual";
      entry.zone_number = 1;
      console.log(entry);
    });
    console.log(machineNo1Results);

    machineNo2Results.forEach((entry, index) => {
      const time = new Date(entry.date).toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
      const isDayShift = dayShiftTimes.includes(time);
      const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
      const isNightShift = nightShiftTimes.includes(time);

      entry.shift = isDayShift ? "day" : "night";

      if (isDayShift) {
        if (
          time === (isOdd ? "09:40:00" : "09:30:00") ||
          time === (isOdd ? "12:15:00" : "12:30:00") ||
          time === (isOdd ? "14:40:00" : "14:30:00") ||
          time === "16:50:00"
        ) {
          entry.value = index > 0 ? machineNo2Results[index - 1].value : 0;
        } else {
          entry.value = entry.data.prod_actual - previousDayValueMc2;
          previousDayValueMc2 = entry.data.prod_actual;
        }
      }

      entry.period = time;
      entry.type = "actual";
      entry.zone_number = 2;
      console.log(entry);
    });

    const results1 = machineNo1Results.filter(
      (item: any) => item.shift === shift
    );
    const results2 = machineNo2Results.filter(
      (item: any) => item.shift === shift
    );

    const excludedPeriods = ["07:35:00", "19:35:00"];

    const filteredResults1 = results1.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    console.log(filteredResults1);
    const filteredResults2 = results2.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    console.log("data calmc1", filteredResults1);
    console.log("data calmc2", filteredResults2);
    calBaratsukiEachMachine(filteredResults1);
    calBaratsukiEachMachine(filteredResults2);
    return ["yes"];
  } else {
    return ["no"];
  }
}

export async function calBaratsukiNight(params: Params): Promise<any[]> {
  const { isOdd, shift } = GeneralStore.getState();
  const response = await axios.get(
    "http://127.0.0.1:8000/get_dataparameter_night",
    {
      params: params,
    }
  );
  if (response.status === 200) {
    console.log(response.data);
    const result = response.data;
    console.log(result);

    const uniqueMachines = Array.from(
      new Set(result.map((item: any) => item.machine_no))
    );
    console.log(uniqueMachines);

    uniqueMachines.sort((a: any, b: any) =>
      a.toString().localeCompare(b.toString())
    );
    const machineNo1Results: any[] = [];
    const machineNo2Results: any[] = [];

    result.forEach((item: any) => {
      if (item.machine_no === uniqueMachines[0]) {
        machineNo1Results.push(item);
      } else if (item.machine_no === uniqueMachines[1]) {
        machineNo2Results.push(item);
      }
    });

    console.log("mc1_result_night", machineNo1Results);
    console.log("mc2_result_night", machineNo2Results);

    let previousDayValueMc1 = 0;
    let previousNightValueMc1 = 0;
    let previousDayValueMc2 = 0;
    let previousNightValueMc2 = 0;

    console.log(machineNo1Results);

    machineNo1Results.forEach((entry, index) => {
      const time = new Date(entry.date).toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
      const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
      const isDayShift = dayShiftTimes.includes(time);
      const isNightShift = nightShiftTimes.includes(time);
      entry.shift = isDayShift ? "day" : "night";

      if (isNightShift) {
        if (
          time === "21:40:00" ||
          time === (isOdd ? "00:05:00" : "00:20:00") ||
          time === "02:50:00" ||
          time === "04:50:00"
        ) {
          entry.value = index > 0 ? machineNo1Results[index - 1].value : 0;
        } else {
          entry.value =
            time === "19:35:00"
              ? 0
              : entry.data.prod_actual - previousNightValueMc1;
          previousNightValueMc1 = entry.data.prod_actual;
        }
      }
      entry.period = time;
      entry.type = "actual";
      entry.zone_number = 1;
      console.log(entry);
    });
    console.log(machineNo1Results);

    machineNo2Results.forEach((entry, index) => {
      const time = new Date(entry.date).toLocaleTimeString("en-US", {
        hour12: false,
      });
      const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
      const isDayShift = dayShiftTimes.includes(time);
      const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;
      const isNightShift = nightShiftTimes.includes(time);

      entry.shift = isDayShift ? "day" : "night";

      if (isNightShift) {
        if (
          time === "21:40:00" ||
          time === (isOdd ? "00:05:00" : "00:20:00") ||
          time === "02:50:00" ||
          time === "04:50:00"
        ) {
          entry.value = index > 0 ? machineNo2Results[index - 1].value : 0;
        } else {
          entry.value =
            time === "19:35:00"
              ? 0
              : entry.data.prod_actual - previousNightValueMc2;
          previousNightValueMc2 = entry.data.prod_actual;
        }
      }

      entry.period = time;
      entry.type = "actual";
      entry.zone_number = 2;
      console.log(entry);
    });

    const results1 = machineNo1Results.filter(
      (item: any) => item.shift === "night"
    );
    const results2 = machineNo2Results.filter(
      (item: any) => item.shift === "night"
    );

    const excludedPeriods = ["07:35:00", "19:35:00"];

    const filteredResults1 = results1.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    const filteredResults2 = results2.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    console.log(filteredResults1)
    console.log(filteredResults2)
    calBaratsukiEachMachine(filteredResults1);
    calBaratsukiEachMachine(filteredResults2);

    return ["yes"];
  } else {
    return ["no"];
  }
}

export async function calBaratsukiEachMachine(
  parameter: DataProps[]
): Promise<any[]> {
  const {
    dateStrings,
    ctTargetZone1,
    ctTargetZone2,
    isOdd,
    baratsukiRate,
    targetNotRealTimeMC1,
    targetNotRealTimeMC2,
    targetRealTimeMC1,
    targetRealTimeMC2,
    setOaMinMc1Day,
    setOaMaxMc1Day,
    setOaMinMc2Day,
    setOaMaxMc2Day,
    setOaMinMc1Night,
    setOaMaxMc1Night,
    setOaMinMc2Night,
    setOaMaxMc2Night,
  } = GeneralStore.getState();
  const currentDate = dayjs().format("YYYY-MM-DD");
  const zone_number = parameter[0]?.zone_number;
  const ctTarget = zone_number === 1 ? ctTargetZone1 : ctTargetZone2;
  const formattedData = parameter.map((entry) => {
    const period = entry.period.slice(0, -3); // Remove the last three characters (":00")
    return { ...entry, period };
  });
  const dayShiftTimes1 = [
    "07:35",
    "08:30",
    "09:30",
    "09:40",
    "10:30",
    "11:15",
    "12:15",
    "13:30",
    "14:30",
    "14:40",
    "15:30",
    "16:30",
    "16:50",
    "17:50",
    "19:20",
  ];
  const dayShiftTimes2 = [
    "07:35",
    "08:30",
    "09:20",
    "09:30",
    "10:30",
    "11:30",
    "12:30",
    "13:30",
    "14:20",
    "14:30",
    "15:30",
    "16:30",
    "16:50",
    "17:50",
    "19:20",
  ];
  const dayShiftTimes = isOdd ? dayShiftTimes1 : dayShiftTimes2;
  const excludedTitles1 = [
    "09:30 - 09:40",
    "11:15 - 12:15",
    "14:30 - 14:40",
    "21:30 - 21:40",
    "23:15 - 00:05",
    "02:30 - 02:50",
    "04:30 - 04:50",
    "16:30 - 16:50",
  ];
  const excludedTitles2 = [
    "09:20 - 09:30",
    "11:30 - 12:30",
    "14:20 - 14:30",
    "21:30 - 21:40",
    "23:30 - 00:20",
    "02:30 - 02:50",
    "04:30 - 04:50",
    "16:30 - 16:50",
  ];
  const excludedTitles = isOdd ? excludedTitles1 : excludedTitles2;

  const nightShiftTimes1 = [
    "19:35",
    "20:30",
    "21:30",
    "21:40",
    "22:30",
    "23:15",
    "00:05",
    "01:30",
    "02:30",
    "02:50",
    "03:30",
    "04:30",
    "04:50",
    "05:50",
    "07:20",
  ];

  const nightShiftTimes2 = [
    "19:35",
    "20:30",
    "21:30",
    "21:40",
    "22:30",
    "23:30",
    "00:20",
    "01:30",
    "02:30",
    "02:50",
    "03:30",
    "04:30",
    "04:50",
    "05:50",
    "07:20",
  ];

  const nightShiftTimes = isOdd ? nightShiftTimes1 : nightShiftTimes2;

  let targetZoneRate: number = 0;
  if (dateStrings !== currentDate) {
    targetZoneRate =
      zone_number === 1 ? targetNotRealTimeMC1 : targetNotRealTimeMC2;
  } else {
    targetZoneRate = zone_number === 1 ? targetRealTimeMC1 : targetRealTimeMC2;
  }

  const targetValues: { [key: number]: number } = {
    77: Math.floor(targetZoneRate * 0.77),
    81: Math.floor(targetZoneRate * 0.81),
    85: Math.floor(targetZoneRate * 0.85),
    100: Math.floor(targetZoneRate * 1),
  };
  const baratsukiRateNumber = Number(baratsukiRate);
  let target: number = targetValues[baratsukiRateNumber] || 0;
  console.log("mine target", target);
  let targetUpper = (baratsukiRateNumber / 100) * 1.05;
  let targetLower = (baratsukiRateNumber / 100) * 0.95;
  const period1 = [
    {
      periodTime: "07:35 - 08:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "08:30 - 09:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "09:30 - 09:40", time: 600, status: 2 },
    {
      periodTime: "09:40 - 10:30",
      time: 3000,
    },
    {
      periodTime: "10:30 - 11:15",
      time: 2700,
      status: 1,
    },
    { periodTime: "11:15 - 12:15", time: 3600, status: 3 },
    {
      periodTime: "12:15 - 13:30",
      time: 4500,
      status: 1,
    },
    {
      periodTime: "13:30 - 14:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "14:30 - 14:40", time: 600, status: 2 },
    {
      periodTime: "14:40 - 15:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "15:30 - 16:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
    {
      periodTime: "16:50 - 17:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "17:50 - 19:20",
      time: 5400,
      status: 1,
    },
    {
      periodTime: "19:35 - 20:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "20:30 - 21:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "21:30 - 21:40", time: 600, status: 2 },
    {
      periodTime: "21:40 - 22:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "22:30 - 23:15",
      time: 2700,
      status: 1,
    },
    { periodTime: "23:15 - 00:05", time: 3000, status: 3 },
    {
      periodTime: "00:05 - 01:30",
      time: 5100,
      status: 1,
    },
    {
      periodTime: "01:30 - 02:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
    {
      periodTime: "02:50 - 03:30",
      time: 2400,
      status: 1,
    },
    {
      periodTime: "03:30 - 04:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
    {
      periodTime: "04:50 - 05:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "05:50 - 07:20",
      time: 5400,
      status: 1,
    },
  ];
  const period1_aftermap = period1.map((item) => {
    if (item.status === 2 || item.status === 3) {
      return { ...item, upper: 0, lower: 0 };
    } else {
      return {
        ...item,
        upper: Math.floor((item.time / ctTarget) * targetUpper),
        lower: Math.floor((item.time / ctTarget) * targetLower),
      };
    }
  });
  const period2 = [
    {
      periodTime: "07:35 - 08:30",
      time: 3300,
      status: 1,
    },
    {
      periodTime: "08:30 - 09:20",
      time: 3000,
      status: 1,
    },
    { periodTime: "09:20 - 09:30", time: 600, status: 2 },
    {
      periodTime: "09:30 - 10:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "10:30 - 11:30",
      time: 3600,
    },
    { periodTime: "11:30 - 12:30", time: 3600, status: 3 },
    {
      periodTime: "12:30 - 13:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "13:30 - 14:20",
      time: 3600,
      status: 1,
    },
    { periodTime: "14:20 - 14:30", time: 600, status: 2 },
    {
      periodTime: "14:30 - 15:30",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "15:30 - 16:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "16:30 - 16:50", time: 1200, status: 2 },
    {
      periodTime: "16:50 - 17:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "17:50 - 19:20",
      time: 5400,
      status: 1,
    },
    {
      periodTime: "19:35 - 20:30",
      time: 3300,
    },
    {
      periodTime: "20:30 - 21:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "21:30 - 21:40", time: 600, status: 2 },
    {
      periodTime: "21:40 - 22:30",
      time: 3000,
      status: 1,
    },
    {
      periodTime: "22:30 - 23:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "23:30 - 00:20", time: 3000, status: 3 },
    {
      periodTime: "00:20 - 01:30",
      time: 4200,
      status: 1,
    },
    {
      periodTime: "01:30 - 02:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "02:30 - 02:50", time: 1200, status: 2 },
    {
      periodTime: "02:50 - 03:30",
      time: 2400,
      status: 1,
    },
    {
      periodTime: "03:30 - 04:30",
      time: 3600,
      status: 1,
    },
    { periodTime: "04:30 - 04:50", time: 1200, status: 2 },
    {
      periodTime: "04:50 - 05:50",
      time: 3600,
      status: 1,
    },
    {
      periodTime: "05:50 - 07:20",
      time: 5400,
      status: 1,
    },
  ];
  const period2_aftermap = period2.map((item: any) => {
    if (item.status === 2 || item.status === 3) {
      return { ...item, upper: 0, lower: 0 };
    } else {
      return {
        ...item,
        upper: Math.floor((item.time / ctTarget) * targetUpper),
        lower: Math.floor((item.time / ctTarget) * targetLower),
      };
    }
  });

  const period = isOdd ? period1_aftermap : period2_aftermap;

  const interval1 = [
    {
      point: "08:30:00",
      time: "55 minutes",
    },
    {
      point: "09:30:00",
      time: "1 hour",
    },
    {
      point: "09:40:00",
      time: "10 minutes",
    },
    {
      point: "10:30:00",
      time: "50 minutes",
    },
    {
      point: "11:15:00",
      time: "45 minutes",
    },
    {
      point: "12:15:00",
      time: "1 hour",
    },
    {
      point: "13:30:00",
      time: "1 hour 15 minutes",
    },
    {
      point: "14:30:00",
      time: "1 hour",
    },
    {
      point: "14:40:00",
      time: "10 minutes",
    },
    {
      point: "15:30:00",
      time: "50 minutes",
    },
    {
      point: "16:30:00",
      time: "1 hour",
    },
    {
      point: "16:50:00",
      time: "20 minutes",
    },
    {
      point: "17:50:00",
      time: "1 hour",
    },
    {
      point: "19:20:00",
      time: "1 hour 30 minutes",
    },
    {
      point: "20:30:00",
      time: "55 minutes",
    },
    {
      point: "21:30:00",
      time: "1 hour",
    },
    {
      point: "21:40:00",
      time: "10 minutes",
    },
    {
      point: "22:30:00",
      time: "50 minutes",
    },
    {
      point: "23:15:00",
      time: "45 minutes",
    },
    {
      point: "01:30:00",
      time: "1 hour 25 minutes",
    },
    {
      point: "02:30:00",
      time: "1 hour",
    },
    {
      point: "03:30:00",
      time: "40 minutes",
    },
    {
      point: "04:30:00",
      time: "1 hour",
    },
    {
      point: "05:50:00",
      time: "1 hour",
    },
    {
      point: "07:20:00",
      time: "1 hour 30 minutes",
    },
  ];
  const interval2 = [
    {
      point: "08:30:00",
      time: "55 minutes",
    },
    {
      point: "09:20:00",
      time: "50 minutes",
    },
    {
      point: "09:30:00",
      time: "10 minutes",
    },
    {
      point: "10:30:00",
      time: "1 hour",
    },
    {
      point: "11:30:00",
      time: "1 hour",
    },
    {
      point: "12:30:00",
      time: "1 hour",
    },
    {
      point: "13:30:00",
      time: "1 hour",
    },
    {
      point: "14:20:00",
      time: "50 minutes",
    },
    {
      point: "14:30:00",
      time: "10 minutes",
    },
    {
      point: "15:30:00",
      time: "1 hour",
    },
    {
      point: "16:30:00",
      time: "1 hour",
    },
    {
      point: "16:50:00",
      time: "20 minutes",
    },
    {
      point: "17:50:00",
      time: "1 hour",
    },
    {
      point: "19:20:00",
      time: "1 hour 30 minutes",
    },
    {
      point: "20:30:00",
      time: "55 minutes",
    },
    {
      point: "21:30:00",
      time: "1 hour",
    },
    {
      point: "21:40:00",
      time: "10 minutes",
    },
    {
      point: "22:30:00",
      time: "50 minutes",
    },
    {
      point: "23:30:00",
      time: "1 hour",
    },
    {
      point: "01:30:00",
      time: "1 hour 10 minutes",
    },
    {
      point: "02:30:00",
      time: "1 hour",
    },
    {
      point: "03:30:00",
      time: "40 minutes",
    },
    {
      point: "04:30:00",
      time: "1 hour",
    },
    {
      point: "05:50:00",
      time: "1 hour",
    },
    {
      point: "07:20:00",
      time: "1 hour 30 minutes",
    },
  ];
  const interval = isOdd ? interval1 : interval2;

  const updatePeriod = (period: string, shift: string): string => {
    let index = -1;
    if (shift === "day") {
      index = dayShiftTimes.indexOf(period);
      if (index !== -1 && index > 0) {
        return `${dayShiftTimes[index - 1]} - ${period}`;
      }
    } else if (shift === "night") {
      index = nightShiftTimes.indexOf(period);
      if (index !== -1 && index > 0) {
        return `${nightShiftTimes[index - 1]} - ${period}`;
      }
    }
    return period;
  };

  const updatedParameter = formattedData.map((item) => ({
    ...item,
    period: updatePeriod(item.period, item.shift),
  }));
  updatedParameter.forEach((item) => {
    if (excludedTitles.includes(item.period)) {
      item.value = 0;
    }
  });

  updatedParameter.forEach((item: any) => {
    const matchingPeriod = period.find(
      (periodItem) => periodItem.periodTime === item.period
    );
    if (matchingPeriod) {
      item.upper = matchingPeriod.upper;
      item.lower = matchingPeriod.lower;
      if (item.value >= item.lower && item.value <= item.upper) {
        item.color = "red";
      } else {
        item.color = "green";
      }
    }
  });

  const periodsRest1 = [
    "09:30 - 09:40",
    "11:15 - 12:15",
    "14:30 - 14:40",
    "16:30 - 16:50",
    "21:30 - 21:40",
    "23:15 - 00:05",
    "02:30 - 02:50",
    "04:30 - 04:50",
  ];
  const periodsRest2 = [
    "09:20 - 09:30",
    "11:30 - 12:30",
    "14:20 - 14:50",
    "16:30 - 16:50",
    "21:30 - 21:40",
    "23:30 - 00:20",
    "02:30 - 02:50",
    "04:30 - 04:50",
  ];
  const periodsRest = isOdd ? periodsRest1 : periodsRest2;
  const graphData = updatedParameter?.map((update) => {
    const matchingPeriod = period.find(
      (periodItem) => periodItem.periodTime === update.period
    );
    if (matchingPeriod) {
      update.upper = matchingPeriod.upper;
      update.lower = matchingPeriod.lower;
    }
    return update; // Return the updated object
  });
  for (let i = 1; i < graphData.length; i++) {
    const currentPeriod = graphData[i].period;
    const currentProdActual = graphData[i].data.prod_actual;
    const previousProdActual = graphData[i - 1].data.prod_actual;

    if (periodsRest.includes(currentPeriod)) {
      graphData[i].value = 0;
    } else {
      graphData[i].value = currentProdActual - previousProdActual;
    }
  }

  const updatedGraphData = graphData
    .filter(
      (item): item is typeof item & { upper: number } =>
        item.upper !== undefined && item.upper !== 0
    )
    .map((item) => {
      const upper = item.upper;
      const target = upper / 1.05 / 0.77;
      return {
        ...item,
        target,
        oa: ((item.value / Math.round(target)) * 100).toFixed(2),
      };
    });
  console.log(updatedGraphData);
  const { min, max } = updatedGraphData.reduce(
    (acc, obj) => {
      const oaValue = Number(obj.oa);
      if (!isNaN(oaValue)) {
        acc.min = Math.min(acc.min, oaValue);
        acc.max = Math.max(acc.max, oaValue);
      }
      return acc;
    },
    { min: Infinity, max: -Infinity }
  );
  console.log(min, max);
  if (parameter[0]?.shift === "day") {
    if (zone_number === 1) {
      setOaMinMc1Day(min);
      setOaMaxMc1Day(max);
    } else {
      setOaMinMc2Day(min);
      setOaMaxMc2Day(max);
    }
  } else if (parameter[0]?.shift === "night") {
    if (zone_number === 1) {
      setOaMinMc1Night(min);
      setOaMaxMc1Night(max);
    } else {
      setOaMinMc2Night(min);
      setOaMaxMc2Night(max);
    }
  }

  return updatedGraphData;
}
