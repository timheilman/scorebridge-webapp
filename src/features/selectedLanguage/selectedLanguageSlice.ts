import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface SelectedLanguageState {
  value: string;
}

const initialState: SelectedLanguageState = {
  value: "en",
};

export const selectedLanguageSlice = createSlice({
  name: "selectedLanguage",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
  },
});

export const { setLanguage } = selectedLanguageSlice.actions;

export const selectLanguage = (state: RootState) =>
  state.selectedLanguage.value;

export default selectedLanguageSlice.reducer;
