import axios from "axios";
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
  //!   "http://10.122.77.1:8004/get_dataparameter_day"
  const response = await axios.get(
    "http://10.122.77.1:8004/get_dataparameter_day",
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

    console.log("res1", results1);
    console.log("res2", results2);
  }
  return response.data;
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
    "http://10.122.77.1:8004/get_dataparameter_night",
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
  }
  return response.data;
}

export async function requestDataByShiftColumn(params: Params): Promise<any[]> {
  const { setDataByShiftColumnMC1, setDataByShiftColumnMC2 } =
    GeneralStore.getState();
  console.log("eie", params);
  const response = await axios.get(
    "http://10.122.77.1:8004/get_dataparameter_by_shift_column",
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
    console.log(filteredResult)

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
    console.log("kek", machineNo1Results);
    setDataByShiftColumnMC1(machineNo1Results);
    setDataByShiftColumnMC2(machineNo2Results);
  }
  return response.data;
}
