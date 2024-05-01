const environment = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  API_KEY: process.env.NEXT_PUBLIC_API_KEY ?? "",
  MQTT_USER: process.env.MQTT_USER ?? "",
  MQTT_PASSWORD: process.env.MQTT_PASSWORD ?? "",
  MQTT_HOST: process.env.MQTT_HOST ?? "",
  MQTT_PORT: process.env.MQTT_PORT ?? "",
};

export default environment;
