import React from "react";
import { Input } from "@nextui-org/react";
import { MachineDataRaw } from "@/types/baratsuki.type";

interface ParameterInputsProps {
  titleProps: any; // Adjust type based on actual props
  data: MachineDataRaw[];
  handleCTTargetChange: (newCTTarget: number) => void;
  handelChallengeTarget: (newChallengeTarget: number) => void;
  handleExclusionTimeChange: (newExclusionTime: number, index: number) => void;
}

const ParameterInputs: React.FC<ParameterInputsProps> = ({
  titleProps,
  data,
  handleCTTargetChange,
  handleExclusionTimeChange,
  handelChallengeTarget,
}) => {
  const numColumns = Math.ceil(data.length / 4);

  return (
    <div className="px-1 py-2 w-full">
      <p className="text-small font-bold text-foreground" {...titleProps}>
        Edit your parameters.
      </p>
      <div className="mt-2 flex flex-row gap-4">
        {[...Array(numColumns)].map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-2">
            {data.slice(colIndex * 4, colIndex * 4 + 4).map((item, index) => (
              <Input
                key={index}
                defaultValue={item.exclusion_time.toString()}
                label={`Exclusion Time of ${item.period}`}
                style={{ width: "11rem" }}
                size="sm"
                variant="bordered"
                endContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">sec.</span>
                  </div>
                }
                onChange={(e) =>
                  handleExclusionTimeChange(
                    Number(e.target.value),
                    colIndex * 4 + index
                  )
                }
              />
            ))}
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <Input
            defaultValue={data[0].ct_target.toString()}
            label="C.T. Target"
            size="sm"
            style={{ width: "7rem" }}
            variant="bordered"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">sec.</span>
              </div>
            }
            onChange={(e) => handleCTTargetChange(Number(e.target.value))}
          />
          <Input
            defaultValue={data[0].challenge_target.toString()}
            label="Challenge Target"
            size="sm"
            style={{ width: "7rem" }}
            variant="bordered"
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">%</span>
              </div>
            }
            onChange={(e) => handelChallengeTarget(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default ParameterInputs;
