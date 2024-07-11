import React from "react";
import { IconBxsTimeFive, IconFlag } from "@/components/icon";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Chip,
  CardFooter,
  CircularProgress,
  Divider,
  Button,
} from "@nextui-org/react";
import OAaverageColumn from "./chart/oa.average.column";
import { MoonFilledIcon, SunFilledIcon } from "../icons";
import ColumnChartRechart from "./chart/column.chart";
import Link from "next/link";

interface IProps {
  width: string;
}

const OAaverage: React.FC<IProps> = ({ width }) => {
  return (
    <Card
      className="bg-default-50 rounded-xl shadow-md flex flex-col justify-between py-4 px-6 "
      style={{ background: "#E6F1FE" }}
    >
      <CardHeader className="pb-0 pt-2 flex-col items-start">
        <div className="flex justify-between w-full px-0">
          <div className="flex flex-col">
            <p className="text-small uppercase font-bold text-[#1e293b]">
              OA Average%
            </p>
            <small className="text-default-500">24 - 28 June 2024</small>
          </div>
          <Button color="primary" size="sm" radius="sm">
            <a
              href="http://10.122.77.1:3004/daily?shift=1&line_id=25vZY4LRv_25vDDSeLv_25vrnuT4v_25va3bIkv_25vcK6RDv&section_code=414273vZY4LRv_414273vDDSeLv_414273vrnuT4v_414273va3bIkv_414273vcK6RDv&machine_no=6TM-0315vZY4LRv_6TM-0315vDDSeLv_6TM-0315vrnuT4v_6TM-0315va3bIkv_6TM-0315vcK6RDv&working_date=2024-06-24vZY4LRv_2024-06-25vDDSeLv_2024-06-26vrnuT4v_2024-06-27va3bIkv_2024-06-28vcK6RDv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore Daily ↗
            </a>
          </Button>
        </div>
      </CardHeader>
      <div className="flex w-auto">
        <div className="overflow-visible py-2 flex flex-col gap-4" style={{}}>
          <Card
            className="border-none bg-gradient-to-r from-blue-800 to-indigo-900"
            style={{ width: "15rem", height: "15rem" }}
          >
            <CardBody
              className="justify-center items-center pb-0"
              style={{ width: "15rem" }}
            >
              <CircularProgress
                classNames={{
                  svg: "w-36 h-36 drop-shadow-md",
                  indicator: "stroke-white",
                  track: "stroke-white/10",
                  value: "text-3xl font-semibold text-white",
                }}
                value={66.2}
                strokeWidth={4}
                showValueLabel={true}
              />
            </CardBody>
            <CardFooter className="justify-center items-center pt-0">
              <Chip
                classNames={{
                  base: "border-1 border-white/30",
                  content: "text-white/90 text-small font-semibold",
                }}
                variant="bordered"
              >
                AVERAGE
              </Chip>
            </CardFooter>
          </Card>

          <Card
            className="p-4 gap-2 flex justfy-center items-center"
            style={{ width: "15rem" }}
          >
            <Chip
              variant="flat"
              color="primary"
              style={{ height: "2rem" }}
              startContent={<IconBxsTimeFive size={18} />}
              radius="sm"
            >
              CT. Target
            </Chip>
            {/* <div style={{ flex: "1" }} className="flex gap-6">
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col">
                  <span className="text-center font-bold">81.38%</span>
                  <span className="text-center text-xs">27 June</span>
                </div>
                <small className="text-default-500">BEST</small>
              </div>
              <Divider orientation="vertical" />
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col">
                  <span className="text-center font-bold">14.08%</span>
                  <span className="text-center text-xs">24 June</span>
                </div>
                <small className="text-default-500">WORST</small>
              </div>
            </div> */}
            <div>
              <span className="text-xl font-bold">16.7 sec</span>
            </div>
          </Card>
          <Card
            className="p-4 gap-2 flex justfy-center items-center "
            style={{ width: "15rem" }}
          >
            <Chip
              variant="flat"
              color="warning"
              style={{ height: "2rem" }}
              startContent={<IconFlag size={18} />}
              radius="sm"
            >
              Challenge Rate
            </Chip>
            {/* <div style={{ flex: "1" }} className="flex gap-6">
              <div
                className="flex flex-col justify-center items-center"
                style={{ width: "49.5%" }}
              >
                <div className="flex flex-col">
                  <span className="text-center font-bold">81.66%</span>
                  <span className="text-center text-xs">25 June</span>
                </div>
                <small className="text-default-500">BEST</small>
              </div>
              <Divider orientation="vertical" />
              <div
                className="flex flex-col justify-center items-center"
                style={{ width: "49.5%" }}
              >
                <div className="flex flex-col">
                  <span className="text-center font-bold">48.25%</span>
                  <span className="text-center text-xs">26 June</span>
                </div>
                <small className="text-default-500">WORST</small>
              </div>
            </div> */}
            <div>
              <span className="text-xl font-bold">81%</span>
            </div>
          </Card>
        </div>
        <div style={{}} className="flex justify-center item-center">
          <div>
            {/* <OAaverageColumn /> */}
            <ColumnChartRechart />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OAaverage;
