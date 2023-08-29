import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ClubDevice } from "../../../appsync";
import { RootState } from "../../app/store";

export interface ClubDevicesState {
  value: Record<string, ClubDevice>;
}

const initialState: ClubDevicesState = { value: {} };

export const clubDevicesSlice = createSlice({
  name: "clubDevices",
  initialState,
  reducers: {
    setClubDevices: (
      state,
      action: PayloadAction<Record<string, ClubDevice>>,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
  },
});

export const { setClubDevices } = clubDevicesSlice.actions;

export const selectClubDevices = (state: RootState) => state.clubDevices.value;

export default clubDevicesSlice.reducer;
