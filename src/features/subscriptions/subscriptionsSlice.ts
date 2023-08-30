import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface SubscriptionsState {
  value: Record<string, string>;
}

const initialState: SubscriptionsState = { value: {} };

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSubscriptionStatus: (state, action: PayloadAction<[string, string]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value[action.payload[0]] = action.payload[1];
    },
  },
});

export const { setSubscriptionStatus } = subscriptionsSlice.actions;

export const selectSubscriptionById = (subId: string) => (state: RootState) =>
  state.subscriptions.value[subId];

export default subscriptionsSlice.reducer;
