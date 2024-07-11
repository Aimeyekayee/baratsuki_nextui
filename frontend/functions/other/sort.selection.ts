import { ILinename, ISection } from "@/types/section.type";

export const sortedLineName = (line_name: ILinename[]): ILinename[] => {
  const sortByFirstNumber = (a: any, b: any) => {
    const numA = parseInt(a.line_name.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.line_name.match(/\d+/)?.[0] || "0");
    return numA - numB;
  };
  return line_name.slice().sort(sortByFirstNumber);
};

export const sortedSection = (section: ISection[]): ISection[] => {
  return section
    .slice()
    .sort((a: ISection, b: ISection) =>
      a.section_name.localeCompare(b.section_name)
    );
};
