import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface SubscriptionsState {
  fallbackClubId: string;
}

const initialState: SubscriptionsState = {
  fallbackClubId: "",
};

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setFallbackClubId: (state, action: PayloadAction<string>) => {
      state.fallbackClubId = action.payload;
    },
  },
});

export const { setFallbackClubId } = subscriptionsSlice.actions;

export const selectFallbackClubId = (state: RootState) =>
  state.subscriptions.fallbackClubId;
export default subscriptionsSlice.reducer;
