import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface SuperChickenModeState {
  value: boolean;
}

const initialState: SuperChickenModeState = {
  value: false,
};

export const superChickenModeSlice = createSlice({
  name: "superChickenMode",
  initialState,
  reducers: {
    setSuperChickenMode: (state, action: PayloadAction<boolean>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
  },
});

export const { setSuperChickenMode } = superChickenModeSlice.actions;

export const selectSuperChickenMode = (state: RootState) =>
  state.superChickenMode.value;

export default superChickenModeSlice.reducer;
