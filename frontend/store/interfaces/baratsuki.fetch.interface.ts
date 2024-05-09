export interface DataProductionDetails {
  ct_actual: number;
  prod_actual: number;
}

export interface DataBaratsuki {
  section_code: number;
  line_id: number;
  machine_no: string;
  date: Date;
  data: DataProductionDetails;
}
