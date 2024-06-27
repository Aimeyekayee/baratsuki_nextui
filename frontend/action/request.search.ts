import {
  ISection,
  ILinename,
  IMachinename,
  IToolConditions,
} from "@/types/section.type";
import { SearchRecStore } from "@/store/search.store";
import axios from "axios";

export async function requestSection(): Promise<ISection[]> {
  const { setSections } = SearchRecStore.getState();

  const response = await axios.get("http://127.0.0.1:8000/get_section");
  if (response.status === 200) {
    setSections(response.data);
  }
  return response.data.section;
}

export async function requestLinename(
  section_name: string
): Promise<ILinename[]> {
  const { setLinename } = SearchRecStore.getState();

  const response = await axios.get(`http://127.0.0.1:8000/get_linename`, {
    params: { section_name: section_name },
  });
  if (response.status === 200) {
    setLinename(response.data);
  }
  return response.data;
}

export async function requestMachinenames(
  section_code: number
): Promise<IMachinename> {
  const { setMachinename } = SearchRecStore.getState();
  const response = await axios.get("http://127.0.0.1:8000/get_machinename", {
    params: { section_code: section_code },
  });
  if (response.status === 200) {
    setMachinename(response.data);
  }

  return response.data.name_no_machine;
}
