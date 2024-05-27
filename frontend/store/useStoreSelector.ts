import { GeneralStore } from "./general.store";
const useStoreSelectors = () => {
  const zone1 = GeneralStore((state) => state.zone1);
  const zone2 = GeneralStore((state) => state.zone2);
  const actualNotRealTimeMC1 = GeneralStore(
    (state) => state.actualNotRealTimeMC1
  );
  const actualNotRealTimeMC2 = GeneralStore(
    (state) => state.actualNotRealTimeMC2
  );
  const targetNotRealTimeMC1 = GeneralStore(
    (state) => state.targetNotRealTimeMC1
  );
  const targetNotRealTimeMC2 = GeneralStore(
    (state) => state.targetNotRealTimeMC2
  );
  const dataByShiftColumnMC1 = GeneralStore(
    (state) => state.dataByShiftColumnMC1
  );
  const dataByShiftColumnMC2 = GeneralStore(
    (state) => state.dataByShiftColumnMC2
  );

  return {
    zone1,
    zone2,
    actualNotRealTimeMC1,
    actualNotRealTimeMC2,
    targetNotRealTimeMC1,
    targetNotRealTimeMC2,
    dataByShiftColumnMC1,
    dataByShiftColumnMC2,
  };
};

export default useStoreSelectors;
