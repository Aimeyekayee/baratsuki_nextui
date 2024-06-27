import { MachineDataRaw } from "@/types/baratsuki.type";

export const OffsetX = (graphData: MachineDataRaw[]): number => {
  if (graphData.length === 1) {
    return -60; // Or any default number value you prefer
  } else if (graphData.length === 2) {
    return -249; // Or any default number value you prefer
  } else if (graphData.length === 3) {
    return -145; // Or any default number value you prefer
  } else if (graphData.length === 4) {
    return -109; // Or any default number value you prefer
  } else if (graphData.length === 5) {
    return -87; // Or any default number value you prefer
  } else if (graphData.length === 6) {
    return -72; // Or any default number value you prefer
  } else if (graphData.length === 7) {
    return -71; // Or any default number value you prefer
  } else if (graphData.length === 8) {
    return -54; // Or any default number value you prefer
  } else if (graphData.length === 9) {
    return -55; // Or any default number value you prefer
  } else if (graphData.length === 10) {
    return -43; // Or any default number value you prefer
  } else if (graphData.length === 11) {
    return -49; // Or any default number value you prefer
  } else if (graphData.length === 12) {
    return -62; // Or any default number value you prefer
  } else if (graphData.length === 13) {
    return -37; // Or any default number value you prefer
  } else if (graphData.length === 14) {
    return -50; // Or any default number value you prefer
  }

  return -60;
};
