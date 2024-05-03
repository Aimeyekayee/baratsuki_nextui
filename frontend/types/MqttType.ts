export interface IMqttResponse {
  section_code: number;
  line_id: number;
  machine_no: string;
  ct_actual: number;
  prod_actual: number;
  prod_plan:number
}

export type MqttData = {
  section_code: number;
  line_id: number;
  machine_no: string;
  ct_actual: number;
  prod_actual: number;
  prod_plan:number
}