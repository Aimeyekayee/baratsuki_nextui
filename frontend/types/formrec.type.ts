import type { CheckboxValueType } from "antd/es/checkbox/Group";
import type { UploadProps, UploadFile } from "antd";
import { isMapIterator } from "util/types";
import dayjs, { Dayjs } from "dayjs";
// export interface FormRecordData {
//   section: string | null;
//   line_name: string | null;
//   name_no_machine: string | null;
//   tool_no:string | null
//   dateChange: string | undefined;
//   timeChange: string | undefined;
//   tool_actual: string;
//   tool_type: string;
//   tool_usage: string;
//   tool_condition: string | ToolCondiontion;
//   measurement: {
//     appearance: string;
//     l1height: string;
//     l4height: string;
//   };
//   signer:string
//   request_status:string
//   problem_tooling_change:{
//     detail:string
//     operation:string
//   }
// }

export interface ToolCondiontion {
  ng_mode: string[];
}

export interface MeasurementRecord {}

export interface ToolIUsageDetail {
  condition: CheckboxValueType[] | string;
  [key: string]: any;
}

export interface ControlItem {
  control_item: ControlItemDetail[];
}

export interface ImagePath {
  [key: string]: any;
}

export interface FormRecordData {
  section: string | null;
  line_id: number | undefined;
  tool_no: string | null;
  machine_no: string | null;
  part_no: string | null;
  tool_life_actual: string;
  tool_life_target: string | null;
  date_changed: Dayjs | undefined;
  tool_type: string;
  tool_usage: string;
  tool_usage_detail: ToolIUsageDetail[];
  image_path: ImagePath[];
  control_item_data: ControlItem[];
  user_uuid: string | undefined;
  current_status_id: number;
  supervisor_email: string | undefined;
  email_list: string[];
}

export interface RequestSendEmail {
  record_uuid: string;
  subject_name: string | null;
  action_id: number;
  sender_name: string | null;
  action_created_at: string | null;
  reason: string | null;
  line_name: string | null;
  name_no_machine: string | null;
  tool_no: string | null;
  tool_name_no: string | null;
  tool_life_actual: number;
  date_changed: string | undefined;
  isToollifeComplete: boolean;
  email_list: string[];
}

export interface FormEditRecord {
  record_uuid: string;
  tool_life_actual: string;
  date_changed: Dayjs | undefined;
  tool_type: string;
  tool_usage: string;
  tool_usage_detail: ToolIUsageDetail[];
  image_path: ImagePath[];
  control_item_data: ControlItem[];
  email_list: string[];
}
export interface FormEditRecordUpsert {
  record_uuid: string;
  line_id: number | undefined;
  machine_no: string | null;
  tool_no: string | null;
  part_no: string | null;
  detail_reason: string;
  operation: string;
  date_changed: Dayjs | undefined;
}

export interface ControlItemDetail {
  unit: string;
  interval: string;
  data_type: string;
  control_item_data: string;
  control_item_name: string;
  control_item_std_value:string
}
export interface ControlItemResponse {
  control_item: ControlItemDetail[];
}
export interface FormRecordDataResponse {
  record_uuid: string;
  line_id: number | undefined;
  machine_no: string | null;
  tool_no: string | null;
  part_no: string | null;
  tool_life_actual: number;
  tool_life_target: number;
  tool_type: string;
  tool_usage: string;
  tool_usage_detail: ToolIUsageDetail[];
  date_changed: Dayjs | undefined;
  image_path: ImagePath[];
  control_item_data: ControlItemResponse[];
  current_status_id: number;
  note: string | null;
  user_uuid: string | undefined;
  supervisor_email: string | undefined;
  created_at: Dayjs | undefined;
  updated_at: Dayjs | undefined;
  email_list: string[];
  approval_user_uuid: string | null;
  section: "";
}
export interface FormRecordDataResponsePlusPlus {
  record_uuid: string;
  line_id: number | undefined;
  machine_no: string | null;
  machine_name: string | null;
  tool_no: string | null;
  part_no: string | null;
  tool_life_actual: number;
  tool_life_target: number;
  tool_type: string;
  tool_usage: string;
  tool_usage_detail: ToolIUsageDetail[];
  date_changed: Dayjs | undefined;
  image_path: ImagePath[];
  control_item_data: ControlItemResponse[];
  current_status_id: number;
  note: string | null;
  user_uuid: string | undefined;
  supervisor_email: string | undefined;
  created_at: Dayjs | undefined;
  updated_at: Dayjs | undefined;
  email_list: string[];
  approval_user_uuid: string | null;
  section: "";
  line_name: string;
}
export interface Upload {
  [key: string]: any;
}
