import { DataShiftColumn } from "@/components/chart/column/baratsuki.column";

export const generateAnnotations = (processedParameter: DataShiftColumn[]) => {
  const annotations: any[] = processedParameter
    .map((item) => {
      if (item.actual >= item.challenge_lower) {
        return null; // Skip periods with zero or invalid actual values
      } else {
        const gapContent = `Gap = ${
          item.actual < item.target_challenge ? "-" : "+"
        }${item.target_challenge - item.actual} pcs.`;
        const percentContent = `${
          item.actual < item.target_challenge ? "-" : "+"
        }${(
          Math.abs(
            (item.target_challenge - item.actual) / item.target_challenge
          ) * 100
        ).toFixed(2)}%`;
        return [
          {
            type: "text",
            content: gapContent,
            offsetX: 80,
            position: (xScale: any, yScale: any) => {
              return [
                `${xScale.scale(item.shift) * 100 - 18}%`,
                `${
                  (1 -
                    yScale.actual.scale(
                      (item.target_challenge + item.actual) / 2
                    )) *
                  100
                }%`,
              ];
            },
            style: {
              textAlign: "center",
              fill:
                item.shift === 1
                  ? item.actual < item.target_challenge
                    ? "#C40C0C"
                    : item.actual > item.target_challenge
                    ? "blue"
                    : "#FF8F8F"
                  : "#FF8F8F",
              fontSize: 10,
              fontWeight: "bold",
            },
            background: {
              padding: 10,
              style: {
                z: 0,
                radius: 17,
              },
            },
          },
          {
            type: "text",
            content: percentContent,
            offsetX: 45,
            position: (xScale: any, yScale: any) => {
              return [
                `${xScale.scale(item.shift) * 100 - 15}%`,
                `${
                  (1 -
                    yScale.actual.scale(
                      (item.target_challenge + item.actual) / 2.1
                    )) *
                  100
                }%`,
              ];
            },
            style: {
              textAlign: "center",
              fill:
                item.shift === 1
                  ? item.actual < item.target_challenge
                    ? "#C40C0C"
                    : item.actual > item.target_challenge
                    ? "blue"
                    : "#FF8F8F"
                  : "#FF8F8F",
              fontSize: 10,
              fontWeight: "bold",
            },
            background: {
              padding: 10,
              style: {
                z: 0,
                radius: 17,
              },
            },
          },
        ];
      }
    })
    .filter((annotation) => annotation !== null)
    .flat(); // Flatten the array of arrays into a single array

  return annotations;
};

export const generateAnnotationsTargetLineRangeRegion = (
  processedParameter: DataShiftColumn[]
) => {
  const annotationsTargetLineRangeRegion: any[] = processedParameter
    .map((item) => {
      if (item.shift === 1) {
        return [
          {
            type: "line",
            start: ["start", item.target_challenge],
            end: [item.shift, item.target_challenge],
            offsetX: 42,
            text: {
              // content: `Target = ${item.target} pcs.`,
              offsetY: -50,
              offsetX: -30,
              style: {
                textAlign: "left",
                fontSize: 16,
                fontWeight: "bold",
                fill: "rgba(24, 144, 255, 1)",
                textBaseline: "top",
              },
            },
            style: {
              opacity: 0.5,
              stroke: "rgba(24, 144, 255, 1)",
              lineWidth: 2.5,
              lineDash: [4, 4],
            },
          },
          {
            type: "line",
            start: ["start", item.challenge_lower],
            end: [item.shift, item.challenge_lower],
            offsetX: 42,
            text: {
              content: `${item.challenge_lower}`,
              offsetY: -9,
              offsetX: -24,
              position: "right",
              style: {
                textAlign: "left",
                fontSize: 10,
                fontWeight: "bold",
                fill: "rgba(24, 144, 255, 1)",
                textBaseline: "top",
              },
            },
            style: {
              stroke: "rgba(24, 144, 255, 1)",
              lineDash: [4, 4],
              lineWidth: 2.5,
            },
          },
          {
            type: "line",
            start: ["start", item.challenge_upper],
            end: [item.shift, item.challenge_upper],
            offsetX: 42,
            text: {
              content: `${item.challenge_upper}`,
              offsetX: -24,
              offsetY: -10,
              position: "right",
              style: {
                textAlign: "left",
                fontSize: 10,
                fontWeight: "bold",
                fill: "rgba(24, 144, 255, 1)",
                textBaseline: "top",
              },
            },
            style: {
              stroke: "rgba(24, 144, 255, 1)",
              lineDash: [4, 4],
              lineWidth: 2.5,
            },
          },
          {
            type: "region",
            start: ["start", item.challenge_lower],
            end: [item.shift, item.challenge_upper],
            offsetX: 42,
            style: {
              fill: "#1890FF",
              fillOpacity: 0.15,
            },
          },
        ];
      } else {
        return [
          {
            type: "line",
            start: [item.shift, item.target_challenge],
            end: ["end", item.target_challenge],
            offsetX: -42,
            text: {
              // content: `Target = ${item.target} pcs.`,
              offsetY: -40,
              offsetX: -30,
              style: {
                textAlign: "left",
                fontSize: 16,
                fontWeight: "bold",
                fill: "rgba(24, 144, 255, 1)",
                textBaseline: "top",
              },
            },
            style: {
              opacity: 0.5,
              stroke: "rgba(24, 144, 255, 1)",
              lineWidth: 2.5,
              lineDash: [4, 4],
            },
          },
          {
            type: "line",
            start: [item.shift, item.challenge_lower],
            end: ["end", item.challenge_lower],
            offsetX: -42,
            text: {
              content: `${item.challenge_lower}`,
              offsetY: -9,
              offsetX: -24,
              position: "right",
              style: {
                textAlign: "left",
                fontSize: 10,
                fontWeight: "bold",
                fill: "rgba(24, 144, 255, 1)",
                textBaseline: "top",
              },
            },
            style: {
              stroke: "rgba(24, 144, 255, 1)",
              lineDash: [4, 4],
              lineWidth: 2.5,
            },
          },
          {
            type: "line",
            start: [item.shift, item.challenge_upper],
            end: ["end", item.challenge_upper],
            offsetX: -42,
            text: {
              content: `${item.challenge_upper}`,
              offsetX: -24,
              offsetY: -10,
              position: "right",
              style: {
                textAlign: "left",
                fontSize: 10,
                fontWeight: "bold",
                fill: "rgba(24, 144, 255, 1)",
                textBaseline: "top",
              },
            },
            style: {
              stroke: "rgba(24, 144, 255, 1)",
              lineDash: [4, 4],
              lineWidth: 2.5,
            },
          },
          {
            type: "region",
            start: [item.shift, item.challenge_lower],
            end: ["end", item.challenge_upper],
            offsetX: -42,
            style: {
              fill: "#1890FF",
              fillOpacity: 0.15,
            },
          },
        ];
      }
    })
    .flat(); // Flatten the array of arrays into a single array

  return annotationsTargetLineRangeRegion;
};
