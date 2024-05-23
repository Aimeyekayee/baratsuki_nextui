import axios from "axios";
import {
  nightShiftTimes1,
  dayShiftTimes1,
  dayShiftTimes2,
  nightShiftTimes2,
  timesToRemove1,
  timesToRemove2,
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
    "https://10.122.77.1:8004/get_dataparameter_day",
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
    const machineNo1Results: any[] = [];
    const machineNo2Results: any[] = [];

    result.forEach((item: any) => {
      if (item.machine_no === uniqueMachines.at(0)) {
        machineNo1Results.push(item);
      } else if (item.machine_no === uniqueMachines.at(1)) {
        machineNo2Results.push(item);
      }
    });
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
    console.log("result1", results1);
    console.log("result2", results2);
    const resultTest1 = results1
      .map((item: any, index: any, array: any) => {
        if (index < array.length - 1) {
          const beginDate = new Date(item.date);
          const endDate = new Date(array[index + 1].date);
          const deltaTime = (endDate.getTime() - beginDate.getTime()) / 1000;
          return {
            begin: item.date,
            end: array[index + 1].date,
            time: deltaTime,
          };
        }
        return null;
      })
      .filter((item: any) => item !== null); // Filter out nulls

    const resultTest2 = results2
      .map((item: any, index: any, array: any) => {
        if (index < array.length - 1) {
          const beginDate = new Date(item.date);
          const endDate = new Date(array[index + 1].date);
          const deltaTime = (endDate.getTime() - beginDate.getTime()) / 1000;
          return {
            begin: item.date,
            end: array[index + 1].date,
            time: deltaTime,
          };
        }
        return null;
      })
      .filter((item: any) => item !== null); // Filter out nulls

    const timesToRemove = isOdd ? timesToRemove1 : timesToRemove2;
    const filteredResults11 = resultTest1.filter((item) => {
      const timePart = item?.begin.split("T")[1];
      return !timesToRemove.includes(timePart);
    });

    const filteredResults22 = resultTest2.filter((item) => {
      const timePart = item?.begin.split("T")[1];
      return !timesToRemove.includes(timePart);
    });

    console.log(filteredResults11);
    const sumTimeTarget1 =
      filteredResults11.reduce((total, item: any) => total + item.time, 0) /
      16.5;
    setTargetNotRealTimeMC1(sumTimeTarget1);

    const sumTimeTarget2 =
      filteredResults22.reduce((total, item: any) => total + item.time, 0) /
      16.5;
    setTargetNotRealTimeMC2(sumTimeTarget2);

    const excludedPeriods = ["07:35:00", "19:35:00"];

    const filteredResults1 = results1.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    const filteredResults2 = results2.filter(
      (item: any) => !excludedPeriods.includes(item.period)
    );
    console.log(filteredResults1);

    if (shift === "day") {
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

    console.log(filteredResults2);
    console.log(filteredResults22);
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
    "https://10.122.77.1:8004/get_dataparameter_night",
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
    const machineNo1Results: any[] = [];
    const machineNo2Results: any[] = [];

    result.forEach((item: any) => {
      if (item.machine_no === uniqueMachines.at(0)) {
        machineNo1Results.push(item);
      } else if (item.machine_no === uniqueMachines.at(1)) {
        machineNo2Results.push(item);
      }
    });
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
    console.log("result1", results1);
    console.log("result2", results2);
    const resultTest1 = results1
      .map((item: any, index: any, array: any) => {
        if (index < array.length - 1) {
          const beginDate = new Date(item.date);
          const endDate = new Date(array[index + 1].date);
          const deltaTime = (endDate.getTime() - beginDate.getTime()) / 1000;
          return {
            begin: item.date,
            end: array[index + 1].date,
            time: deltaTime,
          };
        }
        return null;
      })
      .filter((item: any) => item !== null); // Filter out nulls

    const resultTest2 = results2
      .map((item: any, index: any, array: any) => {
        if (index < array.length - 1) {
          const beginDate = new Date(item.date);
          const endDate = new Date(array[index + 1].date);
          const deltaTime = (endDate.getTime() - beginDate.getTime()) / 1000;
          return {
            begin: item.date,
            end: array[index + 1].date,
            time: deltaTime,
          };
        }
        return null;
      })
      .filter((item: any) => item !== null); // Filter out nulls

    const timesToRemove = isOdd ? timesToRemove1 : timesToRemove2;
    const filteredResults11 = resultTest1.filter((item) => {
      const timePart = item?.begin.split("T")[1];
      return !timesToRemove.includes(timePart);
    });

    const filteredResults22 = resultTest2.filter((item) => {
      const timePart = item?.begin.split("T")[1];
      return !timesToRemove.includes(timePart);
    });

    console.log(filteredResults11);
    const sumTimeTarget1 =
      filteredResults11.reduce((total, item: any) => total + item.time, 0) /
      16.5;
    setTargetNotRealTimeMC1(sumTimeTarget1);

    const sumTimeTarget2 =
      filteredResults22.reduce((total, item: any) => total + item.time, 0) /
      16.5;
    setTargetNotRealTimeMC2(sumTimeTarget2);

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

    console.log(filteredResults2);
    console.log(filteredResults22);
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
  const response = await axios.get(
    "https://10.122.77.1:8004/get_dataparameter_by_shift_column",
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
    const machineNo1Results: any[] = [];
    const machineNo2Results: any[] = [];

    result.forEach((item: any) => {
      if (item.machine_no === uniqueMachines.at(0)) {
        machineNo1Results.push(item);
      } else if (item.machine_no === uniqueMachines.at(1)) {
        machineNo2Results.push(item);
      }
    });

    setDataByShiftColumnMC1(machineNo1Results);
    setDataByShiftColumnMC2(machineNo2Results);
  }
  return response.data;
}
