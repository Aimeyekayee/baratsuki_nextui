"use client";
import { GeneralStore } from "@/store/general.store";
import { Column, ColumnConfig } from "@ant-design/plots";
import { generateAnnotations } from "@/functions/chart/annotations.baratsuki.column";

import { useTheme } from "next-themes";
import { IMqttResponse } from "@/types/MqttType";

export interface DataShiftColumn {
  challenge_target: number;
  actual: number;
  shift: number;
  shift_text: string;
  target_challenge: number;
  challenge_lower: number;
  challenge_upper: number;
}
interface LineProps {
  parameter: DataShiftColumn[];
  mqttData: IMqttResponse | null;
}

if (typeof document !== "undefined") {
  // you are safe to use the "document" object here
}

const mock = [
  {
    type: "BM%",
    shift: "Day",
    order_amt: 20,
    date: "24 June",
  },
  {
    type: "BM%",
    shift: "Night",
    order_amt: 22,
    date: "24 June",
  },
  {
    type: "Setup Time%",
    shift: "Day",
    order_amt: 5.9,
    date: "24 June",
  },
  {
    type: "Setup Time%",
    shift: "Night",
    order_amt: 7,
    date: "24 June",
  },
  {
    type: "CT Loss%",
    shift: "Day",
    order_amt: 5,
    date: "24 June",
  },
  {
    type: "CT Loss%",
    shift: "Night",
    order_amt: 7,
    date: "24 June",
  },
  {
    type: "Other%",
    shift: "Day",
    order_amt: 10,
    date: "24 June",
  },
  {
    type: "Other%",
    shift: "Night",
    order_amt: 6,
    date: "24 June",
  },
  {
    type: "OA%",
    shift: "Day",
    order_amt: 59.01,
    date: "24 June",
  },
  {
    type: "OA%",
    shift: "Night",
    order_amt: 58.35,
    date: "24 June",
  },

  {
    type: "BM%",
    shift: "Day",
    order_amt: 5,
    date: "25 June",
  },
  {
    type: "BM%",
    shift: "Night",
    order_amt: 30,
    date: "25 June",
  },
  {
    type: "Setup Time%",
    shift: "Day",
    order_amt: 5,
    date: "25 June",
  },
  {
    type: "Setup Time%",
    shift: "Night",
    order_amt: 6,
    date: "25 June",
  },
  {
    type: "CT Loss%",
    shift: "Day",
    order_amt: 5,
    date: "25 June",
  },
  {
    type: "CT Loss%",
    shift: "Night",
    order_amt: 15,
    date: "25 June",
  },
  {
    type: "Other%",
    shift: "Day",
    order_amt: 5,
    date: "25 June",
  },
  {
    type: "Other%",
    shift: "Night",
    order_amt: 9,
    date: "25 June",
  },
  {
    type: "OA%",
    shift: "Day",
    order_amt: 80.3,
    date: "25 June",
  },
  {
    type: "OA%",
    shift: "Night",
    order_amt: 40.4,
    date: "25 June",
  },

  {
    type: "BM%",
    shift: "Day",
    order_amt: 27,
    date: "26 June",
  },
  {
    type: "BM%",
    shift: "Night",
    order_amt: 7,
    date: "26 June",
  },
  {
    type: "Setup Time%",
    shift: "Day",
    order_amt: 6,
    date: "26 June",
  },
  {
    type: "Setup Time%",
    shift: "Night",
    order_amt: 5,
    date: "26 June",
  },
  {
    type: "CT Loss%",
    shift: "Day",
    order_amt: 14,
    date: "26 June",
  },
  {
    type: "CT Loss%",
    shift: "Night",
    order_amt: 7,
    date: "26 June",
  },
  {
    type: "Other%",
    shift: "Day",
    order_amt: 7,
    date: "26 June",
  },
  {
    type: "Other%",
    shift: "Night",
    order_amt: 4,
    date: "26 June",
  },
  {
    type: "OA%",
    shift: "Day",
    order_amt: 47.45,
    date: "26 June",
  },
  {
    type: "OA%",
    shift: "Night",
    order_amt: 77.4,
    date: "26 June",
  },

  {
    type: "BM%",
    shift: "Day",
    order_amt: 14,
    date: "27 June",
  },
  {
    type: "BM%",
    shift: "Night",
    order_amt: 5,
    date: "27 June",
  },
  {
    type: "Setup Time%",
    shift: "Day",
    order_amt: 7,
    date: "27 June",
  },
  {
    type: "Setup Time%",
    shift: "Night",
    order_amt: 6,
    date: "27 June",
  },
  {
    type: "CT Loss%",
    shift: "Day",
    order_amt: 5,
    date: "27 June",
  },
  {
    type: "CT Loss%",
    shift: "Night",
    order_amt: 4,
    date: "27 June",
  },
  {
    type: "Other%",
    shift: "Day",
    order_amt: 5,
    date: "27 June",
  },
  {
    type: "Other%",
    shift: "Night",
    order_amt: 5,
    date: "27 June",
  },
  {
    type: "OA%",
    shift: "Day",
    order_amt: 68.8,
    date: "27 June",
  },
  {
    type: "OA%",
    shift: "Night",
    order_amt: 80.03,
    date: "27 June",
  },

  {
    type: "BM%",
    shift: "Day",
    order_amt: 12,
    date: "28 June",
  },
  {
    type: "BM%",
    shift: "Night",
    order_amt: 5,
    date: "28 June",
  },
  {
    type: "Setup Time%",
    shift: "Day",
    order_amt: 7,
    date: "28 June",
  },
  {
    type: "Setup Time%",
    shift: "Night",
    order_amt: 5,
    date: "28 June",
  },
  {
    type: "CT Loss%",
    shift: "Day",
    order_amt: 5,
    date: "28 June",
  },
  {
    type: "CT Loss%",
    shift: "Night",
    order_amt: 5,
    date: "28 June",
  },
  {
    type: "Other%",
    shift: "Day",
    order_amt: 5,
    date: "28 June",
  },
  {
    type: "Other%",
    shift: "Night",
    order_amt: 5,
    date: "28 June",
  },
  {
    type: "OA%",
    shift: "Day",
    order_amt: 71.18,
    date: "28 June",
  },
  {
    type: "OA%",
    shift: "Night",
    order_amt: 80.05,
    date: "28 June",
  },
];
const StackHundredOeeColumn: React.FC = () => {
  const config = {
    data: mock,
    xField: "date",
    yField: "order_amt",
    isGroup: true,
    label: {},
    isStack: true,
    seriesField: "type",
    groupField: "shift",
  };

  return <Column {...config} />;
};

export default StackHundredOeeColumn;
