export interface IMqttResponse {
  section_code: number;
  line_id: number;
  machine_no: string;
  ct_actual: number;
  prod_actual: number;
  prod_plan: number;
  break_id_1: number;
  break_id_2: number;
  break_id_3: number;
  break_id_4: number;
}

export type MqttData = {
  section_code: number;
  line_id: number;
  machine_no: string;
  ct_actual: number;
  prod_actual: number;
  prod_plan: number;
  break_id_1: number;
  break_id_2: number;
  break_id_3: number;
  break_id_4: number;
};
