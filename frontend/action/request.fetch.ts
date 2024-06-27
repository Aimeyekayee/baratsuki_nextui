import {
  MachineDataRaw,
  SearchInputParams,
  BaratsukiResponse,
  SearchRequestDataAreaParams,
  BaratsukiDataAreaResponse,
} from "@/types/baratsuki.type";
import { BaratsukiStore } from "@/store/data.baratsuki.store";
import axios from "axios";

export async function requestBaratsuki(
  params: SearchInputParams[]
): Promise<BaratsukiResponse[]> {
  const { setBaratsuki } = BaratsukiStore.getState();
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/get_rawdata",
      params
    );

    if (response.status === 200) {
      console.log(response.data);
      setBaratsuki(response.data);
      return response.data;
    } else {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching machine data:", error);
    throw error; // Re-throw the error after logging it
  }
}

export async function requestBaratsukiArea(
  params: SearchRequestDataAreaParams
): Promise<BaratsukiDataAreaResponse[]> {
  const { setBaratsukiDataArea } = BaratsukiStore.getState();
  try {
    const response = await axios.get("http://127.0.0.1:8000/get_data_area", {
      params: params,
    });

    if (response.status === 200) {
      console.log(response.data);
      setBaratsukiDataArea(response.data);
      return response.data;
    } else {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching data area:", error);
    throw error; // Re-throw the error after logging it
  }
}
