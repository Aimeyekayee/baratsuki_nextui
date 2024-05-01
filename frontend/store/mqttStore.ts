import { create } from "zustand";
import { MqttConnectingSlice } from "./slice/mqttConnectingSlice";
import { IMqttConnectingState } from "./interfaces/mqttConnectingInterface";

export const MQTTStore = create<IMqttConnectingState>(
  (...args) => {
    const [set, get] = args;

    return {
      ...MqttConnectingSlice(...args),
    };
  }
);
