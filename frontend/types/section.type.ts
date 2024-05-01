export interface ISection {
  section_name: string;
}

export interface IPartNo {
  part_no: string;
}


export interface ControlItems{
  [key:string]:any
}

export interface ILinename {
  line_name: string;
  section_code: number;
  line_id: number;
}
export interface IMachinename {
  machine_no: string;
  machine_name: string;
}

export interface IToolConditions {
  line_id: number;
  tool_no: string;
  machine_no: string;
  tool_cost:number
  tool_name: string;
  tool_life_target: number;
}
