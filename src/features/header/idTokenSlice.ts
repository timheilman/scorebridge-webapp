import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface IdTokenState {
  cognitoGroups: string[] | undefined;
  clubId: string | undefined;
}

const initialState: IdTokenState = {
  cognitoGroups: undefined,
  clubId: undefined,
};

export const idTokenSlice = createSlice({
  name: "idToken",
  initialState,
  reducers: {
    setCognitoGroups: (state, action: PayloadAction<string[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.cognitoGroups = action.payload;
    },
    setClubId: (state, action: PayloadAction<string>) => {
      state.clubId = action.payload;
    },
  },
});

export const { setCognitoGroups, setClubId } = idTokenSlice.actions;

export const selectCognitoGroups = (state: RootState) =>
  state.idToken.cognitoGroups;
export const selectClubId = (state: RootState) => state.idToken.clubId;

export default idTokenSlice.reducer;
