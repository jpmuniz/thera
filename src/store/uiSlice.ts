import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type UiState = {
  selectedSalesOrderId?: string;
  lastEvent?: string;
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {} as UiState,
  reducers: {
    salesOrderSelected: (state, action: PayloadAction<string | undefined>) => {
      state.selectedSalesOrderId = action.payload;
    },
    domainEventRequested: (_state, _action: PayloadAction<string>) => {},
    domainEventRegistered: (state, action: PayloadAction<string>) => {
      state.lastEvent = action.payload;
    }
  }
});

export const { salesOrderSelected, domainEventRequested, domainEventRegistered } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
