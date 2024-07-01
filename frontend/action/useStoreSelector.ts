// import { GeneralStore } from "../store/general.store";
// import { MQTTStore } from "../store/mqttStore";
// const useStoreSelectors = () => {
//   const zone1 = GeneralStore((state) => state.zone1);
//   const zone2 = GeneralStore((state) => state.zone2);
//   const actualNotRealTimeMC1 = GeneralStore(
//     (state) => state.actualNotRealTimeMC1
//   );
//   const actualNotRealTimeMC2 = GeneralStore(
//     (state) => state.actualNotRealTimeMC2
//   );
//   const targetNotRealTimeMC1 = GeneralStore(
//     (state) => state.targetNotRealTimeMC1
//   );
//   const actualRealTimeMC1 = MQTTStore(
//     (state) => state.mqttDataMachine1.prod_actual
//   );
//   const actualRealTimeMC2 = MQTTStore(
//     (state) => state.mqttDataMachine2.prod_actual
//   );
//   const targetNotRealTimeMC2 = GeneralStore(
//     (state) => state.targetNotRealTimeMC2
//   );
//   const dataByShiftColumnMC1 = GeneralStore(
//     (state) => state.dataByShiftColumnMC1
//   );
//   const dataByShiftColumnMC2 = GeneralStore(
//     (state) => state.dataByShiftColumnMC2
//   );

//   return {
//     zone1,
//     zone2,
//     actualNotRealTimeMC1,
//     actualNotRealTimeMC2,
//     targetNotRealTimeMC1,
//     targetNotRealTimeMC2,
//     dataByShiftColumnMC1,
//     dataByShiftColumnMC2,
//     actualRealTimeMC1,
//     actualRealTimeMC2,
//   };
// };

// export default useStoreSelectors;
