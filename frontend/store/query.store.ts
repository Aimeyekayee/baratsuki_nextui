import { create } from "zustand";
import { QueryParams } from "@/types/query.type";

interface IMode {
  queryParamsUrl: string | null;
  queryParamsValue: QueryParams;
  setQueryParamsUrl: (queryParamsUrl: string | null) => void;
  setQueryParamsValue: (queryParamsValue: QueryParams) => void;
}

export const QueryParamStore = create<IMode>((...args) => {
  const [set, get] = args;
  return {
    queryParamsUrl: "",
    queryParamsValue: {},
    setQueryParamsUrl(queryParamsUrl) {
      set({ queryParamsUrl });
    },
    setQueryParamsValue(queryParamsValue) {
      set({ queryParamsValue });
    },
  };
});
