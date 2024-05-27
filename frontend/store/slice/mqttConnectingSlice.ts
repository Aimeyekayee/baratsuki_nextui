import { StateCreator } from "zustand";
import MQTT from "mqtt";
import { IMqttConnectingState } from "../interfaces/mqttConnectingInterface";
import environment from "@/utils/environment";

export const MqttConnectingSlice: StateCreator<IMqttConnectingState> = (
  set,
  get
) => ({
  client: undefined,
  isConnected: false,
  mqttDataMachine1: {
    section_code: 0,
    line_id: 0,
    machine_no: "",
    ct_actual: 0,
    prod_actual: 0,
    prod_plan:0,
  },
  mqttDataMachine2: {
    section_code: 0,
    line_id: 0,
    machine_no: "",
    ct_actual: 0,
    prod_actual: 0,
    prod_plan:0
  },
  connect() {
    if (get().client) return;
    const client = MQTT.connect({
      hostname: "10.122.82.13",
      protocol: "ws",
      path: "/mqtt",
      port: 8083,
      reconnectPeriod: 3000,
    });
    set({ client });
    client.on("connect", () => {
      console.log("MQTT Client Connected");
      set({ client, isConnected: true });
    });
  },
  disconnect() {
    set((state) => {
      if (state.client) {
        state.client.end();
        return { ...state, client: undefined, isConnected: false };
      }
      return state;
    });
  },
  setMqttDataMachine1(response) {
    set({
      mqttDataMachine1: response,
    });
    // console.log("mqttData = ", get().mqttDataMachine1);
  },
  setMqttDataMachine2(response) {
    set({
      mqttDataMachine2: response,
    });
    // console.log("mqttData = ", get().mqttDataMachine2);
  },
});
