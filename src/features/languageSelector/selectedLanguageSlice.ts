import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";

export interface SelectedLanguageState {
  value: string | undefined;
  resolved: boolean;
}

const initialState: SelectedLanguageState = {
  value: undefined,
  resolved: false,
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
    setLanguageResolved: (state, action: PayloadAction<boolean>) => {
      state.resolved = action.payload;
    },
  },
});

export const { setLanguage, setLanguageResolved } =
  selectedLanguageSlice.actions;

export const selectLanguage = (state: RootState) =>
  state.selectedLanguage.value;
export const selectLanguageResolved = (state: RootState) =>
  state.selectedLanguage.resolved;

export default selectedLanguageSlice.reducer;
