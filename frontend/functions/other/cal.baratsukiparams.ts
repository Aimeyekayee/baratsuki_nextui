import { BaratsukiResponse } from "@/types/baratsuki.type";
export function calculateSummaryActualThisPeriod(data: BaratsukiResponse) {
  return data.data.reduce((sum, item) => sum + item.actual_this_period, 0);
}

export function calculateSummaryDuration(data: BaratsukiResponse): number {
  //! to calculate last 2 object = 0 because incase of not working on sangyousuru
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
  const oaValues = data.data.map((item) => item.oa);
  const maxOA = Math.max(...oaValues);
  const minOA = Math.min(...oaValues);
  return Number((maxOA - minOA).toFixed(2));
}
