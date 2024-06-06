// import {ISection,ISectionAPI} from '@/types/section.type'
import { SearchRecStore } from "@/store/search.store";
import { GeneralStore } from "@/store/general.store";
import axiosInstance from "@/lib/axios";
import axios from "axios";
import {
  ISection,
  ILinename,
  IMachinename,
  IToolConditions,
} from "@/types/section.type";

interface IProps {
  name_no_machine: string | null;
  line_id: number | null;
}

interface IFindControlItem {
  key: string;
  line_id: number;
  tool_cost: number;
  tool_life_target: number;
  tool_name: string;
  tool_no: string;
}

interface IControlItemResponse {
  control_item: [];
}

export async function requestSection(): Promise<ISection[]> {
  const { setSections } = SearchRecStore.getState();

  const response = await axios.get("http://127.0.0.1:8000/get_section");
  if (response.status === 200) {
    console.log(response.data);
    setSections(response.data);
  }
  return response.data.section;
}

export async function requestLinename(
  section_name: string
): Promise<ILinename[]> {
  const { setLinename } = SearchRecStore.getState();

  const response = await axiosInstance.get(
    "http://127.0.0.1:8000/get_linename",
    {
      params: { section_name: section_name },
    }
  );
  if (response.status === 200) {
    setLinename(response.data.line_name);
  }
  return response.data.line_name;
}

export async function requestLinenameOverview(): Promise<ILinename[]> {
  const { setLinename } = SearchRecStore.getState();

  const response = await axiosInstance.get("/commons/get_linename_overview");
  if (response.status === 200) {
    setLinename(response.data.line_name);
  }
  return response.data.line_name;
}

export async function requestMachinename(
  section_code: number
): Promise<IMachinename> {
  const { setMachinename } = SearchRecStore.getState();
  const response = await axiosInstance.get(
    "http://127.0.0.1:8000/get_machinename",
    {
      params: { section_code: section_code },
    }
  );
  if (response.status === 200) {
    setMachinename(response.data);
  }

  return response.data.name_no_machine;
}

export async function requestMachinenameOverview(): Promise<IMachinename> {
  const { setMachinename } = SearchRecStore.getState();
  const response = await axiosInstance.get("/commons/get_machinename_overview");
  if (response.status === 200) {
    setMachinename(response.data.name_no_machine);
  }

  return response.data.name_no_machine;
}

export async function requestToolConditions(
  params: IProps
): Promise<IToolConditions> {
  // console.log(params.name_no_machine);
  const { name_no_machine, line_id } = params;
  const { setToolconditions } = SearchRecStore.getState();

  const response = await axiosInstance.get("/commons/get_tool_conditions", {
    params: {
      machine_no: name_no_machine,
      line_id: line_id,
    },
  });
  if (response.status === 200) {
    setToolconditions(response.data.tool_conditions);
  }
  return response.data.tool_conditions;
}

export async function requestToolConditionsOverview(): Promise<IToolConditions> {
  // console.log(params.name_no_machine);
  const { setToolconditions } = SearchRecStore.getState();

  const response = await axiosInstance.get(
    "/commons/get_tool_conditions_overview"
  );
  if (response.status === 200) {
    setToolconditions(response.data.tool_conditions);
  }
  return response.data.tool_conditions;
}
