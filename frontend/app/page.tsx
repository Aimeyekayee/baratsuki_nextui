"use client";

import FormSearch from "@/components/form/form.search";
import BaratsukiChallengeTab from "@/components/tabs/baratsukichallenge.tabs";
import CardMainDisplay from "@/components/card/card.main";
import HeaderBaratsuki from "@/components/header";
import useStoreSelectors from "@/store/useStoreSelector";

export default function Home() {
  const {
    zone1,
    zone2,
    actualNotRealTimeMC1,
    actualNotRealTimeMC2,
    targetNotRealTimeMC1,
    targetNotRealTimeMC2,
    dataByShiftColumnMC1,
    dataByShiftColumnMC2,
    actualRealTimeMC1,
    actualRealTimeMC2,
  } = useStoreSelectors();
  console.log("qwr", dataByShiftColumnMC1);
  return (
    <section className="flex flex-col items-center justify-center gap-4 ">
      <HeaderBaratsuki />
      <FormSearch />
      <div className="flex items-center justify-center">
        <BaratsukiChallengeTab />
      </div>
      <CardMainDisplay
        actual={actualNotRealTimeMC1}
        target={targetNotRealTimeMC1}
        realtimeActual={actualRealTimeMC1}
        zone_number={1}
        zone={zone1}
        dataColumn={dataByShiftColumnMC1}
      />
      <CardMainDisplay
        actual={actualNotRealTimeMC2}
        target={targetNotRealTimeMC2}
        zone_number={2}
        realtimeActual={actualRealTimeMC2}
        zone={zone2}
        dataColumn={dataByShiftColumnMC2}
      />
    </section>
  );
}
