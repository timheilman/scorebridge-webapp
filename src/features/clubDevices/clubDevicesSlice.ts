import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Club, ClubDevice } from "../../../appsync";
import { RootState } from "../../app/store";

export interface ClubDevicesState {
  value: Record<string, ClubDevice>;
  club: Club | null;
}

const initialState: ClubDevicesState = {
  value: {},
  club: {
    __typename: "Club",
    id: "awaiting loading...",
    name: "awaiting loading...",
    updatedAt: new Date().toJSON(),
    createdAt: new Date().toJSON(),
  },
};

export const clubDevicesSlice = createSlice({
  name: "clubDevices",
  initialState,
  reducers: {
    setClub: (state, action: PayloadAction<Club | null>) => {
      state.club = action.payload;
    },
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
    insertClubDevice: (state, action: PayloadAction<ClubDevice>) => {
      state.value[action.payload.clubDeviceId] = action.payload;
    },
    deleteClubDevice: (state, action: PayloadAction<string>) => {
      // praying this magically works
      delete state.value[action.payload];
    },
  },
});

export const { setClub, setClubDevices, insertClubDevice, deleteClubDevice } =
  clubDevicesSlice.actions;

export const selectClubDevices = (state: RootState) => state.clubDevices.value;
export const selectClubName = (state: RootState) =>
  state.clubDevices.club?.name;
export default clubDevicesSlice.reducer;
