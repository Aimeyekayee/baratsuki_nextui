import { StateCreator } from "zustand";
import MQTT from "mqtt";
import { IMqttConnectingState } from "../interfaces/mqttConnectingInterface";
import { IMqttResponse } from "@/types/MqttType";

export const MqttConnectingSlice: StateCreator<IMqttConnectingState> = (
  set,
  get
) => ({
  client: undefined,
  isConnected: false,
  mqttDataMachine: [] as IMqttResponse[],
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
  addOrUpdatePayload: (data) =>
    set((state) => {
      const updatedPayloads = state.mqttDataMachine.filter(
        (item) => item.machine_no !== data.machine_no
      );
      return { mqttDataMachine: [...updatedPayloads, data] };
    }),
});
