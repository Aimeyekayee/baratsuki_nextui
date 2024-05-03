export interface IRecordParamerters {
  section: string;
  line_name:string
  name_no_machine:string
  tool_name:string
  tool_no:string
  dateChange: Date;
  timeChange: Date;
  tool_life_actual: number;
  tool_type: string;
  tool_usage_fully: IToolUsageFull;
  tool_usage_less: IToolUsageLess;
  measurement: IMeasurement;
}

export interface IToolUsageFull {
  good: boolean | null;
  imprecise: boolean | null;
}

export interface IToolUsageLess {
  tool_issue: string | null;
  work_ng: boolean | undefined;
  tool_ng: boolean | undefined;
}

export interface IMeasurement {
  appearance: string;
  l1height: number;
  l4height: number;
}
