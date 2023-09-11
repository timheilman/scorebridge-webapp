import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentNode } from "graphql/language";

import {
  subscriptionCreatedClubDevice,
  subscriptionDeletedClubDevice,
  subscriptionUpdatedClub,
  subscriptionUpdatedClubDevice,
} from "./graphql/subscriptions";

export interface allSubscriptionsI {
  createdClubDevice: DocumentNode;
  updatedClubDevice: DocumentNode;
  deletedClubDevice: DocumentNode;
  updatedClub: DocumentNode;
}

export const subIdToSubGql: allSubscriptionsI = {
  createdClubDevice: subscriptionCreatedClubDevice,
  updatedClubDevice: subscriptionUpdatedClubDevice,
  deletedClubDevice: subscriptionDeletedClubDevice,
  updatedClub: subscriptionUpdatedClub,
};
export type SubscriptionsStates = Record<keyof allSubscriptionsI, string>;

const initialState: SubscriptionsStates = Object.keys(subIdToSubGql).reduce<
  Record<keyof allSubscriptionsI, string>
>(
  (acc: SubscriptionsStates, subId: string) => {
    acc[subId as keyof allSubscriptionsI] = "disconnected";
    return acc;
  },
  <SubscriptionsStates>{},
);

export const subscriptionStatesSlice = createSlice({
  name: "subscriptionStates",
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
      state[action.payload[0]] = action.payload[1];
    },
  },
});

export const { setSubscriptionStatus } = subscriptionStatesSlice.actions;

export const selectSubscriptionStateById =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (subId: keyof allSubscriptionsI) => (state: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    return state.subscriptionStates[subId];
  };

export default subscriptionStatesSlice.reducer;
