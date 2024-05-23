import React from "react";
import { Flex, Typography } from "antd";
import { MQTTStore } from "@/store/mqttStore";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
} from "@nextui-org/react";
import { GeneralStore } from "@/store/general.store";

interface IProps {
  target: number;
  actual: number;
  currentDate: string;
  dateString: string | string[];
  zone: number;
}

const MonitorData: React.FC<IProps> = ({
  target,
  actual,
  currentDate,
  dateString,
  zone,
}) => {
  const mqttDataMachine1 = MQTTStore((state) => state.mqttDataMachine1);
  const mqttDataMachine2 = MQTTStore((state) => state.mqttDataMachine2);
  const shift = GeneralStore((state) => state.shift);
  const baratsukiRate = GeneralStore((state) => state.baratsukiRate);
  const targetMqtt = target;
  const targetNotRealtime = 2200;
  const actualMqtt1 = mqttDataMachine1.prod_actual;
  const actualMqtt2 = mqttDataMachine2.prod_actual;

  const targetValues: { [key: number]: number } = {
    70: 1540,
    77: 1694,
    85: 1870,
    100: 2200,
  };
  const baratsukiRateNumber = Number(baratsukiRate);
  let targets: number = targetValues[baratsukiRateNumber] || 0;

  return (
    <Flex
      style={{ height: "20%", width: "100%" }}
      gap={10}
      align="center"
      justify="center"
    >
      <Flex justify="center" align="center">
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: shift === "day" ? "black" : "white",
          }}
        >
          Target : &nbsp;
        </Typography>
        <Card
          shadow="sm"
          radius="sm"
          style={{
            background: "black",
            height: "100%",
            width: "10rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: "2rem",
            }}
          >
            {dateString === currentDate ? target.toFixed(0) : targets}
          </Typography>
        </Card>
      </Flex>
      <Flex justify="center" align="center">
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: shift === "day" ? "black" : "white",
          }}
        >
          Actual :&nbsp;&nbsp;
        </Typography>
        <Card
          shadow="sm"
          radius="sm"
          style={{
            background: "black",
            height: "100%",
            width: "10rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: "2rem",
            }}
          >
            {dateString === currentDate
              ? zone === 1
                ? mqttDataMachine1.prod_actual
                : mqttDataMachine2.prod_actual
              : actual}
          </Typography>
        </Card>
      </Flex>
      <Flex justify="center" align="center">
        <Typography
          style={{
            textAlign: "center",
            fontSize: "1.5rem",
            color: shift === "day" ? "black" : "white",
          }}
        >
          OA : &nbsp;
        </Typography>
        <Card
          shadow="sm"
          radius="sm"
          style={{
            background: "black",
            height: "100%",
            width: "10rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              color: "white",
              fontWeight: "600",
              fontSize: "2rem",
            }}
          >
            {dateString === currentDate
              ? zone === 1
                ? ((mqttDataMachine1.prod_actual / targetMqtt) * 100).toFixed(2)
                : ((mqttDataMachine2.prod_actual / targetMqtt) * 100).toFixed(2)
              : ((actual / targetNotRealtime) * 100).toFixed(2)}
          </Typography>
        </Card>
      </Flex>
    </Flex>
  );
};

export default MonitorData;
