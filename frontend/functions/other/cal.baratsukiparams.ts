import { BaratsukiResponse } from "@/types/baratsuki.type";
export function calculateProdActualDifference(data: BaratsukiResponse) {
  const lastItem = data?.data[data.data.length - 1].data;
  return lastItem?.prod_actual - 0;
}

export function calculateSummaryDuration(data: BaratsukiResponse): number {
  // Check if data and data.data are defined
  if (!data || !data.data) {
    console.error(
      "Invalid data structure: data or data.data is null or undefined."
    );
    return 0; // Return 0 if data or data.data is null or undefined
  }

  const reversedData = [...data.data].reverse();

  const lastTwoExclusionCondition =
    reversedData.length >= 2 &&
    reversedData[0].actual_this_period === 0 &&
    reversedData[1].actual_this_period === 0;

  const totalDuration = reversedData.reduce((sum, item, index) => {
    if (lastTwoExclusionCondition && (index === 0 || index === 1)) {
      return sum;
    }
    return sum + item.duration;
  }, 0);

  const totalExclusionTime = reversedData.reduce((sum, item, index) => {
    if (lastTwoExclusionCondition && (index === 0 || index === 1)) {
      return sum;
    }
    return sum + item.exclusion_time;
  }, 0);

  return totalDuration - totalExclusionTime;
}

export function calculateOADifference(data: BaratsukiResponse): number {
  // Check if data and data.data are defined
  if (!data || !data.data) {
    console.error(
      "Invalid data structure: data or data.data is null or undefined."
    );
    return 0; // Return 0 if data or data.data is null or undefined
  }

  const oaValues = data.data.map((item) => item.oa);
  const maxOA = Math.max(...oaValues);
  const minOA = Math.min(...oaValues);
  return Number((maxOA - minOA).toFixed(2));
}
