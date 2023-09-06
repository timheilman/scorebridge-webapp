import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface SubscriptionsState {
  fallbackClubId: string;
  failingClubId: string;
}

const initialState: SubscriptionsState = {
  fallbackClubId: "",
  failingClubId: "01H8Z4Y5GF5DADWSC449PYFWC2",
};

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setFallbackClubId: (state, action: PayloadAction<string>) => {
      state.fallbackClubId = action.payload;
    },
    setFailingClubId: (state, action: PayloadAction<string>) => {
      state.failingClubId = action.payload;
    },
  },
});

export const { setFailingClubId, setFallbackClubId } =
  subscriptionsSlice.actions;

export const selectFallbackClubId = (state: RootState) =>
  state.subscriptions.fallbackClubId;
export const selectFailingClubId = (state: RootState) =>
  state.subscriptions.failingClubId;

export default subscriptionsSlice.reducer;
