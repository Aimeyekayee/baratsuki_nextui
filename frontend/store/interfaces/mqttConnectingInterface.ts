import MQTT from "mqtt";
import { IMqttResponse } from "@/types/MqttType";

export interface IMqttConnectingState {
  client?: MQTT.MqttClient | undefined;
  isConnected: boolean;
  mqttDataMachine: IMqttResponse[];
  addOrUpdatePayload: (data: IMqttResponse) => void;
  connect: () => void;
  disconnect: () => void;
}
