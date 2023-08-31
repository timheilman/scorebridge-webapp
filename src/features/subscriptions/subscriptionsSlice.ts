import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentNode } from "graphql/language";

import { RootState } from "../../app/store";
import {
  subscriptionCreatedClubDevice,
  subscriptionDeletedClubDevice,
} from "../../graphql/subscriptions";

export interface SubscriptionsState {
  value: Record<string, string>;
  fallbackClubId: string;
  failingClubId: string;
}

const initialState: SubscriptionsState = {
  value: {
    createdClubDevice: "disconnected",
    deletedClubDevice: "disconnected",
  },
  fallbackClubId: "",
  failingClubId: "01H8Z4Y5GF5DADWSC449PYFWC2",
};

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSubscriptionStatus: (
      state,
      action: PayloadAction<[keyof allSubscriptionsI, string]>,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value[action.payload[0]] = action.payload[1];
    },
    setFallbackClubId: (state, action: PayloadAction<string>) => {
      state.fallbackClubId = action.payload;
    },
    setFailingClubId: (state, action: PayloadAction<string>) => {
      state.failingClubId = action.payload;
    },
  },
});

export const { setSubscriptionStatus, setFailingClubId, setFallbackClubId } =
  subscriptionsSlice.actions;

export interface allSubscriptionsI {
  createdClubDevice: DocumentNode;
  deletedClubDevice: DocumentNode;
}

export const subIdToSubGql: allSubscriptionsI = {
  createdClubDevice: subscriptionCreatedClubDevice,
  deletedClubDevice: subscriptionDeletedClubDevice,
};
export const selectSubscriptionById =
  (subId: keyof allSubscriptionsI) => (state: RootState) =>
    state.subscriptions.value[subId];
export const selectFallbackClubId = (state: RootState) =>
  state.subscriptions.fallbackClubId;
export const selectFailingClubId = (state: RootState) =>
  state.subscriptions.failingClubId;

export default subscriptionsSlice.reducer;
