import {
  ISection,
  ILinename,
  IMachinename,
  IToolConditions,
  IPartNo,
  ControlItems,
} from "@/types/section.type";
import {
  IRecordParamerters,
  IMeasurement,
  IToolUsageFull,
  IToolUsageLess,
} from "@/types/record.type";
import type { UploadProps, UploadFile } from "antd";
import { Upload } from "@/types/formrec.type";

export interface ISearchState {
  selectedSection: string | undefined;
  selectedLinename: string | undefined;
  selectedNameNoMachine: string | undefined;
  setselectedSection: (selectedSection: string | undefined) => void;
  setselectedLinename: (selectedLinename: string | undefined) => void;
  setselectedNameNoMachine: (selectedNameNoMachine: string | undefined) => void;
}

export interface ISectionOptions {
  sections: ISection[];
  setSections: (newDataArray: ISection[]) => void;
}

export interface IPartNoOptions {
  part_no: IPartNo[];
  setPartno: (newDataArray: IPartNo[]) => void;
}

export interface IControlItem {
  control_item: ControlItems[];
  setControlItem: (newDataArray: ControlItems[]) => void;
}

export interface ILinenameOptions {
  line_name: ILinename[];
  setLinename: (newDataArray: ILinename[]) => void;
}
export interface IMachinenameOptions {
  name_no_machine: IMachinename[];
  setMachinename: (newDataArray: IMachinename[]) => void;
}

export interface IToolConditionOptions {
  tool_conditions: IToolConditions[] | undefined;
  setToolconditions: (newDataArray: IToolConditions[] | undefined) => void;
}

export interface IToolsRecord {
  section: string;
  line_name: string | null;
  name_no_machine: string | null;
  tool_name: string | null;
  tool_no: string | null;
  tool_target: number | null;
  dateChange: Date;
  timeChange: Date;
  tool_life_actual: number;
  tool_type: string;
  tool_usage_fully: string | null;
  tool_usage_less: IToolUsageLess;
  measurement: IMeasurement;
  line_id: number;
  name_no_machine_for_email: string | null;
  tool_name_no: string | null;
  setToolNameNo: (tool_name_no: string) => void;
  setNameNoMachineForEmail: (name_no_machine_for_email: string | null) => void;
  setSection: (section: string) => void;
  setLineID: (line_id: number) => void;
  setLineName: (line_name: string | null) => void;
  setNameNoMachine: (name_no_machine: string | null) => void;
  setToolName: (tool_name: string | null) => void;
  setToolNo: (tool_no: string | null) => void;
  setToolTarget: (tool_no: number | null) => void;
  setDateChange: (dateChange: Date) => void;
  setTimeChange: (timeChange: Date) => void;
  setToolLifeActual: (tool_life_actual: number) => void;
  setToolType: (tool_type: string) => void;
  setToolUsageFully: (tool_usage_fully: string | null) => void;
  setToolUsageLess: (key: string, value: boolean | undefined) => void;
  setMeasurement: (key: string, value: any) => void;
}

export interface IUploadFile {
  upload_list: UploadFile[];
  internalFileList: UploadFile[];
  upload_file: File[];
  setUploadFile: (newDataArray: File[]) => void;
  setInternalFileList: (newDataArray: UploadFile[]) => void;
  setUploadList: (newDataArray: UploadFile[]) => void;
}
