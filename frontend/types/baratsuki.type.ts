interface RawDataEachRow {
  ct_actual: number;
  prod_actual: number;
}

export interface MachineDataRaw {
  id: number;
  section_code: number;
  line_id: number;
  machine_no: string;
  machine_name: string;
  data: RawDataEachRow;
  date: Date;
  duration: number;
  hour_no: number;
  period: string;
  actual_this_period: number;
  ct_target: number;
  working_date: Date;
  shift: number;
  shift_no: number;
  plan_type: string;
  plan_id: number;
  exclusion_time: number;
  target100: number;
  oa: number;
  challenge_target: number;
  target_challenge?: number;
  target_challenge_lower?: number;
  target_challenge_lower_percent?: number;
  target_challenge_upper?: number;
  target_challenge_upper_percent?: number;
  accummulate_target?: number;
  accummulate_upper?: number;
  accummulate_lower?: number;
}

export interface BaratsukiResponse {
  shift: number;
  data: MachineDataRaw[];
}

export interface BaratsukiDataAreaResponse {
  section_code: number;
  line_id: number;
  machine_no: string;
  date: Date;
  data: RawDataEachRow;
  machine_name: string;
  period: string;
  ct_target: number;
  challenge_rate: number;
  accummulate_target: number;
  accummulate_upper: number;
  accummulate_lower: number;
  duration: number;
  exclusion_time: number;
  target_challege_lower: number;
  target_challege_target: number;
  target_challege_upper: number;
}

export interface SearchInputParams {
  section_code: number;
  line_id: number;
  machine_no: number | string;
  working_date: number | string;
}

export interface SearchRequestDataAreaParams {
  section_code: number;
  line_id: number;
  machine_no: string;
  date: Date;
  interval: string;
  period: string;
  ct_target: number;
  challenge_rate: number;
  target_challege_lower?: number;
  target_challege_target?: number;
  target_challege_upper?: number;
  accummulate_target?: number;
  accummulate_upper?: number;
  accummulate_lower?: number;
  duration?: number;
  exclusion_time?: number;
}
