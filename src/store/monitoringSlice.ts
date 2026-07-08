import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SalesOrderFilters } from "@/shared/types";

const initialState: SalesOrderFilters = {
  status: "TODOS",
  customerId: "",
  transportTypeId: "",
  date: ""
};

const monitoringSlice = createSlice({
  name: "monitoring",
  initialState,
  reducers: {
    filtersChanged: (_state, action: PayloadAction<SalesOrderFilters>) => action.payload,
    filtersReset: () => initialState
  }
});

export const { filtersChanged, filtersReset } = monitoringSlice.actions;
export const monitoringReducer = monitoringSlice.reducer;
