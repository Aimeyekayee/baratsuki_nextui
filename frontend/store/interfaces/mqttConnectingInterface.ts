import MQTT from 'mqtt';
import { IMqttResponse,MqttData} from '@/types/MqttType';

export interface IMqttConnectingState  {
  client?: MQTT.MqttClient | undefined;
  isConnected: boolean;
  mqttDataMachine1 : MqttData;
  mqttDataMachine2 : MqttData;

  setMqttDataMachine1:(response : IMqttResponse) => void
  setMqttDataMachine2:(response : IMqttResponse) => void
  connect: () => void;
  disconnect: () => void;

};


// export interface IMQTTDataState {
//   topicToDataQueue: Record<string, MqttData[]>;
//   getLatestMQTTDataBySetting: (setting: MQTTSetting) => MqttData | undefined;
//   addData: (topic: string, data: MqttData) => void;
// }