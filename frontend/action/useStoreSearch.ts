import { SearchRecStore } from "@/store/search.store";
const useStoreSearch = () => {
  const sections = SearchRecStore((state) => state.sections);
  const machinename = SearchRecStore((state) => state.name_no_machine);
  const linename = SearchRecStore((state) => state.line_name);
  const set_linename = SearchRecStore((state) => state.setLinename);
  return {
    sections,
    machinename,
    linename,
    set_linename,
  };
};

export default useStoreSearch;
